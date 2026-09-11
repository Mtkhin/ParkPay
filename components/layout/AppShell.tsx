"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "./Sidebar";

import {
  getFromStorage,
  STORAGE_KEYS,
} from "@/lib/storage/localStorage";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [authChecked, setAuthChecked] =
    useState(false);

  useEffect(() => {
    if (pathname === "/login") {
      setAuthChecked(true);
      return;
    }

    const isLoggedIn = getFromStorage<boolean>(
      STORAGE_KEYS.AUTH,
      false
    );

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    setAuthChecked(true);
  }, [pathname, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090b0d]">
        <p className="text-sm text-white/30">
          Checking access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b0d] text-[#f3f0e8]">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}