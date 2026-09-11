import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PaymentPage from "../../app/payment/page";

import { createParkingTicket } from "../../lib/parking/ticket";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Payment page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, "", "/payment");
  });

  it("shows payment options for a valid active ticket", async () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date(Date.now() - 140 * 60 * 1000)
    );

    saveToStorage(
      STORAGE_KEYS.TICKETS,
      [ticket]
    );

    window.history.pushState(
      {},
      "",
      `/payment?ticket=${ticket.id}`
    );

    render(<PaymentPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Parking Payment",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Cash/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Card/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /QR Payment/i,
      })
    ).toBeInTheDocument();
  });

  it("processes payment and displays the receipt", async () => {
    const user = userEvent.setup();

    const ticket = createParkingTicket(
      "CAR",
      [],
      "1AB-1234",
      new Date(Date.now() - 140 * 60 * 1000)
    );

    saveToStorage(
      STORAGE_KEYS.TICKETS,
      [ticket]
    );

    window.history.pushState(
      {},
      "",
      `/payment?ticket=${ticket.id}`
    );

    render(<PaymentPage />);

    const cashButton = await screen.findByRole(
      "button",
      {
        name: /Cash/i,
      }
    );

    await user.click(cashButton);

    await user.click(
      screen.getByRole("button", {
        name: /Confirm Payment/i,
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: "Receipt",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Payment successful")
    ).toBeInTheDocument();

    expect(
      screen.getByText(ticket.id)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Payment Status: PAID/i)
    ).toBeInTheDocument();

    const storedTickets = JSON.parse(
      window.localStorage.getItem(
        STORAGE_KEYS.TICKETS
      ) ?? "[]"
    );

    expect(storedTickets[0].status).toBe(
      "COMPLETED"
    );

    expect(
      storedTickets[0].paymentStatus
    ).toBe("PAID");

    expect(
      storedTickets[0].paymentMethod
    ).toBe("CASH");

    const storedPayments = JSON.parse(
      window.localStorage.getItem(
        STORAGE_KEYS.PAYMENTS
      ) ?? "[]"
    );

    expect(storedPayments).toHaveLength(1);
  });

  it("shows an error when confirming without a payment method", async () => {
    const user = userEvent.setup();

    const ticket = createParkingTicket(
      "CAR",
      [],
      undefined,
      new Date(Date.now() - 60 * 60 * 1000)
    );

    saveToStorage(
      STORAGE_KEYS.TICKETS,
      [ticket]
    );

    window.history.pushState(
      {},
      "",
      `/payment?ticket=${ticket.id}`
    );

    render(<PaymentPage />);

    await screen.findByRole("heading", {
      name: "Parking Payment",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Confirm Payment/i,
      })
    );

    expect(
      screen.getByText(
        "Please select a payment method."
      )
    ).toBeInTheDocument();
  });
});