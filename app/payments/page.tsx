"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CreditCard,
  History,
  QrCode,
  ReceiptText,
  Search,
} from "lucide-react";

import type {
  ParkingTicket,
  PaymentMethod,
} from "@/lib/parking/ticket";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

type PaymentFilter = "ALL" | PaymentMethod;
type SortOrder = "NEWEST" | "OLDEST";

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPaymentMethod(method?: PaymentMethod) {
  if (!method) {
    return "-";
  }

  if (method === "QR") {
    return "QR Payment";
  }

  return (
    method.charAt(0) +
    method.slice(1).toLowerCase()
  );
}

function getPaymentIcon(method?: PaymentMethod) {
  if (method === "CARD") {
    return CreditCard;
  }

  if (method === "QR") {
    return QrCode;
  }

  return Banknote;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] =
    useState<ParkingTicket[]>([]);

  const [search, setSearch] = useState("");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("ALL");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("NEWEST");

  useEffect(() => {
    const storedPayments =
      getFromStorage<ParkingTicket[]>(
        STORAGE_KEYS.PAYMENTS,
        []
      );

    setPayments(storedPayments);
  }, []);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        (payment.plateNumber ?? "")
          .toLowerCase()
          .includes(query);

      const matchesMethod =
        paymentFilter === "ALL" ||
        payment.paymentMethod === paymentFilter;

      return matchesSearch && matchesMethod;
    });

    return [...result].sort((a, b) => {
      const aTime = new Date(
        a.exitTime ?? a.createdAt
      ).getTime();

      const bTime = new Date(
        b.exitTime ?? b.createdAt
      ).getTime();

      return sortOrder === "NEWEST"
        ? bTime - aTime
        : aTime - bTime;
    });
  }, [
    payments,
    search,
    paymentFilter,
    sortOrder,
  ]);

  const totalRevenue = payments.reduce(
    (total, payment) =>
      total + (payment.fee ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <header className="border-b border-white/8 px-8 py-7 lg:px-10">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          Financial Records
        </p>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-tight lg:text-4xl">
              Payment History
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Review completed parking transactions and
              payment methods.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-white/8 bg-[#0d1012] px-5 py-3">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                Transactions
              </p>

              <p className="mt-1 font-serif text-xl text-white/70">
                {payments.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#0d1012] px-5 py-3">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                Revenue
              </p>

              <p className="mt-1 font-serif text-xl text-white/70">
                ฿{totalRevenue}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6 px-8 py-8 lg:px-10">
        <section className="rounded-xl border border-white/8 bg-[#0d1012] p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={1.6}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by ticket ID or plate number"
                className="w-full rounded-lg border border-white/8 bg-[#090b0d] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#9bc7d5]/40"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(
                  event.target.value as PaymentFilter
                )
              }
              className="rounded-lg border border-white/8 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#9bc7d5]/40 xl:min-w-48"
            >
              <option value="ALL">
                All payment methods
              </option>

              <option value="CASH">Cash</option>

              <option value="CARD">Card</option>

              <option value="QR">
                QR Payment
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value as SortOrder
                )
              }
              className="rounded-lg border border-white/8 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none transition focus:border-[#9bc7d5]/40 xl:min-w-44"
            >
              <option value="NEWEST">
                Newest first
              </option>

              <option value="OLDEST">
                Oldest first
              </option>
            </select>
          </div>
        </section>

        {filteredPayments.length === 0 ? (
          <section className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1012] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-white/25">
              <ReceiptText
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <h2 className="mt-6 font-serif text-xl text-white/60">
              No payment records found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/25">
              Successful parking payments will
              appear here after transactions are
              completed.
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-white/8 bg-[#0d1012]">
            <div className="hidden grid-cols-[1.4fr_1fr_1.2fr_1fr_0.8fr_0.8fr] gap-4 border-b border-white/8 px-6 py-3 lg:grid">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Ticket
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Vehicle
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Payment Time
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Method
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Amount
              </p>

              <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                Status
              </p>
            </div>

            <div className="divide-y divide-white/6">
              {filteredPayments.map((payment) => {
                const PaymentIcon =
                  getPaymentIcon(
                    payment.paymentMethod
                  );

                return (
                  <div
                    key={payment.id}
                    className="grid gap-5 px-6 py-5 transition hover:bg-white/[0.015] lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_0.8fr_0.8fr] lg:items-center"
                  >
                    <div>
                      <p className="font-mono text-xs text-white/70">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        {payment.plateNumber ??
                          "No plate"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm capitalize text-white/55">
                        {payment.vehicleType.toLowerCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-white/45">
                        {formatDateTime(
                          payment.exitTime
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 text-white/30">
                        <PaymentIcon
                          size={14}
                          strokeWidth={1.6}
                        />
                      </div>

                      <p className="text-sm text-white/45">
                        {formatPaymentMethod(
                          payment.paymentMethod
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="font-serif text-lg text-white/70">
                        ฿{payment.fee ?? 0}
                      </p>
                    </div>

                    <div>
                      <span className="rounded-full border border-[#9bc7d5]/20 bg-[#9bc7d5]/5 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-[#9bc7d5]">
                        PAID
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="flex items-center gap-2 text-xs text-white/20">
          <History
            size={13}
            strokeWidth={1.5}
          />

          Payment records are stored locally in
          this browser.
        </div>
      </main>
    </div>
  );
}