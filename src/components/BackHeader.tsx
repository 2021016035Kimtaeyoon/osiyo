"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BackHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="flex items-center gap-2.5 px-4 pb-3 pt-3">
      <button
        onClick={() => router.back()}
        aria-label="뒤로 가기"
        className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-white text-[17px] text-navy shadow-sm shadow-navy/10"
      >
        ‹
      </button>
      <h1 className="min-w-0 flex-1 truncate text-[18px] font-extrabold tracking-tight text-navy">
        {title}
      </h1>
      {action}
    </header>
  );
}
