import { describe, expect, it } from "vitest";
import { calculateDuration } from "../../lib/parking/calculateDuration";

describe("calculateDuration", () => {
  it("returns 0 minutes when entry and exit times are the same", () => {
    expect(
      calculateDuration(
        "2026-09-11T10:00:00",
        "2026-09-11T10:00:00"
      )
    ).toBe(0);
  });

  it("calculates 30 minutes correctly", () => {
    expect(
      calculateDuration(
        "2026-09-11T10:00:00",
        "2026-09-11T10:30:00"
      )
    ).toBe(30);
  });

  it("calculates 60 minutes correctly", () => {
    expect(
      calculateDuration(
        "2026-09-11T10:00:00",
        "2026-09-11T11:00:00"
      )
    ).toBe(60);
  });

  it("calculates 140 minutes correctly", () => {
    expect(
      calculateDuration(
        "2026-09-11T10:00:00",
        "2026-09-11T12:20:00"
      )
    ).toBe(140);
  });

  it("throws an error when exit time is before entry time", () => {
    expect(() =>
      calculateDuration(
        "2026-09-11T12:00:00",
        "2026-09-11T10:00:00"
      )
    ).toThrow("Exit time cannot be before entry time");
  });

  it("throws an error for an invalid entry time", () => {
    expect(() =>
      calculateDuration(
        "invalid-date",
        "2026-09-11T10:00:00"
      )
    ).toThrow("Invalid entry or exit time");
  });

  it("throws an error for an invalid exit time", () => {
    expect(() =>
      calculateDuration(
        "2026-09-11T10:00:00",
        "invalid-date"
      )
    ).toThrow("Invalid entry or exit time");
  });
});