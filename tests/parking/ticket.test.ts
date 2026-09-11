import { describe, expect, it } from "vitest";

import {
  calculateTicketExit,
  createParkingTicket,
  generateTicketId,
  validateTicket,
} from "../../lib/parking/ticket";

describe("generateTicketId", () => {
  it("generates the first ticket ID for the day", () => {
    const date = new Date("2026-09-11T10:00:00");

    const ticketId = generateTicketId([], date);

    expect(ticketId).toBe("PP-20260911-001");
  });

  it("generates the next sequential ticket ID", () => {
    const date = new Date("2026-09-11T10:00:00");

    const existingIds = [
      "PP-20260911-001",
      "PP-20260911-002",
    ];

    const ticketId = generateTicketId(existingIds, date);

    expect(ticketId).toBe("PP-20260911-003");
  });

  it("starts again from 001 on a new day", () => {
    const date = new Date("2026-09-12T10:00:00");

    const existingIds = [
      "PP-20260911-001",
      "PP-20260911-002",
    ];

    const ticketId = generateTicketId(existingIds, date);

    expect(ticketId).toBe("PP-20260912-001");
  });

  it("does not return an empty ticket ID", () => {
    const ticketId = generateTicketId(
      [],
      new Date("2026-09-11T10:00:00")
    );

    expect(ticketId).not.toBe("");
  });
});

describe("createParkingTicket", () => {
  it("creates a new ACTIVE parking ticket", () => {
    const entryDate = new Date("2026-09-11T10:00:00");

    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      entryDate
    );

    expect(ticket.status).toBe("ACTIVE");
  });

  it("stores the correct vehicle type", () => {
    const ticket = createParkingTicket(
      "MOTORCYCLE",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    expect(ticket.vehicleType).toBe("MOTORCYCLE");
  });

  it("stores the entry time", () => {
    const entryDate = new Date("2026-09-11T10:00:00");

    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      entryDate
    );

    expect(ticket.entryTime).toBe(entryDate.toISOString());
  });

  it("creates the ticket with PENDING payment status", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    expect(ticket.paymentStatus).toBe("PENDING");
  });

  it("stores the plate number when provided", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date("2026-09-11T10:00:00")
    );

    expect(ticket.plateNumber).toBe("1AB-1234");
  });

  it("allows a ticket without a plate number", () => {
    const ticket = createParkingTicket(
      "BICYCLE",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    expect(ticket.plateNumber).toBeUndefined();
  });
});

describe("validateTicket", () => {
  it("accepts a valid active unpaid ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date("2026-09-11T10:00:00")
    );

    const result = validateTicket(ticket);

    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("rejects an invalid ticket", () => {
    const result = validateTicket(undefined);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Ticket not found");
  });

  it("rejects a ticket with a missing ticket ID", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    ticket.id = "";

    const result = validateTicket(ticket);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Ticket ID is required");
  });

  it("rejects an already completed ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    ticket.status = "COMPLETED";

    const result = validateTicket(ticket);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Ticket is already completed");
  });

  it("rejects an already paid ticket", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    ticket.paymentStatus = "PAID";

    const result = validateTicket(ticket);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Ticket has already been paid");
  });
});
describe("calculateTicketExit", () => {
  it("calculates 140 minutes and 40 THB for a car", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date("2026-09-11T10:00:00")
    );

    const result = calculateTicketExit(
      ticket,
      new Date("2026-09-11T12:20:00")
    );

    expect(result.durationMinutes).toBe(140);
    expect(result.fee).toBe(40);
  });

  it("keeps the ticket ACTIVE before payment", () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    calculateTicketExit(
      ticket,
      new Date("2026-09-11T11:00:00")
    );

    expect(ticket.status).toBe("ACTIVE");
    expect(ticket.paymentStatus).toBe("PENDING");
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
      calculateTicketExit(
        ticket,
        new Date("2026-09-11T11:00:00")
      )
    ).toThrow("Ticket is already completed");
  });
});