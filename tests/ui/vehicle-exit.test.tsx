import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VehicleExitPage from "../../app/exit/page";

import { createParkingTicket } from "../../lib/parking/ticket";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Vehicle Exit page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, "", "/exit");
  });

  it("renders the ticket lookup form", () => {
    render(<VehicleExitPage />);

    expect(
      screen.getByRole("heading", {
        name: "Vehicle Exit",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Ticket ID")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Find Ticket/i,
      })
    ).toBeInTheDocument();
  });

  it("finds an active ticket and displays the correct parking fee", async () => {
    const user = userEvent.setup();

    const entryDate = new Date(
      Date.now() - 140 * 60 * 1000
    );

    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      entryDate
    );

    saveToStorage(
      STORAGE_KEYS.TICKETS,
      [ticket]
    );

    render(<VehicleExitPage />);

    await user.type(
      screen.getByLabelText("Ticket ID"),
      ticket.id
    );

    await user.click(
      screen.getByRole("button", {
        name: /Find Ticket/i,
      })
    );

    expect(
      await screen.findByText(ticket.id)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/1AB-1234/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText("฿40")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Proceed to Payment/i,
      })
    ).toBeInTheDocument();
  });

  it("shows an error for an invalid ticket ID", async () => {
    const user = userEvent.setup();

    render(<VehicleExitPage />);

    await user.type(
      screen.getByLabelText("Ticket ID"),
      "INVALID-TICKET"
    );

    await user.click(
      screen.getByRole("button", {
        name: /Find Ticket/i,
      })
    );

    expect(
      screen.getByText(
        "Ticket not found. Check the ticket ID and try again."
      )
    ).toBeInTheDocument();
  });
});