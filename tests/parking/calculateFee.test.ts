import { describe, expect, it } from "vitest";
import { calculateFee } from "../../lib/parking/calculateFee";

describe("calculateFee - Bicycle", () => {
  it("returns 0 THB for 0 minutes", () => {
    expect(calculateFee("BICYCLE", 0)).toBe(0);
  });

  it("returns 0 THB for 30 minutes", () => {
    expect(calculateFee("BICYCLE", 30)).toBe(0);
  });

  it("returns 0 THB for 60 minutes", () => {
    expect(calculateFee("BICYCLE", 60)).toBe(0);
  });

  it("returns 0 THB for 120 minutes", () => {
    expect(calculateFee("BICYCLE", 120)).toBe(0);
  });
});

describe("calculateFee - Motorcycle", () => {
  it("returns 0 THB for 0 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 0)).toBe(0);
  });

  it("returns 0 THB for 15 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 15)).toBe(0);
  });

  it("returns 10 THB for 16 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 16)).toBe(10);
  });

  it("returns 10 THB for 60 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 60)).toBe(10);
  });

  it("returns 15 THB for 61 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 61)).toBe(15);
  });

  it("returns 15 THB for 120 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 120)).toBe(15);
  });

  it("returns 20 THB for 121 minutes", () => {
    expect(calculateFee("MOTORCYCLE", 121)).toBe(20);
  });
});

describe("calculateFee - Car", () => {
  it("returns 0 THB for 0 minutes", () => {
    expect(calculateFee("CAR", 0)).toBe(0);
  });

  it("returns 0 THB for 15 minutes", () => {
    expect(calculateFee("CAR", 15)).toBe(0);
  });

  it("returns 20 THB for 16 minutes", () => {
    expect(calculateFee("CAR", 16)).toBe(20);
  });

  it("returns 20 THB for 60 minutes", () => {
    expect(calculateFee("CAR", 60)).toBe(20);
  });

  it("returns 30 THB for 61 minutes", () => {
    expect(calculateFee("CAR", 61)).toBe(30);
  });

  it("returns 30 THB for 120 minutes", () => {
    expect(calculateFee("CAR", 120)).toBe(30);
  });

  it("returns 40 THB for 121 minutes", () => {
    expect(calculateFee("CAR", 121)).toBe(40);
  });

  it("returns 40 THB for 140 minutes", () => {
    expect(calculateFee("CAR", 140)).toBe(40);
  });
});

describe("calculateFee - Boundary Value Testing", () => {
  it("tests important time boundaries for a car", () => {
    expect(calculateFee("CAR", 14)).toBe(0);
    expect(calculateFee("CAR", 15)).toBe(0);
    expect(calculateFee("CAR", 16)).toBe(20);

    expect(calculateFee("CAR", 59)).toBe(20);
    expect(calculateFee("CAR", 60)).toBe(20);
    expect(calculateFee("CAR", 61)).toBe(30);

    expect(calculateFee("CAR", 119)).toBe(30);
    expect(calculateFee("CAR", 120)).toBe(30);
    expect(calculateFee("CAR", 121)).toBe(40);
  });
});

describe("calculateFee - Negative Testing", () => {
  it("throws an error for a negative duration", () => {
    expect(() => calculateFee("CAR", -1)).toThrow(
      "Parking duration cannot be negative"
    );
  });
});