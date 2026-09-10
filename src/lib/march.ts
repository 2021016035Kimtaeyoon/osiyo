import type { LatLng, MarchRoute, MarchWaypoint } from "@/types";
import { lerpLatLng } from "@/lib/geo";

export interface HeadPositionEstimate {
  position: LatLng;
  /** 이 구간 추정이 익명 제보(실제 통과 확인)에 기반했는지, 신고 시간표뿐인지 */
  basis: "reported" | "scheduled";
  fromWaypoint: string;
  toWaypoint: string | null;
  /** from → to 구간 내 진행률 0~1 */
  progress: number;
}

function effectiveTime(w: MarchWaypoint): number {
  return new Date(w.actualPassedAt ?? w.scheduledAt).getTime();
}

/**
 * 행진 선두의 현재 위치를 추정한다.
 * 익명 제보로 실제 통과가 확인된 지점(actualPassedAt)이 있으면 그 시각을 기준으로,
 * 없으면 신고서의 예정 시간표(scheduledAt)만으로 구간을 선형 보간한다.
 * 제보가 0건이어도(모든 actualPassedAt이 없어도) 항상 위치를 반환한다.
 */
export function estimateHeadPosition(
  route: MarchRoute,
  now: Date = new Date()
): HeadPositionEstimate {
  const waypoints = route.waypoints;
  if (waypoints.length === 0) {
    throw new Error("estimateHeadPosition: waypoints가 비어 있습니다");
  }
  if (waypoints.length === 1) {
    const only = waypoints[0];
    return {
      position: only.location,
      basis: only.actualPassedAt ? "reported" : "scheduled",
      fromWaypoint: only.name,
      toWaypoint: null,
      progress: 0,
    };
  }

  const nowMs = now.getTime();
  const times = waypoints.map(effectiveTime);

  // now가 첫 지점보다 이르면 출발 전 → 첫 지점에 고정
  if (nowMs <= times[0]) {
    return {
      position: waypoints[0].location,
      basis: waypoints[0].actualPassedAt ? "reported" : "scheduled",
      fromWaypoint: waypoints[0].name,
      toWaypoint: waypoints[1]?.name ?? null,
      progress: 0,
    };
  }

  const lastIdx = waypoints.length - 1;
  // now가 마지막 지점보다 늦으면 종착지에 고정
  if (nowMs >= times[lastIdx]) {
    return {
      position: waypoints[lastIdx].location,
      basis: waypoints[lastIdx].actualPassedAt ? "reported" : "scheduled",
      fromWaypoint: waypoints[lastIdx].name,
      toWaypoint: null,
      progress: 0,
    };
  }

  // now를 포함하는 구간 [idx, idx+1] 탐색
  let idx = 0;
  for (let i = 0; i < lastIdx; i++) {
    if (times[i] <= nowMs && nowMs <= times[i + 1]) {
      idx = i;
      break;
    }
  }

  const from = waypoints[idx];
  const to = waypoints[idx + 1];
  const span = times[idx + 1] - times[idx];
  const progress = span <= 0 ? 1 : (nowMs - times[idx]) / span;

  return {
    position: lerpLatLng(from.location, to.location, Math.min(1, Math.max(0, progress))),
    basis: from.actualPassedAt ? "reported" : "scheduled",
    fromWaypoint: from.name,
    toWaypoint: to.name,
    progress: Math.min(1, Math.max(0, progress)),
  };
}
