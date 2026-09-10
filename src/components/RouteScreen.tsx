"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MapCircle, MapPolyline } from "@/components/SchematicMap";
import { KakaoMap } from "@/components/KakaoMap";
import { RouteCard } from "@/components/RouteCard";
import { DeepLinkButtons } from "@/components/DeepLinkButtons";
import { Notice } from "@/components/Notice";
import type { RouteComparison } from "@/types";
import type { RoutePoint } from "@/lib/deeplink";
import { formatTime } from "@/lib/format";

export function RouteScreen({
  origin,
  destination,
  comparison,
  blockingZone,
  dispersalAt,
}: {
  origin: RoutePoint;
  destination: RoutePoint;
  comparison: RouteComparison;
  blockingZone?: { name: string; center: { lat: number; lng: number }; radiusM: number };
  dispersalAt?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<"avoidance" | "shortest">(
    comparison.shortest.throughRestrictedZone ? "avoidance" : "shortest"
  );

  const polylines: MapPolyline[] = comparison.shortest.throughRestrictedZone
    ? [
        { path: comparison.avoidance.polyline, color: "#2B4B8C", width: 6 },
        {
          path: comparison.shortest.polyline,
          color: "#D9534F",
          width: 4,
          dashed: true,
        },
      ]
    : [{ path: comparison.shortest.polyline, color: "#2B4B8C", width: 6 }];

  const circles: MapCircle[] = blockingZone
    ? [
        {
          center: blockingZone.center,
          radiusM: blockingZone.radiusM,
          color: "#D9534F",
          fillOpacity: 0.22,
        },
      ]
    : [];

  const via: RoutePoint | undefined =
    comparison.avoidance.polyline.length === 3
      ? { ...comparison.avoidance.polyline[1], name: "우회 경유지" }
      : undefined;

  return (
    <div className="flex-1 space-y-3.5 px-4 pb-10">
      <div className="rounded-2xl border border-line bg-white px-3.5 py-1">
        <div className="flex items-center gap-2.5 border-b border-line py-3">
          <span className="size-2.5 shrink-0 rounded-full bg-navy-2" />
          <span className="flex-1 text-[14.5px] font-bold text-ink">
            {origin.name}
          </span>
        </div>
        <div className="flex items-center gap-2.5 py-3">
          <span className="size-2.5 shrink-0 rounded-full bg-amber-dark" />
          <span className="flex-1 text-[14.5px] font-bold text-ink">
            {destination.name}
          </span>
        </div>
      </div>

      <KakaoMap
        center={origin}
        polylines={polylines}
        circles={circles}
        markers={[
          { id: "origin", position: origin, variant: "small" },
          { id: "dest", position: destination, variant: "small" },
        ]}
        height={250}
      />

      <div className="space-y-2.5">
        <RouteCard
          route={comparison.avoidance}
          selected={selected === "avoidance"}
          onSelect={() => setSelected("avoidance")}
        />
        {comparison.shortest.throughRestrictedZone && (
          <RouteCard
            route={comparison.shortest}
            selected={selected === "shortest"}
            onSelect={() => setSelected("shortest")}
          />
        )}
      </div>

      {comparison.shortest.throughRestrictedZone && (
        <Notice>
          통제 구간을 <b>경유 금지 지점</b>으로 잡아 경로를 다시 계산했습니다.
          {dispersalAt && (
            <>
              {" "}
              해산 예정 <b>{formatTime(dispersalAt)}</b> 이후에는 최단 경로가
              다시 추천됩니다.
            </>
          )}
        </Notice>
      )}

      <button
        onClick={() => router.push(`/navigate?kind=${selected}`)}
        className="block w-full rounded-2xl bg-amber py-3.5 text-center text-[15px] font-extrabold text-[#3A2503]"
      >
        이 경로로 안내 시작
      </button>

      <div>
        <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-muted">
          다른 앱으로 열기
        </p>
        <DeepLinkButtons origin={origin} destination={destination} via={via} />
        <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-muted">
          오시요는 자체 내비를 만들지 않습니다.
          <br />
          통제 구간을 뺀 경유지를 지도 앱에 넘겨줍니다.
        </p>
      </div>
    </div>
  );
}
