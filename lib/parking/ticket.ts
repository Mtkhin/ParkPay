import type { VehicleType } from "./vehicleTypes";
import { calculateDuration } from "./calculateDuration";
import { calculateFee } from "./calculateFee";

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

export interface TicketValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateTicket(
  ticket: ParkingTicket | undefined
): TicketValidationResult {
  if (!ticket) {
    return {
      isValid: false,
      message: "Ticket not found",
    };
  }

  if (!ticket.id.trim()) {
    return {
      isValid: false,
      message: "Ticket ID is required",
    };
  }

  if (ticket.status === "COMPLETED") {
    return {
      isValid: false,
      message: "Ticket is already completed",
    };
  }

  if (ticket.paymentStatus === "PAID") {
    return {
      isValid: false,
      message: "Ticket has already been paid",
    };
  }

  return {
    isValid: true,
  };
}

export interface TicketExitSummary {
  exitTime: string;
  durationMinutes: number;
  fee: number;
}

export function calculateTicketExit(
  ticket: ParkingTicket,
  exitDate: Date = new Date()
): TicketExitSummary {
  const validation = validateTicket(ticket);

  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  const exitTime = exitDate.toISOString();

  const durationMinutes = calculateDuration(
    ticket.entryTime,
    exitTime
  );

  const fee = calculateFee(
    ticket.vehicleType,
    durationMinutes
  );

  return {
    exitTime,
    durationMinutes,
    fee,
  };
}