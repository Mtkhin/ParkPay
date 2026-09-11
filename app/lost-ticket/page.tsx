"use client";

import { FormEvent, useState } from "react";
import {
  Bike,
  CarFront,
  Check,
  Clock3,
  Motorbike,
  RotateCcw,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { calculateDuration } from "@/lib/parking/calculateDuration";
import { calculateFee } from "@/lib/parking/calculateFee";
import {
  PARKING_RATES,
  type VehicleType,
} from "@/lib/parking/vehicleTypes";

interface LostTicketResult {
  vehicleType: VehicleType;
  plateNumber: string;
  entryTime: string;
  exitTime: string;
  durationMinutes: number;
  fee: number;
}

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
    description: "฿10 first hour",
    icon: Motorbike,
  },
  {
    type: "CAR",
    label: "Car",
    description: "฿20 first hour",
    icon: CarFront,
  },
];

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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

export default function LostTicketPage() {
  const [vehicleType, setVehicleType] =
    useState<VehicleType>("CAR");

  const [plateNumber, setPlateNumber] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [error, setError] = useState("");

  const [result, setResult] =
    useState<LostTicketResult | null>(null);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!plateNumber.trim()) {
      setError(
        "Plate number is required for manual lost ticket verification."
      );
      return;
    }

    if (!entryTime) {
      setError(
        "Please provide the approximate vehicle entry time."
      );
      return;
    }

    const entryDate = new Date(entryTime);
    const exitDate = new Date();

    if (Number.isNaN(entryDate.getTime())) {
      setError("The entry time is invalid.");
      return;
    }

    if (entryDate > exitDate) {
      setError(
        "Entry time cannot be later than the current time."
      );
      return;
    }

    try {
      const durationMinutes = calculateDuration(
        entryDate.toISOString(),
        exitDate.toISOString()
      );

      const fee = calculateFee(
        vehicleType,
        durationMinutes
      );

      setResult({
        vehicleType,
        plateNumber: plateNumber.trim(),
        entryTime: entryDate.toISOString(),
        exitTime: exitDate.toISOString(),
        durationMinutes,
        fee,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to calculate the lost ticket fee."
      );
    }
  }

  function handleReset() {
    setVehicleType("CAR");
    setPlateNumber("");
    setEntryTime("");
    setError("");
    setResult(null);
  }

  const rate = result
    ? PARKING_RATES[result.vehicleType]
    : null;

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Exception Handling
        </p>

        <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
          Lost Ticket
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Manually estimate parking charges when the original
          parking ticket cannot be presented.
        </p>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mb-6 flex gap-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.035] p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-300/15 text-amber-200/65">
            <ShieldAlert
              size={19}
              strokeWidth={1.6}
            />
          </div>

          <div>
            <p className="font-serif text-lg text-amber-100/80">
              Manual Lost Ticket Processing
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-amber-100/40">
              Staff must manually verify the vehicle and plate
              information before processing a lost ticket. The
              calculated fee is based on the approximate entry
              time provided.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
          <section className="rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="border-b border-white/8 px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Manual Verification
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Vehicle details
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
                            : "border-white/8 bg-white/[0.015] hover:border-white/15"
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

                        <p className="mt-5 font-serif text-lg">
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
                  Required for manual vehicle verification.
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

              <div>
                <label
                  htmlFor="entryTime"
                  className="text-xs font-medium text-white/55"
                >
                  Approximate entry time
                </label>

                <p className="mt-1 text-xs text-white/25">
                  Enter the best available estimate of when
                  the vehicle arrived.
                </p>

                <div className="relative mt-4">
                  <Clock3
                    size={16}
                    strokeWidth={1.6}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    id="entryTime"
                    type="datetime-local"
                    value={entryTime}
                    onChange={(event) =>
                      setEntryTime(event.target.value)
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#090b0d] py-3 pl-11 pr-4 text-sm text-white/65 outline-none transition focus:border-[#9bc7d5]/50"
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-3 rounded-lg border border-red-400/15 bg-red-400/[0.04] p-4">
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
              >
                Calculate Lost Ticket Fee
              </button>
            </form>
          </section>

          <section className="h-fit rounded-xl border border-white/8 bg-[#0d1012]">
            {!result ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center px-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
                  <ShieldAlert
                    size={23}
                    strokeWidth={1.4}
                  />
                </div>

                <h2 className="mt-6 font-serif text-xl text-white/60">
                  Awaiting verification
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-white/25">
                  Enter the lost ticket information to calculate
                  an estimated parking charge.
                </p>
              </div>
            ) : (
              <div>
                <div className="border-b border-white/8 px-6 py-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Manual Calculation
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Lost ticket summary
                  </h2>
                </div>

                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Vehicle
                      </p>

                      <p className="mt-1 text-sm text-white/60">
                        {formatVehicleName(
                          result.vehicleType
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Plate
                      </p>

                      <p className="mt-1 text-sm text-white/60">
                        {result.plateNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Approx. Entry
                      </p>

                      <p className="mt-1 text-sm text-white/60">
                        {formatDateTime(
                          result.entryTime
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Current Time
                      </p>

                      <p className="mt-1 text-sm text-white/60">
                        {formatDateTime(
                          result.exitTime
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/8 bg-[#090b0d] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Estimated duration
                      </span>

                      <span className="font-serif text-lg text-white/65">
                        {formatDuration(
                          result.durationMinutes
                        )}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                      <span className="text-sm text-white/35">
                        First hour rate
                      </span>

                      <span className="text-sm text-white/55">
                        {rate?.firstHour === 0
                          ? "Free"
                          : `฿${rate?.firstHour}`}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-white/35">
                        Additional hour rate
                      </span>

                      <span className="text-sm text-white/55">
                        {rate?.additionalHour === 0
                          ? "Free"
                          : `฿${rate?.additionalHour}`}
                      </span>
                    </div>

                    <div className="mt-5 flex items-end justify-between border-t border-white/8 pt-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                          Estimated Fee
                        </p>

                        <p className="mt-1 text-xs text-white/25">
                          Based on manual entry time
                        </p>
                      </div>

                      <p className="font-serif text-4xl tracking-tight">
                        ฿{result.fee}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-300/10 bg-amber-300/[0.025] p-4">
                    <p className="text-xs leading-5 text-amber-100/40">
                      This is a manual lost ticket calculation.
                      Staff verification is required before any
                      payment or vehicle release.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <RotateCcw
                      size={15}
                      strokeWidth={1.7}
                    />
                    Process Another Lost Ticket
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}