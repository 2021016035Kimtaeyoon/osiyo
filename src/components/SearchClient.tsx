"use client";

import { useMemo, useState } from "react";
import { AssemblyCard } from "@/components/AssemblyCard";
import { Notice } from "@/components/Notice";
import { searchAssemblies } from "@/lib/mock";

const SUGGESTIONS = ["노동", "환경", "주거", "교육", "인권", "기후"];

export function SearchClient() {
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    if (!keyword.trim()) return [];
    return searchAssemblies(keyword);
  }, [keyword]);

  return (
    <div className="flex-1 px-4 pb-8">
      <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-3">
        <span className="text-mist">🔍</span>
        <input
          autoFocus
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="관심 주제로 검색"
          className="w-full bg-transparent text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted"
        />
      </div>

      {!keyword.trim() && (
        <>
          <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-muted">
            추천 주제
          </p>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setKeyword(s)}
                className="rounded-pill border border-line bg-white px-3.5 py-2 text-[12.5px] font-bold text-muted"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {keyword.trim() && (
        <>
          <p className="mb-2.5 flex items-center justify-between text-[12px] font-extrabold tracking-wide text-muted">
            <span>검색 결과</span>
            <b className="text-navy-2">{results.length}건</b>
          </p>
          <div className="space-y-2.5">
            {results.length === 0 && (
              <p className="rounded-card border border-dashed border-line py-8 text-center text-[13px] font-medium text-muted">
                일치하는 집회가 없습니다.
              </p>
            )}
            {results.map((a) => (
              <AssemblyCard key={a.id} assembly={a} />
            ))}
          </div>
          <div className="mt-3.5">
            <Notice>
              검색 결과는 <b>경찰에 신고된 공식 정보</b>만 표시합니다.
              SNS·커뮤니티 게시물은 포함하지 않습니다.
            </Notice>
          </div>
        </>
      )}
    </div>
  );
}
