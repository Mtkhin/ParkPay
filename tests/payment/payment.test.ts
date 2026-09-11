import { describe, expect, it } from "vitest";

import { createParkingTicket } from "../../lib/parking/ticket";
import { processPayment } from "../../lib/payment/payment";

describe("processPayment", () => {
  it("successfully processes payment and completes the ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date("2026-09-11T10:00:00")
    );

    const result = processPayment(
      ticket,
      "CASH",
      new Date("2026-09-11T12:20:00")
    );

    expect(result.paymentStatus).toBe("PAID");
    expect(result.status).toBe("COMPLETED");
    expect(result.paymentMethod).toBe("CASH");
    expect(result.durationMinutes).toBe(140);
    expect(result.fee).toBe(40);
    expect(result.exitTime).toBeDefined();
  });

  it("rejects an invalid ticket", () => {
    expect(() =>
      processPayment(
        undefined,
        "CASH",
        new Date("2026-09-11T12:00:00")
      )
    ).toThrow("Ticket not found");
  });

  it("rejects an already completed ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    ticket.status = "COMPLETED";

    expect(() =>
      processPayment(
        ticket,
        "CASH",
        new Date("2026-09-11T12:00:00")
      )
    ).toThrow("Ticket is already completed");
  });

  it("rejects an already paid ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    ticket.paymentStatus = "PAID";

    expect(() =>
      processPayment(
        ticket,
        "CARD",
        new Date("2026-09-11T12:00:00")
      )
    ).toThrow("Ticket has already been paid");
  });

  it("rejects a missing payment method", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    expect(() =>
      processPayment(
        ticket,
        undefined,
        new Date("2026-09-11T12:00:00")
      )
    ).toThrow("Payment method is required");
  });

  it("does not modify the original ticket directly", () => {
    const ticket = createParkingTicket(
      "MOTORCYCLE",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    processPayment(
      ticket,
      "QR",
      new Date("2026-09-11T11:00:00")
    );

    expect(ticket.status).toBe("ACTIVE");
    expect(ticket.paymentStatus).toBe("PENDING");
  });
});