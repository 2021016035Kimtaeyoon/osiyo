"use client";

import { useState } from "react";

export function RerouteButton() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <button
        onClick={() => setMessage("경로를 다시 계산했습니다")}
        className="block w-full rounded-2xl border border-line bg-white py-3.5 text-center text-[14px] font-bold text-navy"
      >
        경로 재탐색
      </button>
      {message && (
        <p className="mt-2 text-center text-[12px] font-semibold text-navy-2">
          {message}
        </p>
      )}
    </div>
  );
}
