"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import MobileNav from "./MobileNav";
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
      const timeoutId = window.setTimeout(() => {
        setAuthChecked(true);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    const isLoggedIn =
      getFromStorage<boolean>(
        STORAGE_KEYS.AUTH,
        false
      );

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAuthChecked(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
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
      <div className="fixed inset-y-0 left-0 z-40 hidden h-screen w-64 overflow-y-auto lg:block">
        <Sidebar />
      </div>

      <main className="min-h-screen min-w-0 lg:ml-64">
        <MobileNav />

        {children}
      </main>
    </div>
  );
}