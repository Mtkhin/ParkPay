"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  CarFront,
  CircleParking,
  Clock3,
  LogOut,
  Motorbike,
  Search,
} from "lucide-react";

import { calculateDuration } from "@/lib/parking/calculateDuration";
import { calculateFee } from "@/lib/parking/calculateFee";

import type { ParkingTicket } from "@/lib/parking/ticket";
import type { VehicleType } from "@/lib/parking/vehicleTypes";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

type VehicleFilter = "ALL" | VehicleType;

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatEntryTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function ActiveParkingPage() {
  const [tickets, setTickets] = useState<ParkingTicket[]>([]);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] =
    useState<VehicleFilter>("ALL");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const storedTickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    setTickets(
      storedTickets.filter(
        (ticket) => ticket.status === "ACTIVE"
      )
    );
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
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
  }, [tickets, search, vehicleFilter]);

  function getParkingDetails(ticket: ParkingTicket) {
    try {
      const durationMinutes = calculateDuration(
        ticket.entryTime,
        currentTime.toISOString()
      );

      const estimatedFee = calculateFee(
        ticket.vehicleType,
        durationMinutes
      );

      return {
        durationMinutes,
        estimatedFee,
      };
    } catch {
      return {
        durationMinutes: 0,
        estimatedFee: 0,
      };
    }
  }

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Parking Operations
        </p>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
              Active Parking
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Monitor vehicles currently inside the parking area.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9bc7d5]" />

            <span className="text-xs text-white/40">
              {tickets.length} active
            </span>
          </div>
        </div>
      </header>

      <main className="space-y-6 px-8 py-8 lg:px-10">
        <section className="rounded-xl border border-white/8 bg-[#0d1012] p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
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
              className="rounded-lg border border-white/8 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#9bc7d5]/40 lg:min-w-48"
            >
              <option value="ALL">All vehicles</option>
              <option value="CAR">Car</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="BICYCLE">Bicycle</option>
            </select>
          </div>
        </section>

        {filteredTickets.length === 0 ? (
          <section className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1012] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
              <CircleParking
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <h2 className="mt-6 font-serif text-xl text-white/60">
              No active parking found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/25">
              Active vehicles will appear here after a parking
              ticket is issued.
            </p>

            <Link
              href="/entry"
              className="mt-6 rounded-lg border border-white/10 bg-[#f3f0e8] px-4 py-2.5 text-sm font-medium text-[#111315] transition hover:bg-white"
            >
              Register Vehicle
            </Link>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="hidden grid-cols-[1.5fr_1fr_1.2fr_1fr_0.8fr_0.8fr_auto] gap-4 border-b border-white/8 px-6 py-3 lg:grid">
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
                Duration
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Fee
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Status
              </p>

              <span />
            </div>

            <div className="divide-y divide-white/6">
              {filteredTickets.map((ticket) => {
                const VehicleIcon = getVehicleIcon(
                  ticket.vehicleType
                );

                const {
                  durationMinutes,
                  estimatedFee,
                } = getParkingDetails(ticket);

                return (
                  <div
                    key={ticket.id}
                    className="grid gap-5 px-6 py-5 transition hover:bg-white/[0.015] lg:grid-cols-[1.5fr_1fr_1.2fr_1fr_0.8fr_0.8fr_auto] lg:items-center"
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

                      <p className="text-sm capitalize text-white/55">
                        {ticket.vehicleType.toLowerCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-white/55">
                        {formatEntryTime(ticket.entryTime)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3
                        size={14}
                        strokeWidth={1.6}
                        className="text-white/25"
                      />

                      <p className="text-sm text-white/55">
                        {formatDuration(durationMinutes)}
                      </p>
                    </div>

                    <div>
                      <p className="font-serif text-lg text-white/70">
                        ฿{estimatedFee}
                      </p>

                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/20">
                        Estimated
                      </p>
                    </div>

                    <div>
                      <span className="rounded-full border border-[#9bc7d5]/20 bg-[#9bc7d5]/5 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-[#9bc7d5]">
                        ACTIVE
                      </span>
                    </div>

                    <Link
                      href={`/exit?ticket=${encodeURIComponent(
                        ticket.id
                      )}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
                    >
                      <LogOut
                        size={14}
                        strokeWidth={1.6}
                      />
                      Exit
                    </Link>
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