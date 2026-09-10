"use client";

import { useMemo, useState } from "react";
import type { Assembly, AssemblyTopic, ConflictAlert } from "@/types";
import { AssemblyCard } from "@/components/AssemblyCard";
import { ConflictCard } from "@/components/ConflictCard";
import { isSameSeoulDay } from "@/lib/grouping";

const TOPIC_CHIPS: ("전체" | AssemblyTopic)[] = [
  "전체",
  "노동",
  "환경",
  "주거",
  "교육",
  "인권",
];

type Row =
  | { type: "assembly"; key: string; startAt: string; item: Assembly }
  | { type: "conflict"; key: string; startAt: string; item: ConflictAlert };

export function HomeFeed({
  assemblies,
  conflictAlerts,
  now,
}: {
  assemblies: Assembly[];
  conflictAlerts: ConflictAlert[];
  now: string;
}) {
  const [topic, setTopic] = useState<(typeof TOPIC_CHIPS)[number]>("전체");

  const byId = useMemo(
    () => new Map(assemblies.map((a) => [a.id, a] as const)),
    [assemblies]
  );

  const filtered = useMemo(
    () =>
      topic === "전체"
        ? assemblies
        : assemblies.filter((a) => a.topics.includes(topic as AssemblyTopic)),
    [assemblies, topic]
  );

  const rows = useMemo(() => {
    const conflictedIds =
      topic === "전체"
        ? new Set(conflictAlerts.flatMap((c) => c.assemblyIds))
        : new Set<string>();

    const result: Row[] = [];
    const seenConflict = new Set<string>();
    for (const a of filtered) {
      if (conflictedIds.has(a.id)) {
        const alert = conflictAlerts.find((c) => c.assemblyIds.includes(a.id));
        if (alert && !seenConflict.has(alert.zoneName)) {
          seenConflict.add(alert.zoneName);
          const first = byId.get(alert.assemblyIds[0]);
          result.push({
            type: "conflict",
            key: `conflict-${alert.zoneName}`,
            startAt: first?.startAt ?? now,
            item: alert,
          });
        }
        continue;
      }
      result.push({
        type: "assembly",
        key: a.id,
        startAt: a.startAt,
        item: a,
      });
    }
    return result;
  }, [filtered, conflictAlerts, topic, byId, now]);

  const today = rows.filter((r) => isSameSeoulDay(r.startAt, now));
  const upcoming = rows
    .filter((r) => !isSameSeoulDay(r.startAt, now))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3.5 [scrollbar-width:none]">
        {TOPIC_CHIPS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`shrink-0 whitespace-nowrap rounded-pill border px-3.5 py-2 text-[12.5px] font-bold ${
              topic === t
                ? "border-navy bg-navy text-white"
                : "border-line bg-white text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 pb-6">
        <p className="mb-2.5 flex items-center justify-between text-[12px] font-extrabold tracking-wide text-muted">
          <span>오늘</span>
          <b className="text-navy-2">{today.length}건</b>
        </p>
        <div className="space-y-2.5">
          {today.length === 0 && (
            <p className="rounded-card border border-dashed border-line py-8 text-center text-[13px] font-medium text-muted">
              오늘 예정된 집회가 없습니다.
            </p>
          )}
          {today.map((r) =>
            r.type === "assembly" ? (
              <AssemblyCard key={r.key} assembly={r.item} />
            ) : (
              <ConflictCard key={r.key} alert={r.item} />
            )
          )}
        </div>

        {upcoming.length > 0 && (
          <>
            <p className="mb-2.5 mt-5 flex items-center justify-between text-[12px] font-extrabold tracking-wide text-muted">
              <span>이번 주 예정</span>
              <b className="text-navy-2">{upcoming.length}건</b>
            </p>
            <div className="space-y-2.5">
              {upcoming.map((r) =>
                r.type === "assembly" ? (
                  <AssemblyCard key={r.key} assembly={r.item} />
                ) : (
                  <ConflictCard key={r.key} alert={r.item} />
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
