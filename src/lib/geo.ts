import type { LatLng } from "@/types";

/** 위도 1도 ≈ 111km. 서울 위도(37.5°N)에서 경도 1도 ≈ 88km. 스키매틱 지도용 근사치. */
const METERS_PER_DEG_LAT = 111_320;
const METERS_PER_DEG_LNG = 88_800;

export function metersToLat(m: number): number {
  return m / METERS_PER_DEG_LAT;
}

export function metersToLng(m: number): number {
  return m / METERS_PER_DEG_LNG;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function boundsOf(points: LatLng[], paddingRatio = 0.25): Bounds {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPad = Math.max((maxLat - minLat) * paddingRatio, 0.003);
  const lngPad = Math.max((maxLng - minLng) * paddingRatio, 0.003);
  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

/** 위경도를 0-100 사이의 퍼센트 좌표로 투영한다 (스키매틱 지도의 CSS left/top용). */
export function projectToPercent(point: LatLng, bounds: Bounds) {
  const x =
    ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 100;
  // 위도는 위로 갈수록 커지므로 y축은 뒤집는다
  const y =
    (1 - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) *
    100;
  return { xPct: x, yPct: y };
}

const R = 6_371_000;
function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** 두 좌표 사이 거리(m), 하버사인 공식 */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** a→b 선분을 t(0-1) 비율로 내분한 좌표 */
export function lerpLatLng(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

export interface XY {
  x: number;
  y: number;
}

/** origin을 원점으로 하는 평면(m) 좌표로 근사 변환. 짧은 거리(도심 스케일)에서만 유효하다. */
export function toLocalMeters(p: LatLng, origin: LatLng): XY {
  return {
    x: (p.lng - origin.lng) * METERS_PER_DEG_LNG,
    y: (p.lat - origin.lat) * METERS_PER_DEG_LAT,
  };
}

export function fromLocalMeters(xy: XY, origin: LatLng): LatLng {
  return {
    lat: origin.lat + xy.y / METERS_PER_DEG_LAT,
    lng: origin.lng + xy.x / METERS_PER_DEG_LNG,
  };
}

/** 점 p에서 선분 ab까지의 최단 거리(m)와 그 지점 정보 */
export function pointToSegment(p: LatLng, a: LatLng, b: LatLng) {
  const A = toLocalMeters(a, a);
  const B = toLocalMeters(b, a);
  const P = toLocalMeters(p, a);

  const abx = B.x - A.x;
  const aby = B.y - A.y;
  const lenSq = abx * abx + aby * aby;
  const t = lenSq === 0 ? 0 : ((P.x - A.x) * abx + (P.y - A.y) * aby) / lenSq;
  const tc = Math.min(1, Math.max(0, t));
  const closest: XY = { x: A.x + abx * tc, y: A.y + aby * tc };
  const dx = closest.x - P.x;
  const dy = closest.y - P.y;

  return {
    distanceM: Math.sqrt(dx * dx + dy * dy),
    t: tc,
    closestPoint: fromLocalMeters(closest, a),
    /** p(예: 구역 중심) → 선분 위 최단거리 지점 방향의 벡터. 구역을 벗어나는 방향이다. */
    awayFromP: { x: dx, y: dy },
  };
}
