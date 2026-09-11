import { describe, expect, it } from "vitest";
import { calculateFee } from "../../lib/parking/calculateFee";

describe("calculateFee", () => {
  it("returns 0 THB during the 15-minute grace period", () => {
    expect(calculateFee("CAR", 15)).toBe(0);
  });

  it("charges the first-hour car rate after the grace period", () => {
    expect(calculateFee("CAR", 16)).toBe(20);
  });

  it("rounds partial hours up", () => {
    expect(calculateFee("CAR", 61)).toBe(30);
  });

  it("calculates 140 minutes for a car as 40 THB", () => {
    expect(calculateFee("CAR", 140)).toBe(40);
  });

  it("rejects a negative parking duration", () => {
    expect(() => calculateFee("CAR", -1)).toThrow(
      "Parking duration cannot be negative"
    );
  });
});