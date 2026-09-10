"use client";

import {
  buildKakaoMapLink,
  buildNaverMapLink,
  buildTmapLink,
  openWithFallback,
  type RoutePoint,
} from "@/lib/deeplink";

export function DeepLinkButtons({
  origin,
  destination,
  via,
}: {
  origin: RoutePoint;
  destination: RoutePoint;
  via?: RoutePoint;
}) {
  const apps = [
    { key: "naver", emoji: "🟩", label: "네이버지도", build: buildNaverMapLink },
    { key: "kakao", emoji: "🟨", label: "카카오맵", build: buildKakaoMapLink },
    { key: "tmap", emoji: "🟦", label: "티맵", build: buildTmapLink },
  ] as const;

  return (
    <div className="flex gap-2">
      {apps.map((app) => (
        <button
          key={app.key}
          onClick={() =>
            openWithFallback(
              app.key === "tmap"
                ? buildTmapLink(origin, destination)
                : app.build(origin, destination, via)
            )
          }
          className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-line bg-white py-3.5 text-[12px] font-extrabold text-navy active:bg-[#F3F6FC]"
        >
          <span className="text-[17px]">{app.emoji}</span>
          {app.label}
        </button>
      ))}
    </div>
  );
}
