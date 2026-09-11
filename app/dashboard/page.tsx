"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bike,
  CarFront,
  CircleCheck,
  CircleParking,
  Coins,
  History,
  LogIn,
  LogOut,
  Motorbike,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";

import type { ParkingTicket } from "@/lib/parking/ticket";
import type { VehicleType } from "@/lib/parking/vehicleTypes";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

const quickActions = [
  {
    label: "Vehicle Entry",
    description: "Register a vehicle and issue a parking ticket.",
    href: "/entry",
    icon: LogIn,
    number: "01",
  },
  {
    label: "Vehicle Exit",
    description: "Find a ticket, calculate the fee, and process exit.",
    href: "/exit",
    icon: LogOut,
    number: "02",
  },
  {
    label: "Active Parking",
    description: "View all vehicles currently inside the parking area.",
    href: "/active-parking",
    icon: CircleParking,
    number: "03",
  },
  {
    label: "Parking History",
    description: "Review completed parking sessions and payments.",
    href: "/history",
    icon: History,
    number: "04",
  },
];

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVehicleName(vehicleType: VehicleType) {
  return (
    vehicleType.charAt(0) +
    vehicleType.slice(1).toLowerCase()
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

export default function DashboardPage() {
  const [tickets, setTickets] = useState<ParkingTicket[]>([]);

  useEffect(() => {
    const storedTickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    setTickets(storedTickets);
  }, []);

  const dashboardData = useMemo(() => {
    const todaysTickets = tickets.filter((ticket) =>
      isToday(ticket.createdAt)
    );

    const currentlyParked = tickets.filter(
      (ticket) => ticket.status === "ACTIVE"
    );

    const completedToday = todaysTickets.filter(
      (ticket) => ticket.status === "COMPLETED"
    );

    const revenueToday = completedToday.reduce(
      (total, ticket) => total + (ticket.fee ?? 0),
      0
    );

    const carCount = todaysTickets.filter(
      (ticket) => ticket.vehicleType === "CAR"
    ).length;

    const motorcycleCount = todaysTickets.filter(
      (ticket) => ticket.vehicleType === "MOTORCYCLE"
    ).length;

    const bicycleCount = todaysTickets.filter(
      (ticket) => ticket.vehicleType === "BICYCLE"
    ).length;

    const totalToday = todaysTickets.length;

    const vehicleBreakdown = [
      {
        label: "Car",
        count: carCount,
        percentage:
          totalToday === 0
            ? 0
            : Math.round((carCount / totalToday) * 100),
      },
      {
        label: "Motorcycle",
        count: motorcycleCount,
        percentage:
          totalToday === 0
            ? 0
            : Math.round(
                (motorcycleCount / totalToday) * 100
              ),
      },
      {
        label: "Bicycle",
        count: bicycleCount,
        percentage:
          totalToday === 0
            ? 0
            : Math.round(
                (bicycleCount / totalToday) * 100
              ),
      },
    ];

    const recentActivity = [...tickets]
      .sort((a, b) => {
        const aTime = new Date(
          a.exitTime ?? a.createdAt
        ).getTime();

        const bTime = new Date(
          b.exitTime ?? b.createdAt
        ).getTime();

        return bTime - aTime;
      })
      .slice(0, 4);

    return {
      totalToday,
      currentlyParked: currentlyParked.length,
      completedToday: completedToday.length,
      revenueToday,
      vehicleBreakdown,
      recentActivity,
    };
  }, [tickets]);

  return (
    <div className="min-h-screen bg-[#090b0d]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
              Operations Overview
            </p>

            <h1 className="font-serif text-3xl tracking-tight text-[#f3f0e8] lg:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Monitor parking activity, payments, and daily
              operations from one place.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/entry"
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-[#f3f0e8] px-4 py-2.5 text-sm font-medium text-[#111315] transition hover:bg-white"
            >
              <CarFront size={16} strokeWidth={1.8} />
              Vehicle Entry

              <ArrowUpRight
                size={14}
                className="opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/exit"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
            >
              <LogOut size={16} strokeWidth={1.8} />
              Vehicle Exit
            </Link>
          </div>
        </div>
      </header>

      <main className="space-y-10 px-8 py-8 lg:px-10">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Vehicles Today"
              value={dashboardData.totalToday}
              detail="All vehicle entries recorded today"
              icon={CarFront}
            />

            <StatCard
              label="Currently Parked"
              value={dashboardData.currentlyParked}
              detail="Vehicles currently inside"
              icon={CircleParking}
            />

            <StatCard
              label="Completed"
              value={dashboardData.completedToday}
              detail="Parking sessions completed today"
              icon={CircleCheck}
            />

            <StatCard
              label="Revenue"
              value={`฿${dashboardData.revenueToday}`}
              detail="Total parking revenue today"
              icon={Coins}
            />
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Daily Operations
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#f3f0e8]">
                Quick Actions
              </h2>
            </div>

            <p className="hidden text-xs text-white/25 md:block">
              Select an operation to continue
            </p>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-white/8 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group relative min-h-52 bg-[#0d1012] p-5 transition hover:bg-[#121619] ${
                    index !== quickActions.length - 1
                      ? "border-b border-white/8 md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-sm text-white/20">
                      {action.number}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/45 transition group-hover:border-white/20 group-hover:text-white">
                      <Icon size={16} strokeWidth={1.6} />
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg text-[#f3f0e8]">
                          {action.label}
                        </h3>

                        <p className="mt-2 max-w-[230px] text-xs leading-5 text-white/35">
                          {action.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className="mb-1 shrink-0 text-white/20 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/60"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-xl border border-white/8 bg-[#0d1012]">
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Today
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#f3f0e8]">
                    Vehicle Breakdown
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 text-white/35">
                  <Bike size={17} strokeWidth={1.6} />
                </div>
              </div>

              <div className="divide-y divide-white/6">
                {dashboardData.vehicleBreakdown.map(
                  (vehicle) => (
                    <div
                      key={vehicle.label}
                      className="grid gap-4 px-6 py-5 md:grid-cols-[130px_1fr_60px]"
                    >
                      <div>
                        <p className="text-sm text-white/65">
                          {vehicle.label}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {vehicle.count} vehicles
                        </p>
                      </div>

                      <div className="flex items-center">
                        <div className="h-[3px] w-full overflow-hidden bg-white/6">
                          <div
                            className="h-full bg-[#9bc7d5]"
                            style={{
                              width: `${vehicle.percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-lg text-white/65">
                          {vehicle.percentage}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-white/8 bg-[#0d1012] p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Daily Volume
                </p>

                <p className="mt-5 font-serif text-5xl tracking-tight text-[#f3f0e8]">
                  {dashboardData.totalToday}
                </p>

                <p className="mt-2 text-sm text-white/35">
                  total vehicle entries
                </p>
              </div>

              <div className="mt-10 border-t border-white/8 pt-5">
                <p className="text-xs leading-5 text-white/30">
                  Vehicle distribution is calculated from
                  today&apos;s recorded parking sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="flex items-end justify-between border-b border-white/8 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Live Log
                </p>

                <h2 className="mt-2 font-serif text-2xl text-[#f3f0e8]">
                  Recent Parking Activity
                </h2>
              </div>

              <Link
                href="/history"
                className="group hidden items-center gap-2 text-xs text-white/35 transition hover:text-white/70 sm:flex"
              >
                View all history

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.6}
                  className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {dashboardData.recentActivity.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="font-serif text-lg text-white/45">
                  No parking activity yet
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Register a vehicle to begin recording
                  activity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/6">
                {dashboardData.recentActivity.map(
                  (activity) => {
                    const Icon = getVehicleIcon(
                      activity.vehicleType
                    );

                    const isCompleted =
                      activity.status === "COMPLETED";

                    return (
                      <div
                        key={activity.id}
                        className="grid gap-4 px-6 py-4 transition hover:bg-white/[0.015] md:grid-cols-[44px_1.4fr_1fr_1fr_auto]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/35">
                          <Icon
                            size={16}
                            strokeWidth={1.6}
                          />
                        </div>

                        <div>
                          <p className="font-mono text-xs text-white/60">
                            {activity.id}
                          </p>

                          <p className="mt-1 text-xs text-white/25">
                            {formatVehicleName(
                              activity.vehicleType
                            )}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <div>
                            <p className="text-sm text-white/55">
                              {activity.plateNumber ??
                                "No plate"}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              Plate
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div>
                            <p className="text-sm text-white/55">
                              {isCompleted
                                ? "Payment completed"
                                : "Vehicle entered"}
                            </p>

                            <p className="mt-1 text-xs text-white/25">
                              {formatTime(
                                activity.exitTime ??
                                  activity.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center md:justify-end">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] ${
                              isCompleted
                                ? "border-white/10 bg-white/[0.025] text-white/40"
                                : "border-[#9bc7d5]/20 bg-[#9bc7d5]/5 text-[#9bc7d5]"
                            }`}
                          >
                            {isCompleted
                              ? "COMPLETED"
                              : "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}