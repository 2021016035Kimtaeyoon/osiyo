"use client";

import { useEffect, useRef, useState } from "react";
import type { LatLng } from "@/types";
import {
  SchematicMap,
  type MapCircle,
  type MapMarker,
  type MapPolyline,
} from "@/components/SchematicMap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KakaoNS = any;
declare global {
  interface Window {
    kakao?: KakaoNS;
  }
}

let sdkPromise: Promise<KakaoNS> | null = null;

function loadKakaoSdk(appKey: string): Promise<KakaoNS> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao!.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => reject(new Error("카카오맵 SDK 로드 실패"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

type LoadState = "loading" | "ready" | "error" | "no-key";

/**
 * 카카오맵 래퍼. NEXT_PUBLIC_KAKAO_JS_KEY가 설정돼 있으면 실제 지도를,
 * 없거나 로드에 실패하면 SchematicMap(도식 지도)으로 대체한다.
 */
export function KakaoMap({
  center,
  markers = [],
  circles = [],
  polylines = [],
  height = 280,
  level = 4,
}: {
  center: LatLng;
  markers?: MapMarker[];
  circles?: MapCircle[];
  polylines?: MapPolyline[];
  height?: number;
  level?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  const [state, setState] = useState<LoadState>(() =>
    appKey ? "loading" : "no-key"
  );

  useEffect(() => {
    if (!appKey) return;
    let cancelled = false;

    loadKakaoSdk(appKey)
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level,
        });

        for (const c of circles) {
          new kakao.maps.Circle({
            map,
            center: new kakao.maps.LatLng(c.center.lat, c.center.lng),
            radius: c.radiusM,
            strokeWeight: 1,
            strokeColor: c.color,
            strokeOpacity: 0.6,
            fillColor: c.color,
            fillOpacity: c.fillOpacity ?? 0.2,
          });
        }

        for (const line of polylines) {
          new kakao.maps.Polyline({
            map,
            path: line.path.map(
              (p: LatLng) => new kakao.maps.LatLng(p.lat, p.lng)
            ),
            strokeWeight: line.width ?? 5,
            strokeColor: line.color,
            strokeStyle: line.dashed ? "shortdash" : "solid",
          });
        }

        for (const m of markers) {
          const marker = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(m.position.lat, m.position.lng),
          });
          if (m.onClick) {
            kakao.maps.event.addListener(marker, "click", m.onClick);
          }
        }

        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [appKey, center.lat, center.lng, level, markers, circles, polylines]);

  if (state === "no-key" || state === "error") {
    return (
      <SchematicMap
        markers={markers}
        circles={circles}
        polylines={polylines}
        height={height}
      >
        <span className="absolute right-2.5 top-2.5 rounded-pill bg-navy/85 px-2.5 py-1 text-[10px] font-bold text-white">
          {state === "no-key" ? "지도 키 미설정 · 도식 미리보기" : "지도 로드 실패 · 도식 미리보기"}
        </span>
      </SchematicMap>
    );
  }

  return (
    <div
      style={{ height }}
      className="relative overflow-hidden rounded-2xl border border-line bg-[#E9EEF6]"
    >
      {state === "loading" && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[#E9EEF6] text-[13px] font-medium text-muted">
          지도를 불러오는 중…
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
