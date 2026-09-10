import { getAssemblies } from "@/lib/mock";
import { buildRouteComparison } from "@/lib/route";
import { pointToSegment } from "@/lib/geo";
import type { RoutePoint } from "@/lib/deeplink";
import type { RestrictedZone } from "@/types";

// 데모 구간: 서대문역 → 시청역 3번 출구 (실제 검색/현재위치 연동은 이후 단계에서)
export const DEMO_ORIGIN: RoutePoint = {
  name: "서대문역",
  lat: 37.5658,
  lng: 126.9668,
};
export const DEMO_DESTINATION: RoutePoint = {
  name: "시청역 3번 출구",
  lat: 37.5651,
  lng: 126.9779,
};

export function getDemoRoute() {
  const liveAssemblies = getAssemblies().filter((a) => a.status === "진행중");
  const comparison = buildRouteComparison(
    DEMO_ORIGIN,
    DEMO_DESTINATION,
    liveAssemblies
  );

  const zones = liveAssemblies.flatMap((a) =>
    a.restrictedZones.map((z) => ({ ...z, assemblyId: a.id }))
  );
  const blocking: (RestrictedZone & { assemblyId: string }) | undefined = zones
    .map((z) => ({ z, hit: pointToSegment(z.center, DEMO_ORIGIN, DEMO_DESTINATION) }))
    .filter(({ z, hit }) => hit.distanceM <= z.radiusM)
    .sort((a, b) => a.hit.distanceM - b.hit.distanceM)[0]?.z;

  const blockingAssembly = blocking
    ? liveAssemblies.find((a) => a.id === blocking.assemblyId)
    : undefined;

  return {
    origin: DEMO_ORIGIN,
    destination: DEMO_DESTINATION,
    comparison,
    blockingZone: blocking,
    dispersalAt: blockingAssembly?.endAt,
  };
}
