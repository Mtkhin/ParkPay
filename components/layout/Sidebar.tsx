"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogIn,
  CarFront,
  LogOut,
  TriangleAlert,
  CreditCard,
  History,
  Settings,
  CircleParking,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    section: "Parking",
    items: [
      {
        label: "Vehicle Entry",
        href: "/entry",
        icon: LogIn,
      },
      {
        label: "Active Parking",
        href: "/active-parking",
        icon: CarFront,
      },
      {
        label: "Vehicle Exit",
        href: "/exit",
        icon: LogOut,
      },
      {
        label: "Lost Ticket",
        href: "/lost-ticket",
        icon: TriangleAlert,
      },
    ],
  },
  {
    section: "Records",
    items: [
      {
        label: "Payment History",
        href: "/payments",
        icon: CreditCard,
      },
      {
        label: "Ticket History",
        href: "/history",
        icon: History,
      },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/8 bg-[#0b0d0f] px-4 py-6 text-[#f3f0e8]">
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#14181c]">
          <CircleParking size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="font-serif text-xl tracking-wide">
            ParkPay
          </h1>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            Parking System
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item, index) => {
          if ("section" in item) {
            return (
              <div key={item.section} className="mt-4">
                <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                  {item.section}
                </p>

                <div className="space-y-1">
                  {item.items?.map((subItem) => {
                    const Icon = subItem.icon;
                    const active = pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                          active
                            ? "bg-[#1b2025] text-white"
                            : "text-white/55 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.7} />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={`${item.href}-${index}`}
              href={item.href!}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[#1b2025] text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              {Icon && <Icon size={17} strokeWidth={1.7} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 px-3 pt-5">
        <p className="text-xs text-white/30">
          ITX4104 Software Testing
        </p>
        <p className="mt-1 text-[11px] text-white/20">
          ParkPay Prototype
        </p>
      </div>
    </aside>
  );
}