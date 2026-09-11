import { describe, expect, it } from "vitest";
import { generateTicketId } from "../../lib/parking/ticket";

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
    const ticketId = generateTicketId([], new Date("2026-09-11"));

    expect(ticketId).not.toBe("");
  });
});

import { createParkingTicket } from "../../lib/parking/ticket";

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