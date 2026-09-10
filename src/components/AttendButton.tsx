"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AttendButton({
  assemblyId,
  label = "참여 예정 표시하기",
}: {
  assemblyId: string;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const handleClick = () => {
    setError(false);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/assembly/${assemblyId}/attend`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("failed");
        const data: { attendingCount: number } = await res.json();
        router.push(
          `/assembly/${assemblyId}/joined?count=${data.attendingCount}`
        );
      } catch {
        setError(true);
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="block w-full rounded-2xl bg-amber py-4 text-center text-[15px] font-extrabold text-[#3A2503] transition active:bg-amber-dark disabled:opacity-60"
      >
        {isPending ? "표시하는 중…" : label}
      </button>
      {error && (
        <p className="mt-2 text-center text-[12px] font-semibold text-warn">
          잠시 후 다시 시도해 주세요.
        </p>
      )}
      <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-muted">
        이름·로그인 없이 숫자만 집계됩니다.
        <br />
        누가 눌렀는지는 저장하지 않습니다.
      </p>
    </div>
  );
}
