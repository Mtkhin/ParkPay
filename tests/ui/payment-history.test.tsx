import { beforeEach, describe, expect, it } from "vitest";
import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PaymentHistoryPage from "../../app/payments/page";

import { createParkingTicket } from "../../lib/parking/ticket";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Payment History page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows saved payment records", async () => {
    const ticket = createParkingTicket(
      "CAR",
      [],
      "PAY-1111",
      new Date("2026-09-11T10:00:00")
    );

    ticket.status = "COMPLETED";
    ticket.paymentStatus = "PAID";
    ticket.paymentMethod = "CASH";
    ticket.exitTime =
      new Date("2026-09-11T12:20:00").toISOString();
    ticket.durationMinutes = 140;
    ticket.fee = 40;

    saveToStorage(
      STORAGE_KEYS.PAYMENTS,
      [ticket]
    );

    render(<PaymentHistoryPage />);

    const ticketId = await screen.findByText(
      ticket.id
    );

    const paymentRow =
      ticketId.closest("div.grid");

    if (!(paymentRow instanceof HTMLElement)) {
      throw new Error(
        "Payment row could not be found"
      );
    }

    expect(
      within(paymentRow).getByText("PAY-1111")
    ).toBeInTheDocument();

    expect(
      within(paymentRow).getByText("Cash")
    ).toBeInTheDocument();

    expect(
      within(paymentRow).getByText("฿40")
    ).toBeInTheDocument();

    expect(
      within(paymentRow).getByText("PAID")
    ).toBeInTheDocument();
  });

  it("searches payment history by plate number", async () => {
    const user = userEvent.setup();

    const firstTicket = createParkingTicket(
      "CAR",
      [],
      "CAR-PAY-111",
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
      "MOTO-PAY-222",
      new Date("2026-09-11T09:30:00")
    );

    secondTicket.status = "COMPLETED";
    secondTicket.paymentStatus = "PAID";
    secondTicket.paymentMethod = "QR";
    secondTicket.exitTime =
      new Date("2026-09-11T10:30:00").toISOString();
    secondTicket.durationMinutes = 60;
    secondTicket.fee = 10;

    saveToStorage(
      STORAGE_KEYS.PAYMENTS,
      [firstTicket, secondTicket]
    );

    render(<PaymentHistoryPage />);

    await screen.findByText(firstTicket.id);

    const searchInput =
      screen.getByPlaceholderText(
        "Search by ticket ID or plate number"
      );

    await user.type(
      searchInput,
      "MOTO-PAY-222"
    );

    expect(
      screen.getByText("MOTO-PAY-222")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("CAR-PAY-111")
    ).not.toBeInTheDocument();
  });

  it("filters payment history by payment method", async () => {
    const user = userEvent.setup();

    const cashTicket = createParkingTicket(
      "CAR",
      [],
      "CASH-111",
      new Date("2026-09-11T08:00:00")
    );

    cashTicket.status = "COMPLETED";
    cashTicket.paymentStatus = "PAID";
    cashTicket.paymentMethod = "CASH";
    cashTicket.exitTime =
      new Date("2026-09-11T09:00:00").toISOString();
    cashTicket.durationMinutes = 60;
    cashTicket.fee = 20;

    const cardTicket = createParkingTicket(
      "CAR",
      [cashTicket.id],
      "CARD-222",
      new Date("2026-09-11T10:00:00")
    );

    cardTicket.status = "COMPLETED";
    cardTicket.paymentStatus = "PAID";
    cardTicket.paymentMethod = "CARD";
    cardTicket.exitTime =
      new Date("2026-09-11T11:00:00").toISOString();
    cardTicket.durationMinutes = 60;
    cardTicket.fee = 20;

    saveToStorage(
      STORAGE_KEYS.PAYMENTS,
      [cashTicket, cardTicket]
    );

    render(<PaymentHistoryPage />);

    await screen.findByText(cashTicket.id);

    const paymentFilter =
      screen.getAllByRole("combobox")[0];

    await user.selectOptions(
      paymentFilter,
      "CARD"
    );

    expect(
      screen.getByText("CARD-222")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("CASH-111")
    ).not.toBeInTheDocument();
  });
});