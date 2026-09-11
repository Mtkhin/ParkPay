import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ActiveParkingPage from "../../app/active-parking/page";

import { createParkingTicket } from "../../lib/parking/ticket";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Active Parking page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows active parking tickets and hides completed tickets", async () => {
    const activeTicket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date(Date.now() - 60 * 60 * 1000)
    );

    const completedTicket = createParkingTicket(
      "MOTORCYCLE",
      [activeTicket.id],
      "8AB-999",
      new Date(Date.now() - 120 * 60 * 1000)
    );

    completedTicket.status = "COMPLETED";
    completedTicket.paymentStatus = "PAID";

    saveToStorage(STORAGE_KEYS.TICKETS, [
      activeTicket,
      completedTicket,
    ]);

    render(<ActiveParkingPage />);

    expect(
      await screen.findByText(activeTicket.id)
    ).toBeInTheDocument();

    expect(
      screen.getByText("1AB-1234")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(completedTicket.id)
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("8AB-999")
    ).not.toBeInTheDocument();
  });

  it("searches active parking by plate number", async () => {
    const user = userEvent.setup();

    const carTicket = createParkingTicket(
      "CAR",
      [],
      "CAR-1111",
      new Date(Date.now() - 30 * 60 * 1000)
    );

    const motorcycleTicket = createParkingTicket(
      "MOTORCYCLE",
      [carTicket.id],
      "MOTO-2222",
      new Date(Date.now() - 45 * 60 * 1000)
    );

    saveToStorage(STORAGE_KEYS.TICKETS, [
      carTicket,
      motorcycleTicket,
    ]);

    render(<ActiveParkingPage />);

    await screen.findByText(carTicket.id);

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

  it("filters active parking by vehicle type", async () => {
    const user = userEvent.setup();

    const carTicket = createParkingTicket(
      "CAR",
      [],
      "CAR-3333",
      new Date(Date.now() - 30 * 60 * 1000)
    );

    const bicycleTicket = createParkingTicket(
      "BICYCLE",
      [carTicket.id],
      undefined,
      new Date(Date.now() - 20 * 60 * 1000)
    );

    saveToStorage(STORAGE_KEYS.TICKETS, [
      carTicket,
      bicycleTicket,
    ]);

    render(<ActiveParkingPage />);

    await screen.findByText(carTicket.id);

    const vehicleFilter = screen.getByRole("combobox");

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
});