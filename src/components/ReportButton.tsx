"use client";

import { useState, useTransition } from "react";

export function ReportButton({ assemblyId }: { assemblyId: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await fetch(`/api/march/${assemblyId}/report`, { method: "POST" });
        setDone(true);
      } catch {
        // 네트워크 실패는 조용히 무시 — 재시도는 다음 클릭으로 충분하다
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="block w-full rounded-2xl bg-amber py-4 text-center text-[15px] font-extrabold text-[#3A2503] disabled:opacity-60"
      >
        {isPending ? "제보하는 중…" : "지금 여기 지나감 제보"}
      </button>
      <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-muted">
        {done
          ? "제보 감사합니다 · 익명 처리됨"
          : "위치·시각은 저장하지 않고, 익명 건수만 집계됩니다."}
      </p>
    </div>
  );
}
