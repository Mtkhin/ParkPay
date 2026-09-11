import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import VehicleEntryPage from "../../app/entry/page";

import {
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("Vehicle Entry page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the vehicle entry form", () => {
    render(<VehicleEntryPage />);

    expect(
      screen.getByRole("heading", {
        name: "Vehicle Entry",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Generate Parking Ticket/i,
      })
    ).toBeInTheDocument();
  });

  it("allows staff to select a vehicle type", async () => {
    const user = userEvent.setup();

    render(<VehicleEntryPage />);

    const motorcycleButton = screen.getByRole(
      "button",
      {
        name: /Motorcycle/i,
      }
    );

    await user.click(motorcycleButton);

    expect(motorcycleButton).toHaveClass(
      "border-[#9bc7d5]/45"
    );
  });

  it("creates and displays a parking ticket", async () => {
    const user = userEvent.setup();

    render(<VehicleEntryPage />);

    const plateInput = screen.getByLabelText(
      "Plate number"
    );

    await user.type(
      plateInput,
      "1AB-1234"
    );

    await user.click(
      screen.getByRole("button", {
        name: /Generate Parking Ticket/i,
      })
    );

    expect(
      screen.getByText(
        "Vehicle registered"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("1AB-1234")
    ).toBeInTheDocument();

    expect(
      screen.getByText("ACTIVE")
    ).toBeInTheDocument();

    const storedTickets =
      window.localStorage.getItem(
        STORAGE_KEYS.TICKETS
      );

    expect(storedTickets).not.toBeNull();

    const parsedTickets = JSON.parse(
      storedTickets ?? "[]"
    );

    expect(parsedTickets).toHaveLength(1);
    expect(
      parsedTickets[0].plateNumber
    ).toBe("1AB-1234");
    expect(
      parsedTickets[0].vehicleType
    ).toBe("CAR");
    expect(
      parsedTickets[0].status
    ).toBe("ACTIVE");
  });
});