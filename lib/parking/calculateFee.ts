import {
  GRACE_PERIOD_MINUTES,
  PARKING_RATES,
  VehicleType,
} from "./vehicleTypes";

export function calculateAdditionalHours(durationMinutes: number): number {
  const totalHours = Math.ceil(durationMinutes / 60);

  return Math.max(0, totalHours - 1);
}

export function calculateFee(
  vehicleType: VehicleType,
  durationMinutes: number
): number {
  if (durationMinutes < 0) {
    throw new Error("Parking duration cannot be negative");
  }

  if (durationMinutes <= GRACE_PERIOD_MINUTES) {
    return 0;
  }

  const rate = PARKING_RATES[vehicleType];

  const additionalHours = calculateAdditionalHours(durationMinutes);

  return rate.firstHour + additionalHours * rate.additionalHour;
}