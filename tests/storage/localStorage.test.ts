import { beforeEach, describe, expect, it } from "vitest";

import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "../../lib/storage/localStorage";

describe("localStorage utility", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the fallback value when storage is empty", () => {
    const result = getFromStorage(STORAGE_KEYS.TICKETS, []);

    expect(result).toEqual([]);
  });

  it("saves and retrieves data correctly", () => {
    const tickets = [
      {
        id: "PP-20260911-001",
        status: "ACTIVE",
      },
    ];

    saveToStorage(STORAGE_KEYS.TICKETS, tickets);

    const result = getFromStorage(STORAGE_KEYS.TICKETS, []);

    expect(result).toEqual(tickets);
  });

  it("removes stored data", () => {
    saveToStorage(STORAGE_KEYS.AUTH, true);

    removeFromStorage(STORAGE_KEYS.AUTH);

    const result = getFromStorage(
      STORAGE_KEYS.AUTH,
      false
    );

    expect(result).toBe(false);
  });

  it("returns the fallback value when stored JSON is invalid", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.TICKETS,
      "invalid-json"
    );

    const result = getFromStorage(
      STORAGE_KEYS.TICKETS,
      []
    );

    expect(result).toEqual([]);
  });
});