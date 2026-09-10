"use client";

import type { ReactNode } from "react";
import type { LatLng } from "@/types";
import { boundsOf, metersToLat, projectToPercent } from "@/lib/geo";

const VB_W = 400;
const VB_H = 300;

export interface MapMarker {
  id: string;
  position: LatLng;
  variant?: "primary" | "small" | "warn";
  label?: string;
  onClick?: () => void;
}

export interface MapCircle {
  center: LatLng;
  radiusM: number;
  color: string;
  fillOpacity?: number;
}

export interface MapPolyline {
  path: LatLng[];
  color: string;
  dashed?: boolean;
  width?: number;
}

/**
 * 카카오맵 SDK 없이도 위치 관계를 보여주는 스키매틱(도식) 지도.
 * 실제 지도 타일 대신 좌표를 정규화해 배치하므로, 카카오 JS 키가 없어도
 * 화면 구조와 기능을 그대로 확인할 수 있다. KakaoMap이 이 컴포넌트를 감싸
 * 키가 있으면 실제 지도로, 없으면 이 컴포넌트로 대체한다.
 */
export function SchematicMap({
  markers = [],
  circles = [],
  polylines = [],
  height = 280,
  children,
}: {
  markers?: MapMarker[];
  circles?: MapCircle[];
  polylines?: MapPolyline[];
  height?: number;
  children?: ReactNode;
}) {
  const allPoints = [
    ...markers.map((m) => m.position),
    ...circles.map((c) => c.center),
    ...polylines.flatMap((p) => p.path),
  ];

  if (allPoints.length === 0) {
    return (
      <div
        style={{ height }}
        className="grid place-items-center rounded-2xl border border-line bg-[#E9EEF6] text-[13px] font-medium text-muted"
      >
        표시할 위치 정보가 없습니다
      </div>
    );
  }

  const bounds = boundsOf(allPoints);
  const toVb = (p: LatLng) => {
    const { xPct, yPct } = projectToPercent(p, bounds);
    return { x: (xPct / 100) * VB_W, y: (yPct / 100) * VB_H };
  };
  const radiusToVb = (m: number) =>
    (metersToLat(m) / (bounds.maxLat - bounds.minLat || 1)) * VB_H;

  return (
    <div
      style={{ height }}
      className="relative overflow-hidden rounded-2xl border border-line bg-[#E9EEF6]"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <g stroke="#fff" strokeWidth={14} opacity={0.7}>
          <path d={`M-10 ${VB_H * 0.35} H${VB_W + 10}`} />
          <path d={`M-10 ${VB_H * 0.7} H${VB_W + 10}`} />
          <path d={`M${VB_W * 0.28} -10 V${VB_H + 10}`} />
          <path d={`M${VB_W * 0.68} -10 V${VB_H + 10}`} />
        </g>

        {circles.map((c, i) => {
          const { x, y } = toVb(c.center);
          const r = radiusToVb(c.radiusM);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={c.color}
              fillOpacity={c.fillOpacity ?? 0.2}
            />
          );
        })}

        {polylines.map((line, i) => {
          const d = line.path
            .map((p, idx) => {
              const { x, y } = toVb(p);
              return `${idx === 0 ? "M" : "L"}${x} ${y}`;
            })
            .join(" ");
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={line.color}
              strokeWidth={line.width ?? 5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={line.dashed ? "8 8" : undefined}
            />
          );
        })}
      </svg>

      {markers.map((m) => {
        const { xPct, yPct } = projectToPercent(m.position, bounds);
        const isSmall = m.variant === "small";
        const isWarn = m.variant === "warn";
        return (
          <button
            key={m.id}
            onClick={m.onClick}
            disabled={!m.onClick}
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            {!isSmall && (
              <span
                className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-40"
                style={{
                  width: 30,
                  height: 30,
                  background: isWarn ? "#D9534F" : "#F2A93B",
                }}
              />
            )}
            <span
              className="block rounded-full border-[3px] border-white shadow-md"
              style={{
                width: isSmall ? 16 : 24,
                height: isSmall ? 16 : 24,
                background: isWarn ? "#D9534F" : isSmall ? "#2B4B8C" : "#D98A1B",
              }}
            />
            {m.label && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-lg bg-navy px-2 py-1 text-[10.5px] font-extrabold text-white">
                {m.label}
              </span>
            )}
          </button>
        );
      })}

      {children}
    </div>
  );
}
