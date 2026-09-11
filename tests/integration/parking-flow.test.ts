import { describe, expect, it } from "vitest";

import {
  calculateTicketExit,
  createParkingTicket,
} from "../../lib/parking/ticket";

import { processPayment } from "../../lib/payment/payment";

describe("ParkPay parking flow integration", () => {
  it("completes the full parking workflow successfully", () => {
    const entryTime = new Date("2026-09-11T10:00:00");
    const exitTime = new Date("2026-09-11T12:20:00");

    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      entryTime
    );

    expect(ticket.id).toBe("PP-20260911-001");
    expect(ticket.status).toBe("ACTIVE");
    expect(ticket.paymentStatus).toBe("PENDING");

    const exitSummary = calculateTicketExit(
      ticket,
      exitTime
    );

    expect(exitSummary.durationMinutes).toBe(140);
    expect(exitSummary.fee).toBe(40);

    const completedTicket = processPayment(
      ticket,
      "CASH",
      exitTime
    );

    expect(completedTicket.status).toBe("COMPLETED");
    expect(completedTicket.paymentStatus).toBe("PAID");
    expect(completedTicket.paymentMethod).toBe("CASH");
    expect(completedTicket.durationMinutes).toBe(140);
    expect(completedTicket.fee).toBe(40);
    expect(completedTicket.exitTime).toBe(
      exitTime.toISOString()
    );
  });
});