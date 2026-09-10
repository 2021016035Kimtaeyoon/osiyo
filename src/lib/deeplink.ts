import type { LatLng } from "@/types";

export interface RoutePoint extends LatLng {
  name: string;
}

export interface ExternalRouteLinks {
  appUrl: string;
  webUrl: string;
}

/**
 * 지도 앱 딥링크 생성. 오시요는 자체 내비게이션을 만들지 않고,
 * 통제 구간을 뺀 경유지를 계산해 외부 지도 앱에 그대로 넘긴다.
 * 각 서비스의 딥링크 파라미터는 앱 버전에 따라 바뀔 수 있으니
 * 배포 전 최신 문서로 재확인한다.
 */
export function buildKakaoMapLink(
  origin: RoutePoint,
  destination: RoutePoint,
  via?: RoutePoint
): ExternalRouteLinks {
  const params = new URLSearchParams({
    sp: `${origin.lat},${origin.lng}`,
    ep: `${destination.lat},${destination.lng}`,
    by: "CAR",
  });
  if (via) params.set("rp1", `${via.lat},${via.lng}`);

  return {
    appUrl: `kakaomap://route?${params.toString()}`,
    webUrl: `https://map.kakao.com/link/to/${encodeURIComponent(destination.name)},${destination.lat},${destination.lng}`,
  };
}

export function buildNaverMapLink(
  origin: RoutePoint,
  destination: RoutePoint,
  via?: RoutePoint
): ExternalRouteLinks {
  const params = new URLSearchParams({
    slat: String(origin.lat),
    slng: String(origin.lng),
    sname: origin.name,
    dlat: String(destination.lat),
    dlng: String(destination.lng),
    dname: destination.name,
    appname: "osiyo",
  });
  if (via) {
    params.set("v1lat", String(via.lat));
    params.set("v1lng", String(via.lng));
    params.set("v1name", "우회 경유지");
  }

  return {
    appUrl: `nmap://route/car?${params.toString()}`,
    webUrl: `https://map.naver.com/p/directions/${origin.lng},${origin.lat},${encodeURIComponent(origin.name)}/${destination.lng},${destination.lat},${encodeURIComponent(destination.name)}/-/car`,
  };
}

export function buildTmapLink(
  origin: RoutePoint,
  destination: RoutePoint
): ExternalRouteLinks {
  const params = new URLSearchParams({
    goalx: String(destination.lng),
    goaly: String(destination.lat),
    goalname: destination.name,
    startx: String(origin.lng),
    starty: String(origin.lat),
    startname: origin.name,
  });

  // 티맵은 공식 웹 경로 안내 페이지가 없어, 앱이 없으면 스토어로 보낸다.
  return {
    appUrl: `tmap://route?${params.toString()}`,
    webUrl: "https://www.tmap.co.kr/",
  };
}

/**
 * 앱 스킴을 먼저 시도하고, 짧은 시간 안에 화면 전환(앱 실행)이 없으면
 * 웹 페이지로 대체 이동한다 — 흔히 쓰이는 "딥링크 폴백" 기법.
 */
export function openWithFallback(links: ExternalRouteLinks, timeoutMs = 1200) {
  if (typeof window === "undefined") return;

  let fellBack = false;
  const fallback = () => {
    if (fellBack || document.hidden) return;
    fellBack = true;
    window.open(links.webUrl, "_blank", "noopener,noreferrer");
  };

  const timer = window.setTimeout(fallback, timeoutMs);
  const onVisibilityChange = () => {
    if (document.hidden) {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.location.href = links.appUrl;
}
