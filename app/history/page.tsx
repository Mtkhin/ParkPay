"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  CarFront,
  Clock3,
  History,
  Motorbike,
  Search,
} from "lucide-react";

import type {
  ParkingTicket,
  PaymentMethod,
} from "@/lib/parking/ticket";

import type { VehicleType } from "@/lib/parking/vehicleTypes";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

type VehicleFilter = "ALL" | VehicleType;
type SortOrder = "NEWEST" | "OLDEST";

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(minutes?: number) {
  if (minutes === undefined) {
    return "-";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatVehicleName(vehicleType: VehicleType) {
  return (
    vehicleType.charAt(0) +
    vehicleType.slice(1).toLowerCase()
  );
}

function formatPaymentMethod(
  paymentMethod?: PaymentMethod
) {
  if (!paymentMethod) {
    return "-";
  }

  if (paymentMethod === "QR") {
    return "QR Payment";
  }

  return (
    paymentMethod.charAt(0) +
    paymentMethod.slice(1).toLowerCase()
  );
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

export default function ParkingHistoryPage() {
  const [tickets, setTickets] = useState<ParkingTicket[]>([]);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] =
    useState<VehicleFilter>("ALL");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("NEWEST");

  useEffect(() => {
    const storedTickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    const completedTickets = storedTickets.filter(
      (ticket) => ticket.status === "COMPLETED"
    );

    setTickets(completedTickets);
  }, []);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        (ticket.plateNumber ?? "")
          .toLowerCase()
          .includes(query);

      const matchesVehicle =
        vehicleFilter === "ALL" ||
        ticket.vehicleType === vehicleFilter;

      return matchesSearch && matchesVehicle;
    });

    return [...result].sort((a, b) => {
      const aTime = new Date(
        a.exitTime ?? a.createdAt
      ).getTime();

      const bTime = new Date(
        b.exitTime ?? b.createdAt
      ).getTime();

      return sortOrder === "NEWEST"
        ? bTime - aTime
        : aTime - bTime;
    });
  }, [tickets, search, vehicleFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Parking Records
        </p>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
              Parking History
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Review completed parking sessions and payment
              records.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5">
            <History
              size={13}
              strokeWidth={1.6}
              className="text-white/30"
            />

            <span className="text-xs text-white/40">
              {tickets.length} completed
            </span>
          </div>
        </div>
      </header>

      <main className="space-y-6 px-8 py-8 lg:px-10">
        <section className="rounded-xl border border-white/8 bg-[#0d1012] p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={1.6}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by ticket ID or plate number"
                className="w-full rounded-lg border border-white/8 bg-[#090b0d] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#9bc7d5]/40"
              />
            </div>

            <select
              value={vehicleFilter}
              onChange={(event) =>
                setVehicleFilter(
                  event.target.value as VehicleFilter
                )
              }
              className="rounded-lg border border-white/8 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#9bc7d5]/40 xl:min-w-48"
            >
              <option value="ALL">All vehicles</option>
              <option value="CAR">Car</option>
              <option value="MOTORCYCLE">
                Motorcycle
              </option>
              <option value="BICYCLE">Bicycle</option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value as SortOrder
                )
              }
              className="rounded-lg border border-white/8 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#9bc7d5]/40 xl:min-w-44"
            >
              <option value="NEWEST">
                Newest first
              </option>
              <option value="OLDEST">
                Oldest first
              </option>
            </select>
          </div>
        </section>

        {filteredTickets.length === 0 ? (
          <section className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1012] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
              <History
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <h2 className="mt-6 font-serif text-xl text-white/60">
              No parking history found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/25">
              Completed parking sessions will appear here
              after payment is processed.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="hidden grid-cols-[1.4fr_1fr_1.2fr_1.2fr_0.9fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-white/8 px-6 py-3 xl:grid">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Ticket
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Vehicle
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Entry
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Exit
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Duration
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Fee
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Payment
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Status
              </p>
            </div>

            <div className="divide-y divide-white/6">
              {filteredTickets.map((ticket) => {
                const VehicleIcon = getVehicleIcon(
                  ticket.vehicleType
                );

                return (
                  <div
                    key={ticket.id}
                    className="grid gap-5 px-6 py-5 transition hover:bg-white/[0.015] xl:grid-cols-[1.4fr_1fr_1.2fr_1.2fr_0.9fr_0.8fr_0.9fr_0.8fr] xl:items-center"
                  >
                    <div>
                      <p className="font-mono text-xs text-white/70">
                        {ticket.id}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        {ticket.plateNumber ?? "No plate"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 text-white/35">
                        <VehicleIcon
                          size={15}
                          strokeWidth={1.6}
                        />
                      </div>

                      <span className="text-sm text-white/55">
                        {formatVehicleName(
                          ticket.vehicleType
                        )}
                      </span>
                    </div>

                    <div className="text-sm text-white/45">
                      {formatDateTime(ticket.entryTime)}
                    </div>

                    <div className="text-sm text-white/45">
                      {formatDateTime(ticket.exitTime)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/45">
                      <Clock3
                        size={14}
                        strokeWidth={1.6}
                        className="text-white/20"
                      />

                      {formatDuration(
                        ticket.durationMinutes
                      )}
                    </div>

                    <div>
                      <p className="font-serif text-lg text-white/70">
                        ฿{ticket.fee ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-white/45">
                        {formatPaymentMethod(
                          ticket.paymentMethod
                        )}
                      </p>
                    </div>

                    <div>
                      <span className="rounded-full border border-white/10 bg-white/[0.025] px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-white/40">
                        COMPLETED
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}