import type {
  ParkingTicket,
  PaymentMethod,
} from "../parking/ticket";

import {
  calculateTicketExit,
  validateTicket,
} from "../parking/ticket";

export function processPayment(
  ticket: ParkingTicket | undefined,
  paymentMethod: PaymentMethod | undefined,
  exitDate: Date = new Date()
): ParkingTicket {
  const validation = validateTicket(ticket);

  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (!paymentMethod) {
    throw new Error("Payment method is required");
  }

  const exitSummary = calculateTicketExit(ticket, exitDate);

  return {
    ...ticket,
    exitTime: exitSummary.exitTime,
    durationMinutes: exitSummary.durationMinutes,
    fee: exitSummary.fee,
    paymentMethod,
    paymentStatus: "PAID",
    status: "COMPLETED",
  };
}