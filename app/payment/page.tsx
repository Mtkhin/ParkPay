"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  CircleParking,
  CreditCard,
  Printer,
  QrCode,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";

import {
  type ParkingTicket,
  type PaymentMethod,
} from "@/lib/parking/ticket";

import { processPayment } from "@/lib/payment/payment";

import {
  getFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

const paymentMethods: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Banknote;
}[] = [
  {
    value: "CASH",
    label: "Cash",
    description: "Pay directly at the parking counter",
    icon: Banknote,
  },
  {
    value: "CARD",
    label: "Card",
    description: "Simulated card payment",
    icon: CreditCard,
  },
  {
    value: "QR",
    label: "QR Payment",
    description: "Simulated QR payment",
    icon: QrCode,
  },
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatVehicleName(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatPaymentMethod(value: PaymentMethod) {
  if (value === "QR") {
    return "QR Payment";
  }

  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function PaymentPage() {
  const [ticket, setTicket] =
    useState<ParkingTicket | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [completedTicket, setCompletedTicket] =
    useState<ParkingTicket | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const ticketId = params.get("ticket");

    if (!ticketId) {
      setError("No ticket was selected for payment.");
      setLoading(false);
      return;
    }

    const tickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    const foundTicket = tickets.find(
      (item) =>
        item.id.toLowerCase() ===
        ticketId.toLowerCase()
    );

    if (!foundTicket) {
      setError("Ticket not found.");
      setLoading(false);
      return;
    }

    if (foundTicket.status === "COMPLETED") {
      setError("This ticket has already been completed.");
      setLoading(false);
      return;
    }

    if (foundTicket.paymentStatus === "PAID") {
      setError("This ticket has already been paid.");
      setLoading(false);
      return;
    }

    setTicket(foundTicket);
    setLoading(false);
  }, []);

  function handleConfirmPayment() {
    if (!ticket) {
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    try {
      const tickets = getFromStorage<ParkingTicket[]>(
        STORAGE_KEYS.TICKETS,
        []
      );

      const latestTicket = tickets.find(
        (item) => item.id === ticket.id
      );

      if (!latestTicket) {
        setError("Ticket not found.");
        return;
      }

      const paidTicket = processPayment(
        latestTicket,
        paymentMethod,
        new Date()
      );

      const updatedTickets = tickets.map((item) =>
        item.id === paidTicket.id
          ? paidTicket
          : item
      );

      saveToStorage(
        STORAGE_KEYS.TICKETS,
        updatedTickets
      );

      const payments = getFromStorage<ParkingTicket[]>(
        STORAGE_KEYS.PAYMENTS,
        []
      );

      saveToStorage(
        STORAGE_KEYS.PAYMENTS,
        [...payments, paidTicket]
      );

      setError("");
      setCompletedTicket(paidTicket);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process payment."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b0d] text-white/40">
        <p className="text-sm">
          Loading payment details...
        </p>
      </div>
    );
  }

  if (completedTicket) {
    return (
      <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
        <header className="border-b border-white/8 px-8 py-7 lg:px-10">
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
            Payment Complete
          </p>

          <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
            Receipt
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Payment was processed successfully.
          </p>
        </header>

        <main className="mx-auto max-w-3xl px-8 py-10">
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#9bc7d5]/15 bg-[#9bc7d5]/5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#9bc7d5]/25 text-[#9bc7d5]">
              <Check size={17} strokeWidth={2} />
            </div>

            <div>
              <p className="text-sm font-medium text-white/70">
                Payment successful
              </p>

              <p className="mt-0.5 text-xs text-white/30">
                The parking ticket has been closed.
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-xl border border-white/10 bg-[#f0ede5] text-[#111315]">
            <div className="flex items-start justify-between border-b border-black/10 px-7 py-6">
              <div>
                <p className="font-serif text-3xl tracking-tight">
                  ParkPay
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/40">
                  Parking Payment Receipt
                </p>
              </div>

              <ReceiptText
                size={25}
                strokeWidth={1.4}
                className="text-black/30"
              />
            </div>

            <div className="space-y-6 px-7 py-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                  Ticket ID
                </p>

                <p className="mt-1 font-mono text-base">
                  {completedTicket.id}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm">
                    {formatVehicleName(
                      completedTicket.vehicleType
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Plate Number
                  </p>

                  <p className="mt-1 text-sm">
                    {completedTicket.plateNumber ??
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Entry Time
                  </p>

                  <p className="mt-1 text-sm">
                    {formatDateTime(
                      completedTicket.entryTime
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Exit Time
                  </p>

                  <p className="mt-1 text-sm">
                    {completedTicket.exitTime
                      ? formatDateTime(
                          completedTicket.exitTime
                        )
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Parking Duration
                  </p>

                  <p className="mt-1 text-sm">
                    {formatDuration(
                      completedTicket.durationMinutes ??
                        0
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm">
                    {completedTicket.paymentMethod
                      ? formatPaymentMethod(
                          completedTicket.paymentMethod
                        )
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-black/20 pt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                      Total Paid
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      Payment Status: PAID
                    </p>
                  </div>

                  <p className="font-serif text-4xl tracking-tight">
                    ฿{completedTicket.fee ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Printer size={15} strokeWidth={1.7} />
              Print Receipt
            </button>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.04] hover:text-white"
            >
              <CircleParking
                size={15}
                strokeWidth={1.7}
              />
              Dashboard
            </Link>

            <Link
              href="/entry"
              className="flex items-center justify-center rounded-lg bg-[#f3f0e8] px-4 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
            >
              New Vehicle Entry
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Payment Processing
        </p>

        <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
          Parking Payment
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Select a payment method and confirm the
          parking transaction.
        </p>
      </header>

      <main className="px-8 py-8 lg:px-10">
        {error && !ticket ? (
          <section className="mx-auto max-w-xl rounded-xl border border-white/8 bg-[#0d1012] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-400/15 bg-red-400/[0.04] text-red-300/70">
              <TriangleAlert
                size={21}
                strokeWidth={1.5}
              />
            </div>

            <h2 className="mt-5 font-serif text-xl">
              Unable to open payment
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/35">
              {error}
            </p>

            <Link
              href="/exit"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#f3f0e8] px-4 py-2.5 text-sm font-medium text-[#111315]"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.7}
              />
              Back to Vehicle Exit
            </Link>
          </section>
        ) : ticket ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
            <section className="rounded-xl border border-white/8 bg-[#0d1012]">
              <div className="border-b border-white/8 px-6 py-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Payment Method
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Choose how to pay
                </h2>
              </div>

              <div className="space-y-3 p-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const selected =
                    paymentMethod === method.value;

                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method.value);
                        setError("");
                      }}
                      className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-[#9bc7d5]/45 bg-[#9bc7d5]/7"
                          : "border-white/8 bg-white/[0.015] hover:border-white/15"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-[#9bc7d5]/30 text-[#9bc7d5]"
                            : "border-white/8 text-white/35"
                        }`}
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.6}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-serif text-lg text-white/70">
                          {method.label}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {method.description}
                        </p>
                      </div>

                      {selected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9bc7d5] text-[#0b0d0f]">
                          <Check
                            size={12}
                            strokeWidth={2}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}

                {error && (
                  <div className="flex gap-3 rounded-lg border border-red-400/15 bg-red-400/[0.04] p-4">
                    <TriangleAlert
                      size={16}
                      className="mt-0.5 shrink-0 text-red-300/70"
                    />

                    <p className="text-xs text-red-200/65">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3.5 text-sm font-medium text-[#111315] transition hover:bg-white"
                >
                  <Check
                    size={16}
                    strokeWidth={1.8}
                  />
                  Confirm Payment
                </button>
              </div>
            </section>

            <section className="h-fit rounded-xl border border-white/8 bg-[#0d1012]">
              <div className="border-b border-white/8 px-6 py-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Transaction
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Payment summary
                </h2>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Ticket
                  </p>

                  <p className="mt-1 font-mono text-sm text-white/65">
                    {ticket.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Vehicle
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      {formatVehicleName(
                        ticket.vehicleType
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                      Plate
                    </p>

                    <p className="mt-1 text-sm text-white/55">
                      {ticket.plateNumber ??
                        "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-5">
                  <p className="text-xs leading-5 text-white/30">
                    Final duration and fee will be calculated
                    at the exact time payment is confirmed.
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}