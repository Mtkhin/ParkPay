import { VehicleType } from "./vehicleTypes";

export type TicketStatus = "ACTIVE" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID";
export type PaymentMethod = "CASH" | "CARD" | "QR";

export interface ParkingTicket {
  id: string;
  vehicleType: VehicleType;
  plateNumber?: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes?: number;
  fee?: number;
  status: TicketStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export function generateTicketId(
  existingTicketIds: string[],
  date: Date = new Date()
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const datePart = `${year}${month}${day}`;
  const prefix = `PP-${datePart}-`;

  const todaysTicketNumbers = existingTicketIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)))
    .filter((number) => !Number.isNaN(number));

  const nextNumber =
    todaysTicketNumbers.length === 0
      ? 1
      : Math.max(...todaysTicketNumbers) + 1;

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

export function createParkingTicket(
  vehicleType: VehicleType,
  existingTicketIds: string[],
  plateNumber?: string,
  entryDate: Date = new Date()
): ParkingTicket {
  const entryTime = entryDate.toISOString();

  return {
    id: generateTicketId(existingTicketIds, entryDate),
    vehicleType,
    plateNumber: plateNumber?.trim() || undefined,
    entryTime,
    status: "ACTIVE",
    paymentStatus: "PENDING",
    createdAt: entryTime,
  };
}