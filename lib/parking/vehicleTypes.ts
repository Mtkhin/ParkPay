export type VehicleType = "BICYCLE" | "MOTORCYCLE" | "CAR";

export interface ParkingRate {
  firstHour: number;
  additionalHour: number;
}

export const PARKING_RATES: Record<VehicleType, ParkingRate> = {
  BICYCLE: {
    firstHour: 0,
    additionalHour: 0,
  },
  MOTORCYCLE: {
    firstHour: 10,
    additionalHour: 5,
  },
  CAR: {
    firstHour: 20,
    additionalHour: 10,
  },
};

export const GRACE_PERIOD_MINUTES = 15;
