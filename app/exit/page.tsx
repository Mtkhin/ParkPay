"use client";

import { createElement } from "react";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  Bike,
  CarFront,
  Clock3,
  LogOut,
  Motorbike,
  Search,
  Ticket,
  TriangleAlert,
} from "lucide-react";

import {
  calculateAdditionalHours,
} from "@/lib/parking/calculateFee";

import {
  calculateTicketExit,
  type ParkingTicket,
  type TicketExitSummary,
} from "@/lib/parking/ticket";

import {
  PARKING_RATES,
  type VehicleType,
} from "@/lib/parking/vehicleTypes";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

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

function getVehicleIcon(vehicleType: VehicleType) {
  if (vehicleType === "BICYCLE") {
    return Bike;
  }

  if (vehicleType === "MOTORCYCLE") {
    return Motorbike;
  }

  return CarFront;
}

function formatVehicleName(vehicleType: VehicleType) {
  return (
    vehicleType.charAt(0) +
    vehicleType.slice(1).toLowerCase()
  );
}

interface FoundTicket {
  ticket: ParkingTicket;
  exitSummary: TicketExitSummary;
}

export default function VehicleExitPage() {
  const [ticketId, setTicketId] = useState("");
  const [foundTicket, setFoundTicket] =
    useState<FoundTicket | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const ticketFromUrl = params.get("ticket");

    if (ticketFromUrl) {
      const timeoutId = window.setTimeout(() => {
        setTicketId(ticketFromUrl);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, []);

  function findTicket(id: string) {
    const trimmedId = id.trim();

    setError("");
    setFoundTicket(null);

    if (!trimmedId) {
      setError("Please enter a ticket ID.");
      return;
    }

    const tickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    const ticket = tickets.find(
      (item) =>
        item.id.toLowerCase() ===
        trimmedId.toLowerCase()
    );

    if (!ticket) {
      setError(
        "Ticket not found. Check the ticket ID and try again."
      );
      return;
    }

    try {
      const exitSummary = calculateTicketExit(
        ticket,
        new Date()
      );

      setFoundTicket({
        ticket,
        exitSummary,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process this ticket."
      );
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    findTicket(ticketId);
  }

  const rates = foundTicket
    ? PARKING_RATES[foundTicket.ticket.vehicleType]
    : null;

  const additionalHours = foundTicket
    ? calculateAdditionalHours(
        foundTicket.exitSummary.durationMinutes
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Parking Operations
        </p>

        <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
          Vehicle Exit
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Locate an active parking ticket and calculate the
          final parking fee.
        </p>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="h-fit rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="border-b border-white/8 px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Ticket Lookup
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Find parking ticket
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <label
                htmlFor="ticketId"
                className="text-xs font-medium text-white/55"
              >
                Ticket ID
              </label>

              <p className="mt-1 text-xs leading-5 text-white/25">
                Enter the parking ticket number issued when
                the vehicle entered.
              </p>

              <div className="relative mt-4">
                <Ticket
                  size={16}
                  strokeWidth={1.6}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="ticketId"
                  type="text"
                  value={ticketId}
                  onChange={(event) => {
                    setTicketId(event.target.value);
                    setError("");
                  }}
                  placeholder="PP-20260911-001"
                  className="w-full rounded-lg border border-white/10 bg-[#090b0d] py-3 pl-11 pr-4 font-mono text-sm uppercase text-white outline-none transition placeholder:text-white/15 focus:border-[#9bc7d5]/50"
                />
              </div>

              {error && (
                <div className="mt-4 flex gap-3 rounded-lg border border-red-400/15 bg-red-400/[0.04] p-4">
                  <TriangleAlert
                    size={17}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-red-300/70"
                  />

                  <p className="text-xs leading-5 text-red-200/65">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
              >
                <Search size={16} strokeWidth={1.8} />
                Find Ticket
              </button>
            </form>

            <div className="border-t border-white/8 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9bc7d5]/60" />

                <p className="text-xs leading-5 text-white/25">
                  Only active and unpaid tickets can proceed
                  through the normal vehicle exit process.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/8 bg-[#0d1012]">
            {!foundTicket ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center px-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
                  <LogOut
                    size={23}
                    strokeWidth={1.4}
                  />
                </div>

                <h2 className="mt-6 font-serif text-xl text-white/60">
                  Awaiting ticket lookup
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/25">
                  Search for an active ticket to view its
                  parking duration and payment amount.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                      Exit Summary
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      Parking details
                    </h2>
                  </div>

                  <span className="rounded-full border border-[#9bc7d5]/20 bg-[#9bc7d5]/5 px-3 py-1 text-[10px] font-medium tracking-[0.08em] text-[#9bc7d5]">
                    ACTIVE
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-5 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/45">
                        {(() => {
                          const icon = foundTicket
                            ? getVehicleIcon(
                                foundTicket.ticket.vehicleType
                              )
                            : CarFront;

                          return createElement(icon, {
                            size: 19,
                            strokeWidth: 1.6,
                          });
                        })()}
                      </div>

                      <div>
                        <p className="font-mono text-sm text-white/70">
                          {foundTicket.ticket.id}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {formatVehicleName(
                            foundTicket.ticket
                              .vehicleType
                          )}
                          {" · "}
                          {foundTicket.ticket
                            .plateNumber ??
                            "No plate"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Clock3
                        size={14}
                        strokeWidth={1.6}
                      />

                      {formatDuration(
                        foundTicket.exitSummary
                          .durationMinutes
                      )}
                    </div>
                  </div>

                  <div className="grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-2">
                    <div className="bg-[#0d1012] p-5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Entry
                      </p>

                      <p className="mt-2 text-sm text-white/60">
                        {formatDateTime(
                          foundTicket.ticket.entryTime
                        )}
                      </p>
                    </div>

                    <div className="bg-[#0d1012] p-5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Exit
                      </p>

                      <p className="mt-2 text-sm text-white/60">
                        {formatDateTime(
                          foundTicket.exitSummary.exitTime
                        )}
                      </p>
                    </div>

                    <div className="bg-[#0d1012] p-5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Duration
                      </p>

                      <p className="mt-2 font-serif text-xl text-white/70">
                        {formatDuration(
                          foundTicket.exitSummary
                            .durationMinutes
                        )}
                      </p>
                    </div>

                    <div className="bg-[#0d1012] p-5">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Vehicle
                      </p>

                      <p className="mt-2 font-serif text-xl text-white/70">
                        {formatVehicleName(
                          foundTicket.ticket
                            .vehicleType
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/8 bg-[#090b0d]">
                    <div className="border-b border-white/8 px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                        Parking Fee
                      </p>
                    </div>

                    <div className="space-y-4 px-5 py-5">
                      {foundTicket.ticket.vehicleType ===
                      "BICYCLE" ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/40">
                            Bicycle parking
                          </span>

                          <span className="text-sm text-white/60">
                            Free
                          </span>
                        </div>
                      ) : foundTicket.exitSummary
                          .durationMinutes <= 15 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/40">
                            15-minute grace period
                          </span>

                          <span className="text-sm text-white/60">
                            Free
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/40">
                              First hour
                            </span>

                            <span className="text-sm text-white/60">
                              ฿{rates?.firstHour}
                            </span>
                          </div>

                          {additionalHours > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/40">
                                Additional hours ×{" "}
                                {additionalHours}
                              </span>

                              <span className="text-sm text-white/60">
                                ฿
                                {additionalHours *
                                  (rates?.additionalHour ??
                                    0)}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex items-end justify-between border-t border-white/8 pt-5">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                            Total
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            Amount due
                          </p>
                        </div>

                        <p className="font-serif text-4xl tracking-tight text-[#f3f0e8]">
                          ฿
                          {
                            foundTicket.exitSummary
                              .fee
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/payment?ticket=${encodeURIComponent(
                      foundTicket.ticket.id
                    )}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
                  >
                    Proceed to Payment
                    <ArrowRight
                      size={16}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}