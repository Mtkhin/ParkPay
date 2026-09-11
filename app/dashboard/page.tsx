import Link from "next/link";
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

const vehicleBreakdown = [
  {
    label: "Car",
    count: 72,
    percentage: 56,
  },
  {
    label: "Motorcycle",
    count: 41,
    percentage: 32,
  },
  {
    label: "Bicycle",
    count: 15,
    percentage: 12,
  },
];

const recentActivity = [
  {
    ticket: "PP-20260911-128",
    vehicle: "Car",
    plate: "1AB-4821",
    action: "Entered",
    time: "3:42 PM",
    status: "ACTIVE",
    icon: CarFront,
  },
  {
    ticket: "PP-20260911-127",
    vehicle: "Motorcycle",
    plate: "8กข-214",
    action: "Payment completed",
    time: "3:36 PM",
    status: "PAID",
    icon: Motorbike,
  },
  {
    ticket: "PP-20260911-126",
    vehicle: "Car",
    plate: "4กท-8820",
    action: "Vehicle exited",
    time: "3:28 PM",
    status: "COMPLETED",
    icon: CarFront,
  },
  {
    ticket: "PP-20260911-125",
    vehicle: "Bicycle",
    plate: "No plate",
    action: "Entered",
    time: "3:17 PM",
    status: "ACTIVE",
    icon: Bike,
  },
];

export default function DashboardPage() {
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
              Monitor parking activity, payments, and daily operations
              from one place.
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
              value={128}
              detail="All vehicle entries recorded today"
              icon={CarFront}
            />

            <StatCard
              label="Currently Parked"
              value={34}
              detail="Vehicles currently inside"
              icon={CircleParking}
            />

            <StatCard
              label="Completed"
              value={94}
              detail="Parking sessions completed today"
              icon={CircleCheck}
            />

            <StatCard
              label="Revenue"
              value="฿2,450"
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
                {vehicleBreakdown.map((vehicle) => (
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
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-white/8 bg-[#0d1012] p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Daily Volume
                </p>

                <p className="mt-5 font-serif text-5xl tracking-tight text-[#f3f0e8]">
                  128
                </p>

                <p className="mt-2 text-sm text-white/35">
                  total vehicle entries
                </p>
              </div>

              <div className="mt-10 border-t border-white/8 pt-5">
                <p className="text-xs leading-5 text-white/30">
                  Cars represent the largest share of today&apos;s parking
                  activity.
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

            <div className="divide-y divide-white/6">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.ticket}
                    className="grid gap-4 px-6 py-4 transition hover:bg-white/[0.015] md:grid-cols-[44px_1.4fr_1fr_1fr_auto]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/35">
                      <Icon size={16} strokeWidth={1.6} />
                    </div>

                    <div>
                      <p className="font-mono text-xs text-white/60">
                        {activity.ticket}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        {activity.vehicle}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div>
                        <p className="text-sm text-white/55">
                          {activity.plate}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          Plate
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div>
                        <p className="text-sm text-white/55">
                          {activity.action}
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          {activity.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] ${
                          activity.status === "ACTIVE"
                            ? "border-[#9bc7d5]/20 bg-[#9bc7d5]/5 text-[#9bc7d5]"
                            : activity.status === "PAID"
                              ? "border-white/12 bg-white/[0.03] text-white/50"
                              : "border-white/8 text-white/30"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}