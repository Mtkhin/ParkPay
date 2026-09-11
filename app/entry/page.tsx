"use client";

import { FormEvent, useState } from "react";
import {
  Bike,
  CarFront,
  Check,
  Motorbike,
  Printer,
  RotateCcw,
  Ticket,
} from "lucide-react";

import {
  createParkingTicket,
  type ParkingTicket,
} from "@/lib/parking/ticket";

import type { VehicleType } from "@/lib/parking/vehicleTypes";

import {
  getFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

const vehicleOptions: {
  type: VehicleType;
  label: string;
  description: string;
  icon: typeof CarFront;
}[] = [
  {
    type: "BICYCLE",
    label: "Bicycle",
    description: "Free parking",
    icon: Bike,
  },
  {
    type: "MOTORCYCLE",
    label: "Motorcycle",
    description: "From ฿10",
    icon: Motorbike,
  },
  {
    type: "CAR",
    label: "Car",
    description: "From ฿20",
    icon: CarFront,
  },
];

export default function VehicleEntryPage() {
  const [vehicleType, setVehicleType] =
    useState<VehicleType>("CAR");

  const [plateNumber, setPlateNumber] = useState("");

  const [createdTicket, setCreatedTicket] =
    useState<ParkingTicket | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const existingTickets = getFromStorage<ParkingTicket[]>(
      STORAGE_KEYS.TICKETS,
      []
    );

    const existingTicketIds = existingTickets.map(
      (ticket) => ticket.id
    );

    const newTicket = createParkingTicket(
      vehicleType,
      existingTicketIds,
      plateNumber
    );

    saveToStorage(STORAGE_KEYS.TICKETS, [
      ...existingTickets,
      newTicket,
    ]);

    setCreatedTicket(newTicket);
  }

  function handleNewEntry() {
    setCreatedTicket(null);
    setVehicleType("CAR");
    setPlateNumber("");
  }

  function formatEntryTime(value: string) {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Parking Operations
        </p>

        <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
          Vehicle Entry
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Register an arriving vehicle and issue a new parking
          ticket.
        </p>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <section className="rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="border-b border-white/8 px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                New Parking Session
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Register vehicle
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8 p-6"
            >
              <div>
                <label className="text-xs font-medium text-white/55">
                  Vehicle type
                </label>

                <p className="mt-1 text-xs text-white/25">
                  Select the type of vehicle entering the parking
                  area.
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {vehicleOptions.map((option) => {
                    const Icon = option.icon;
                    const selected =
                      vehicleType === option.type;

                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() =>
                          setVehicleType(option.type)
                        }
                        className={`relative rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-[#9bc7d5]/45 bg-[#9bc7d5]/8"
                            : "border-white/8 bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                              selected
                                ? "border-[#9bc7d5]/30 text-[#9bc7d5]"
                                : "border-white/8 text-white/35"
                            }`}
                          >
                            <Icon
                              size={17}
                              strokeWidth={1.6}
                            />
                          </div>

                          {selected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9bc7d5] text-[#0b0d0f]">
                              <Check
                                size={12}
                                strokeWidth={2}
                              />
                            </div>
                          )}
                        </div>

                        <p className="mt-6 font-serif text-lg">
                          {option.label}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="plateNumber"
                  className="text-xs font-medium text-white/55"
                >
                  Plate number
                </label>

                <p className="mt-1 text-xs text-white/25">
                  Optional. Leave blank if the vehicle has no plate.
                </p>

                <input
                  id="plateNumber"
                  type="text"
                  value={plateNumber}
                  onChange={(event) =>
                    setPlateNumber(event.target.value)
                  }
                  placeholder="e.g. 1AB-1234"
                  className="mt-4 w-full rounded-lg border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#9bc7d5]/50"
                />
              </div>

              <div className="border-t border-white/8 pt-6">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
                >
                  <Ticket size={16} strokeWidth={1.8} />
                  Generate Parking Ticket
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-xl border border-white/8 bg-[#0d1012]">
            {!createdTicket ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center px-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
                  <Ticket size={23} strokeWidth={1.4} />
                </div>

                <h2 className="mt-6 font-serif text-xl text-white/60">
                  Ticket preview
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-white/25">
                  The generated parking ticket will appear here after
                  the vehicle is registered.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 border-b border-white/8 px-6 py-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9bc7d5]/25 bg-[#9bc7d5]/5 text-[#9bc7d5]">
                    <Check size={15} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/70">
                      Vehicle registered
                    </p>

                    <p className="mt-0.5 text-xs text-white/25">
                      Parking ticket generated successfully
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#f0ede5] text-[#111315]">
                    <div className="border-b border-black/10 px-6 py-5">
                      <p className="font-serif text-2xl tracking-tight">
                        ParkPay
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/40">
                        Parking Ticket
                      </p>
                    </div>

                    <div className="space-y-5 px-6 py-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                          Ticket ID
                        </p>

                        <p className="mt-1 font-mono text-lg font-medium">
                          {createdTicket.id}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                            Vehicle
                          </p>

                          <p className="mt-1 text-sm">
                            {createdTicket.vehicleType}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                            Plate
                          </p>

                          <p className="mt-1 text-sm">
                            {createdTicket.plateNumber ??
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                          Entry time
                        </p>

                        <p className="mt-1 text-sm">
                          {formatEntryTime(
                            createdTicket.entryTime
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-black/20 pt-5">
                        <span className="text-xs uppercase tracking-[0.15em] text-black/40">
                          Status
                        </span>

                        <span className="rounded-full border border-black/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em]">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <Printer size={15} strokeWidth={1.7} />
                      Print Ticket
                    </button>

                    <button
                      type="button"
                      onClick={handleNewEntry}
                      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/55 transition hover:bg-white/[0.04] hover:text-white"
                    >
                      <RotateCcw
                        size={15}
                        strokeWidth={1.7}
                      />
                      New Entry
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}