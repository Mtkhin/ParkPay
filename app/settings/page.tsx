"use client";

import { useState } from "react";
import {
  Check,
  Database,
  Eraser,
  Settings,
  TriangleAlert,
} from "lucide-react";

import type { ParkingTicket } from "@/lib/parking/ticket";

import {
  removeFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

type MessageType = "SUCCESS" | "ERROR" | null;

function getDatePart(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function minutesAgo(minutes: number) {
  return new Date(
    Date.now() - minutes * 60 * 1000
  ).toISOString();
}

function createDemoData(): ParkingTicket[] {
  const now = new Date();
  const datePart = getDatePart(now);

  return [
    {
      id: `PP-${datePart}-001`,
      vehicleType: "CAR",
      plateNumber: "1AB-4821",
      entryTime: minutesAgo(38),
      status: "ACTIVE",
      paymentStatus: "PENDING",
      createdAt: minutesAgo(38),
    },
    {
      id: `PP-${datePart}-002`,
      vehicleType: "MOTORCYCLE",
      plateNumber: "8กข-214",
      entryTime: minutesAgo(74),
      status: "ACTIVE",
      paymentStatus: "PENDING",
      createdAt: minutesAgo(74),
    },
    {
      id: `PP-${datePart}-003`,
      vehicleType: "BICYCLE",
      entryTime: minutesAgo(22),
      status: "ACTIVE",
      paymentStatus: "PENDING",
      createdAt: minutesAgo(22),
    },
    {
      id: `PP-${datePart}-004`,
      vehicleType: "CAR",
      plateNumber: "4กท-8820",
      entryTime: minutesAgo(180),
      exitTime: minutesAgo(40),
      durationMinutes: 140,
      fee: 40,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "CASH",
      createdAt: minutesAgo(180),
    },
    {
      id: `PP-${datePart}-005`,
      vehicleType: "MOTORCYCLE",
      plateNumber: "2ขค-563",
      entryTime: minutesAgo(150),
      exitTime: minutesAgo(65),
      durationMinutes: 85,
      fee: 15,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "QR",
      createdAt: minutesAgo(150),
    },
    {
      id: `PP-${datePart}-006`,
      vehicleType: "CAR",
      plateNumber: "9AA-7210",
      entryTime: minutesAgo(95),
      exitTime: minutesAgo(20),
      durationMinutes: 75,
      fee: 30,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      createdAt: minutesAgo(95),
    },
  ];
}

export default function SettingsPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>(null);

  function handleLoadDemoData() {
    const confirmed = window.confirm(
      "Load demo data? This will replace the current parking and payment records."
    );

    if (!confirmed) {
      return;
    }

    const demoTickets = createDemoData();

    const completedPayments = demoTickets.filter(
      (ticket) =>
        ticket.status === "COMPLETED" &&
        ticket.paymentStatus === "PAID"
    );

    saveToStorage(
      STORAGE_KEYS.TICKETS,
      demoTickets
    );

    saveToStorage(
      STORAGE_KEYS.PAYMENTS,
      completedPayments
    );

    setMessageType("SUCCESS");
    setMessage(
      "Demo data loaded successfully. ParkPay now contains active and completed parking records."
    );
  }

  function handleClearData() {
    const confirmed = window.confirm(
      "Are you sure you want to clear all parking and payment data? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    removeFromStorage(STORAGE_KEYS.TICKETS);
    removeFromStorage(STORAGE_KEYS.PAYMENTS);

    setMessageType("SUCCESS");
    setMessage(
      "All parking and payment data has been cleared."
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          System Configuration
        </p>

        <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Manage demonstration data and local ParkPay
          records.
        </p>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
          <section className="rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="border-b border-white/8 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 text-white/35">
                  <Database
                    size={17}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Demonstration
                  </p>

                  <h2 className="mt-1 font-serif text-xl">
                    Demo Data
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="max-w-2xl text-sm leading-6 text-white/40">
                Populate ParkPay with sample active vehicles,
                completed parking sessions, and different
                payment methods for demonstration and testing.
              </p>

              <div className="mt-6 rounded-xl border border-white/8 bg-[#090b0d] p-5">
                <p className="text-xs font-medium text-white/55">
                  Demo dataset includes
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "3 active parking sessions",
                    "3 completed parking sessions",
                    "Cars, motorcycles and bicycles",
                    "Cash, card and QR payments",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs text-white/35"
                    >
                      <Check
                        size={13}
                        strokeWidth={1.8}
                        className="text-[#9bc7d5]"
                      />

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLoadDemoData}
                className="mt-6 flex items-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
              >
                <Database
                  size={16}
                  strokeWidth={1.7}
                />
                Load Demo Data
              </button>
            </div>
          </section>

          <section className="h-fit rounded-xl border border-red-300/10 bg-[#0d1012]">
            <div className="border-b border-white/8 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-300/10 text-red-200/45">
                  <Eraser
                    size={17}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Data Management
                  </p>

                  <h2 className="mt-1 font-serif text-xl">
                    Clear Records
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-white/40">
                Remove all locally stored parking tickets and
                payment records from this browser.
              </p>

              <div className="mt-5 flex gap-3 rounded-lg border border-red-300/10 bg-red-300/[0.025] p-4">
                <TriangleAlert
                  size={16}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-red-200/50"
                />

                <p className="text-xs leading-5 text-red-100/35">
                  This action permanently removes parking data.
                  Your demo login state will remain unchanged.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearData}
                className="mt-6 flex items-center gap-2 rounded-lg border border-red-300/15 px-5 py-3 text-sm text-red-100/55 transition hover:bg-red-300/[0.04] hover:text-red-100/75"
              >
                <Eraser
                  size={16}
                  strokeWidth={1.6}
                />
                Clear All Data
              </button>
            </div>
          </section>
        </div>

        {message && (
          <div
            className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
              messageType === "ERROR"
                ? "border-red-300/15 bg-red-300/[0.035]"
                : "border-[#9bc7d5]/15 bg-[#9bc7d5]/5"
            }`}
          >
            <div className="mt-0.5">
              {messageType === "ERROR" ? (
                <TriangleAlert
                  size={16}
                  strokeWidth={1.6}
                  className="text-red-200/60"
                />
              ) : (
                <Check
                  size={16}
                  strokeWidth={1.8}
                  className="text-[#9bc7d5]"
                />
              )}
            </div>

            <p className="text-xs leading-5 text-white/45">
              {message}
            </p>
          </div>
        )}

        <section className="mt-6 rounded-xl border border-white/8 bg-[#0d1012] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 text-white/30">
              <Settings
                size={17}
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="font-serif text-lg text-white/65">
                Frontend-only prototype
              </p>

              <p className="mt-2 max-w-3xl text-xs leading-6 text-white/30">
                ParkPay stores its tickets, payments, and demo
                login state only in this browser using
                localStorage. Data is not shared with other
                computers or browsers, and this prototype does
                not use a backend database.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}