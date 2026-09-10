import type { ReactNode } from "react";

const styles = {
  info: "bg-amber-bg border-amber text-[#6B5220]",
  ok: "bg-ok-bg border-[#9BD3B4] text-[#1E6B43]",
  warn: "bg-warn-bg border-[#EBAFAD] text-[#8E322F]",
} as const;

export function Notice({
  variant = "info",
  children,
}: {
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border px-3.5 py-3 text-[13px] leading-relaxed font-medium ${styles[variant]}`}
    >
      {children}
    </div>
  );
}
