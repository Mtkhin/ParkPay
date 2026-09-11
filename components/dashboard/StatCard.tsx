import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
}

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/8 bg-[#0d1012] p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
            {label}
          </p>

          <p className="mt-4 font-serif text-3xl tracking-tight text-[#f3f0e8]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white/45">
          <Icon size={17} strokeWidth={1.6} />
        </div>
      </div>

      <div className="mt-5 border-t border-white/6 pt-3">
        <p className="text-xs text-white/30">
          {detail}
        </p>
      </div>
    </div>
  );
}