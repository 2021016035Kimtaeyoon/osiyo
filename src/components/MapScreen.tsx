"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Assembly, Congestion, ConflictAlert } from "@/types";
import { KakaoMap } from "@/components/KakaoMap";
import { CongestionBar } from "@/components/CongestionBar";
import { formatTime, formatHeadcount } from "@/lib/format";
import type { MapCircle, MapMarker } from "@/components/SchematicMap";

export function MapScreen({
  liveAssemblies,
  conflictAlerts,
  congestion,
  focus,
}: {
  liveAssemblies: Assembly[];
  conflictAlerts: ConflictAlert[];
  congestion: Congestion;
  /** 하단 정보 카드에 강조해서 보여줄 대표 집회 (행진 있는 것 우선) */
  focus: Assembly;
}) {
  const router = useRouter();
  const conflictedIds = new Set(conflictAlerts.flatMap((c) => c.assemblyIds));

  const seenConflictZones = new Set<string>();
  const markers: MapMarker[] = [];
  for (const a of liveAssemblies) {
    const conflict = conflictAlerts.find((c) => c.assemblyIds.includes(a.id));
    if (conflict) {
      if (seenConflictZones.has(conflict.zoneName)) continue;
      seenConflictZones.add(conflict.zoneName);
      markers.push({
        id: `conflict-${conflict.zoneName}`,
        position: a.location.center,
        variant: "warn",
        label: `맞불 ${conflict.assemblyIds.length}건 겹침`,
        onClick: () =>
          router.push(`/conflict/${encodeURIComponent(conflict.zoneName)}`),
      });
      continue;
    }
    markers.push({
      id: a.id,
      position: a.location.center,
      variant: "primary",
      label: `${a.title} · ${formatHeadcount(a.reportedHeadcount)}`,
      onClick: () => router.push(`/assembly/${a.id}`),
    });
  }

  const seenZoneCircles = new Set<string>();
  const circles: MapCircle[] = [];
  for (const a of liveAssemblies) {
    for (const z of a.restrictedZones) {
      const key = `${z.name}-${z.center.lat}-${z.center.lng}`;
      if (seenZoneCircles.has(key)) continue;
      seenZoneCircles.add(key);
      circles.push({
        center: z.center,
        radiusM: z.radiusM,
        color: conflictedIds.has(a.id) ? "#D9534F" : "#F2A93B",
        fillOpacity: 0.22,
      });
    }
  }

  const focusConflict = conflictAlerts.find((c) =>
    c.assemblyIds.includes(focus.id)
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pb-3.5 pt-4">
        <p className="text-[19px] font-black tracking-tighter text-navy">
          지금 <span className="text-amber">지도</span>
        </p>
      </div>

      <div className="px-4">
        <KakaoMap
          center={focus.location.center}
          markers={markers}
          circles={circles}
          height={300}
        />
      </div>

      <div className="flex-1 space-y-3 px-4 py-4">
        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            {focus.location.name} · 통제 중
          </h3>
          <dl className="divide-y divide-line text-[13.5px]">
            <div className="flex justify-between py-1.75">
              <span className="font-semibold text-muted">해산 예정</span>
              <span className="font-bold text-ink">
                {formatTime(focus.endAt)}
              </span>
            </div>
          </dl>

          <div className="mt-3">
            <CongestionBar congestion={congestion} />
          </div>

          <Link
            href="/route"
            className="mt-3.5 block rounded-2xl bg-amber py-3.5 text-center text-[14.5px] font-extrabold text-[#3A2503]"
          >
            통제 피해서 길찾기 ›
          </Link>
          {focus.marchRoute && (
            <Link
              href={`/march/${focus.id}`}
              className="mt-2.5 block rounded-2xl border border-line bg-white py-3.5 text-center text-[13.5px] font-bold text-navy"
            >
              행진 위치 추적 ›
            </Link>
          )}
        </div>

        {focusConflict && (
          <Link
            href={`/conflict/${encodeURIComponent(focusConflict.zoneName)}`}
            className="block rounded-card border border-line bg-surface p-4 shadow-sm shadow-navy/5"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-extrabold text-navy">
                맞불 겹침 경보
              </h3>
              <span className="shrink-0 rounded-pill bg-warn-bg px-2.5 py-1 text-[11px] font-extrabold text-warn">
                {focusConflict.zoneName}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-muted">
              {focusConflict.overlapDescription}
            </p>
          </Link>
        )}

        <Link
          href="/forecast"
          className="block rounded-card border border-line bg-surface p-4 shadow-sm shadow-navy/5"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-extrabold text-navy">
              이번 주 통제 예보
            </h3>
            <span className="shrink-0 rounded-pill bg-amber-bg px-2.5 py-1 text-[11px] font-extrabold text-amber-dark">
              주간
            </span>
          </div>
          <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-muted">
            이번 주 예정된 집회의 통제 구간과 예상 지연을 미리 확인하세요.
          </p>
        </Link>
      </div>
    </div>
  );
}
