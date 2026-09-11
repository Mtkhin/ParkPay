import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ParkingHistoryPage from "../../app/history/page";

import { createParkingTicket } from "../../lib/parking/ticket";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Parking History page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows completed tickets and hides active tickets", async () => {
    const activeTicket = createParkingTicket(
      "CAR",
      [],
      "ACTIVE-111",
      new Date("2026-09-11T10:00:00")
    );

    const completedTicket = createParkingTicket(
      "MOTORCYCLE",
      [activeTicket.id],
      "DONE-222",
      new Date("2026-09-11T09:00:00")
    );

    completedTicket.status = "COMPLETED";
    completedTicket.paymentStatus = "PAID";
    completedTicket.paymentMethod = "CASH";
    completedTicket.exitTime =
      new Date("2026-09-11T10:30:00").toISOString();
    completedTicket.durationMinutes = 90;
    completedTicket.fee = 15;

    saveToStorage(STORAGE_KEYS.TICKETS, [
      activeTicket,
      completedTicket,
    ]);

    render(<ParkingHistoryPage />);

    expect(
      await screen.findByText(completedTicket.id)
    ).toBeInTheDocument();

    expect(
      screen.getByText("DONE-222")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(activeTicket.id)
    ).not.toBeInTheDocument();
  });

  it("searches parking history by plate number", async () => {
    const user = userEvent.setup();

    const firstTicket = createParkingTicket(
      "CAR",
      [],
      "CAR-1111",
      new Date("2026-09-11T08:00:00")
    );

    firstTicket.status = "COMPLETED";
    firstTicket.paymentStatus = "PAID";
    firstTicket.paymentMethod = "CARD";
    firstTicket.exitTime =
      new Date("2026-09-11T09:00:00").toISOString();
    firstTicket.durationMinutes = 60;
    firstTicket.fee = 20;

    const secondTicket = createParkingTicket(
      "MOTORCYCLE",
      [firstTicket.id],
      "MOTO-2222",
      new Date("2026-09-11T09:30:00")
    );

    secondTicket.status = "COMPLETED";
    secondTicket.paymentStatus = "PAID";
    secondTicket.paymentMethod = "QR";
    secondTicket.exitTime =
      new Date("2026-09-11T10:30:00").toISOString();
    secondTicket.durationMinutes = 60;
    secondTicket.fee = 10;

    saveToStorage(STORAGE_KEYS.TICKETS, [
      firstTicket,
      secondTicket,
    ]);

    render(<ParkingHistoryPage />);

    await screen.findByText(firstTicket.id);

    const searchInput = screen.getByPlaceholderText(
      "Search by ticket ID or plate number"
    );

    await user.type(searchInput, "MOTO-2222");

    expect(
      screen.getByText("MOTO-2222")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("CAR-1111")
    ).not.toBeInTheDocument();
  });

  it("filters parking history by vehicle type", async () => {
    const user = userEvent.setup();

    const carTicket = createParkingTicket(
      "CAR",
      [],
      "CAR-3333",
      new Date("2026-09-11T08:00:00")
    );

    carTicket.status = "COMPLETED";
    carTicket.paymentStatus = "PAID";
    carTicket.paymentMethod = "CASH";
    carTicket.exitTime =
      new Date("2026-09-11T09:00:00").toISOString();
    carTicket.durationMinutes = 60;
    carTicket.fee = 20;

    const bicycleTicket = createParkingTicket(
      "BICYCLE",
      [carTicket.id],
      undefined,
      new Date("2026-09-11T10:00:00")
    );

    bicycleTicket.status = "COMPLETED";
    bicycleTicket.paymentStatus = "PAID";
    bicycleTicket.paymentMethod = "CASH";
    bicycleTicket.exitTime =
      new Date("2026-09-11T10:30:00").toISOString();
    bicycleTicket.durationMinutes = 30;
    bicycleTicket.fee = 0;

    saveToStorage(STORAGE_KEYS.TICKETS, [
      carTicket,
      bicycleTicket,
    ]);

    render(<ParkingHistoryPage />);

    await screen.findByText(carTicket.id);

    const vehicleFilter =
      screen.getAllByRole("combobox")[0];

    await user.selectOptions(
      vehicleFilter,
      "BICYCLE"
    );

    expect(
      screen.getByText(bicycleTicket.id)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(carTicket.id)
    ).not.toBeInTheDocument();
  });

  it("sorts completed tickets from oldest to newest", async () => {
    const user = userEvent.setup();

    const olderTicket = createParkingTicket(
      "CAR",
      [],
      "OLD-1111",
      new Date("2026-09-11T08:00:00")
    );

    olderTicket.status = "COMPLETED";
    olderTicket.paymentStatus = "PAID";
    olderTicket.paymentMethod = "CASH";
    olderTicket.exitTime =
      new Date("2026-09-11T09:00:00").toISOString();
    olderTicket.durationMinutes = 60;
    olderTicket.fee = 20;

    const newerTicket = createParkingTicket(
      "CAR",
      [olderTicket.id],
      "NEW-2222",
      new Date("2026-09-11T10:00:00")
    );

    newerTicket.status = "COMPLETED";
    newerTicket.paymentStatus = "PAID";
    newerTicket.paymentMethod = "CARD";
    newerTicket.exitTime =
      new Date("2026-09-11T11:00:00").toISOString();
    newerTicket.durationMinutes = 60;
    newerTicket.fee = 20;

    saveToStorage(STORAGE_KEYS.TICKETS, [
      olderTicket,
      newerTicket,
    ]);

    render(<ParkingHistoryPage />);

    await screen.findByText(newerTicket.id);

    const sortSelect =
      screen.getAllByRole("combobox")[1];

    await user.selectOptions(
      sortSelect,
      "OLDEST"
    );

    const ticketIds = screen
      .getAllByText(/PP-\d{8}-\d{3}/)
      .map((element) => element.textContent);

    expect(ticketIds[0]).toBe(
      olderTicket.id
    );

    expect(ticketIds[1]).toBe(
      newerTicket.id
    );
  });
});