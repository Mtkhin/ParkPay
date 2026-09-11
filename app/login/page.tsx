"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleParking,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

const DEMO_EMAIL = "staff@parkpay.demo";
const DEMO_PASSWORD = "parkpay123";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (
      email.trim() !== DEMO_EMAIL ||
      password !== DEMO_PASSWORD
    ) {
      setError("Incorrect demo email or password.");
      return;
    }

    saveToStorage(STORAGE_KEYS.AUTH, true);

    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#090b0d] text-[#f3f0e8]">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <section className="hidden flex-1 flex-col justify-between border-r border-white/8 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#111417]">
            <CircleParking
              size={23}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p className="font-serif text-2xl tracking-wide">
              ParkPay
            </p>

            <p className="mt-0.5 text-[9px] uppercase tracking-[0.24em] text-white/30">
              Parking System
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
            Staff Operations
          </p>

          <h1 className="mt-5 max-w-lg font-serif text-5xl leading-[1.08] tracking-tight text-[#f3f0e8]">
            Parking operations,
            <br />
            kept in order.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/35">
            Register vehicle entries, calculate parking
            fees, process payments, and review parking
            activity from one workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/20">
          <ShieldCheck
            size={15}
            strokeWidth={1.5}
          />

          <span>
            ITX4104 Software Testing · Frontend Prototype
          </span>
        </div>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#111417]">
                <CircleParking
                  size={21}
                  strokeWidth={1.7}
                />
              </div>

              <p className="font-serif text-xl">
                ParkPay
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
              Authorised Access
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-tight">
              Staff Login
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/35">
              Sign in using the demonstration staff account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/50"
              >
                Email
              </label>

              <div className="relative mt-2">
                <Mail
                  size={16}
                  strokeWidth={1.6}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="staff@parkpay.demo"
                  className="w-full rounded-lg border border-white/10 bg-[#0d1012] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#9bc7d5]/45"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-medium text-white/50"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={16}
                  strokeWidth={1.6}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-white/10 bg-[#0d1012] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-white/15 focus:border-[#9bc7d5]/45"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/55"
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                      strokeWidth={1.6}
                    />
                  ) : (
                    <Eye
                      size={16}
                      strokeWidth={1.6}
                    />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-400/15 bg-red-400/[0.04] px-4 py-3">
                <p className="text-xs leading-5 text-red-200/65">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#f3f0e8] px-5 py-3 text-sm font-medium text-[#111315] transition hover:bg-white"
            >
              Sign In

              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-white/8 bg-[#0d1012] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
              Demo Credentials
            </p>

            <div className="mt-3 space-y-2 font-mono text-xs text-white/45">
              <p>
                Email:{" "}
                <span className="text-white/65">
                  staff@parkpay.demo
                </span>
              </p>

              <p>
                Password:{" "}
                <span className="text-white/65">
                  parkpay123
                </span>
              </p>
            </div>

            <p className="mt-4 border-t border-white/6 pt-3 text-[11px] leading-5 text-white/20">
              This login is for demonstration purposes only
              and is not secure authentication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}