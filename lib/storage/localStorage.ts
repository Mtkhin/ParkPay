export const STORAGE_KEYS = {
  TICKETS: "parkpay_tickets",
  PAYMENTS: "parkpay_payments",
  AUTH: "parkpay_auth",
} as const;

export function getFromStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue === null) {
      return fallback;
    }

    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(
  key: string,
  value: T
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

export function removeFromStorage(
  key: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}