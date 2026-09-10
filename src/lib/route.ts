import type { Assembly, LatLng, RouteComparison, RouteOption, RouteStep } from "@/types";
import { distanceMeters, fromLocalMeters, pointToSegment } from "@/lib/geo";

/** 도심 평균 주행 속도 근사치(km/h). 실제 경로 탐색은 카카오 모빌리티 API로 교체 예정. */
const AVG_SPEED_KMH = 22;
/** 통제 구역 경계에서 우회 경유지를 얼마나 더 멀리 띄울지(m) */
const DETOUR_BUFFER_M = 250;

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function durationFromKm(km: number): number {
  return (km / AVG_SPEED_KMH) * 60;
}

function pathDistanceKm(path: LatLng[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    total += distanceMeters(path[i], path[i + 1]);
  }
  return total / 1000;
}

/**
 * 통제 구간을 피한 경로를 계산한다. 자체 내비게이션 엔진이 아니라
 * "경유 금지 구역"을 피하는 경유지 좌표 하나를 계산하는 수준에 그친다 —
 * 실제 턴바이턴 안내는 카카오맵/네이버지도/티맵에 위임한다 (lib/deeplink.ts).
 * TODO(5단계 API 연동): 카카오 모빌리티 길찾기 API로 교체. 경유지 파라미터는 그대로 재사용 가능.
 */
export function buildRouteComparison(
  origin: LatLng,
  destination: LatLng,
  activeAssemblies: Assembly[]
): RouteComparison {
  const directPath = [origin, destination];
  const directKm = pathDistanceKm(directPath);
  const baselineDuration = Math.round(durationFromKm(directKm));

  const zones = activeAssemblies.flatMap((a) =>
    a.restrictedZones.map((z) => ({ ...z, assemblyId: a.id }))
  );

  let blocking:
    | (typeof zones)[number] & { hit: ReturnType<typeof pointToSegment> }
    | null = null;
  for (const z of zones) {
    const hit = pointToSegment(z.center, origin, destination);
    if (hit.distanceM <= z.radiusM) {
      if (!blocking || hit.distanceM < blocking.hit.distanceM) {
        blocking = { ...z, hit };
      }
    }
  }

  const directDistanceM = Math.round(directKm * 1000);

  if (!blocking) {
    const clear: RouteOption = {
      kind: "shortest",
      label: "추천 경로",
      distanceKm: round1(directKm),
      durationMin: baselineDuration,
      throughRestrictedZone: false,
      steps: [
        { instruction: "출발", distanceM: 0, icon: "straight" },
        { instruction: "직진", distanceM: directDistanceM, icon: "straight" },
        { instruction: "목적지 도착", distanceM: 0, icon: "flag" },
      ],
      polyline: directPath,
    };
    return { shortest: clear, avoidance: { ...clear, kind: "avoidance" } };
  }

  const shortestSteps: RouteStep[] = [
    { instruction: "출발", distanceM: 0, icon: "straight" },
    {
      instruction: `${blocking.name} 통제 구간 통과`,
      detail: "집회 통제 시간대에는 이 구간 통행이 제한됩니다",
      distanceM: directDistanceM,
      icon: "warn",
      throughRestrictedZone: true,
    },
    { instruction: "목적지 도착", distanceM: 0, icon: "flag" },
  ];

  const shortest: RouteOption = {
    kind: "shortest",
    label: "최단 경로",
    distanceKm: round1(directKm),
    durationMin: Math.round(baselineDuration * 1.8 + 6),
    baselineDurationMin: baselineDuration,
    throughRestrictedZone: true,
    steps: shortestSteps,
    polyline: directPath,
  };

  // 구역 중심 → 경로상 최단거리 지점 방향으로 (반경 + 여유)만큼 민 좌표를 경유지로 삼는다.
  const away = blocking.hit.awayFromP;
  const mag = Math.hypot(away.x, away.y) || 1;
  const pushM = blocking.radiusM + DETOUR_BUFFER_M;
  const waypoint = fromLocalMeters(
    { x: (away.x / mag) * pushM, y: (away.y / mag) * pushM },
    blocking.center
  );

  const avoidancePath = [origin, waypoint, destination];
  const avoidanceKm = pathDistanceKm(avoidancePath);
  const avoidanceDuration = Math.round(durationFromKm(avoidanceKm) + 7);

  const avoidance: RouteOption = {
    kind: "avoidance",
    label: "통제 회피 경로",
    distanceKm: round1(avoidanceKm),
    durationMin: avoidanceDuration,
    throughRestrictedZone: false,
    steps: [
      { instruction: "출발", distanceM: 0, icon: "straight" },
      {
        instruction: "우회 경유지 방면 진행",
        detail: `${blocking.name} 통제 구간을 지나지 않습니다`,
        distanceM: Math.round(distanceMeters(origin, waypoint)),
        icon: "left",
      },
      {
        instruction: "목적지 방면 진행",
        distanceM: Math.round(distanceMeters(waypoint, destination)),
        icon: "right",
      },
      { instruction: "목적지 도착", distanceM: 0, icon: "flag" },
    ],
    polyline: avoidancePath,
  };

  return { shortest, avoidance };
}
