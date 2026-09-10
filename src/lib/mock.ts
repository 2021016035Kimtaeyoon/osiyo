import type { Assembly, Congestion, ConflictAlert } from "@/types";
import assembliesRaw from "../../data/assemblies.sample.json";
import { deriveStatus, hoursFromNow, minutesFromNow } from "@/lib/demoTime";

const template = assembliesRaw as Assembly[];

/** id별 진행 구간(시작/종료, 시작 시각으로부터 몇 시간 뒤 해산인지) — now 기준 상대값 */
const TIME_PROFILE_HOURS: Record<string, { startH: number; endH: number }> = {
  "gwanghwamun-climate": { startH: -2, endH: 2 },
  "yeouido-labor": { startH: 2, endH: 5 },
  "cityhall-rally-a": { startH: -3, endH: 1 },
  "cityhall-rally-b": { startH: -3, endH: 1 },
  "assembly-jeonse": { startH: 48, endH: 51 },
};

/** 행진 지점별 예정 통과 시각 — now 기준 분 단위 오프셋. 인덱스 2(종로3가)가 "방금 지남". */
const CLIMATE_WAYPOINT_OFFSET_MIN = [-122, -52, -3, 38, 88];

function hydrate(now: Date): Assembly[] {
  return template.map((a) => {
    const profile = TIME_PROFILE_HOURS[a.id];
    if (!profile) return a;

    const startAt = hoursFromNow(now, profile.startH);
    const endAt = hoursFromNow(now, profile.endH);
    const status = deriveStatus(startAt, endAt, now);

    const marchRoute =
      a.id === "gwanghwamun-climate" && a.marchRoute
        ? {
            ...a.marchRoute,
            waypoints: a.marchRoute.waypoints.map((w, i) => {
              const offset = CLIMATE_WAYPOINT_OFFSET_MIN[i] ?? 0;
              const scheduledAt = minutesFromNow(now, offset);
              return {
                ...w,
                scheduledAt,
                actualPassedAt: offset <= -3 ? scheduledAt : undefined,
              };
            }),
            lastReportAt: minutesFromNow(now, -6),
          }
        : a.marchRoute;

    return {
      ...a,
      startAt,
      endAt,
      status,
      marchRoute,
      source: { ...a.source, fetchedAt: minutesFromNow(now, -40) },
    };
  });
}

/** 전체 집회 목록 (오늘 + 예정). 시간 필드는 항상 현재 시각 기준으로 새로 계산된다. */
export function getAssemblies(now: Date = new Date()): Assembly[] {
  return hydrate(now);
}

export function getAssemblyById(id: string, now: Date = new Date()): Assembly | undefined {
  return getAssemblies(now).find((a) => a.id === id);
}

export function getAssembliesByTopic(topic: string, now: Date = new Date()): Assembly[] {
  const all = getAssemblies(now);
  if (topic === "전체") return all;
  return all.filter((a) => a.topics.some((t) => t === topic));
}

export function searchAssemblies(keyword: string, now: Date = new Date()): Assembly[] {
  const q = keyword.trim();
  if (!q) return [];
  return getAssemblies(now).filter(
    (a) =>
      a.title.includes(q) ||
      a.topics.some((t) => t.includes(q)) ||
      a.location.name.includes(q)
  );
}

/** 서울광장 두 신고(cityhall-rally-a/b)를 구역 단위 맞불 경보로 묶어 반환한다. */
export function getConflictAlerts(now: Date = new Date()): ConflictAlert[] {
  const a = getAssemblyById("cityhall-rally-a", now);
  const b = getAssemblyById("cityhall-rally-b", now);
  if (!a || !b) return [];

  return [
    {
      zoneName: "서울광장 일대",
      assemblyIds: [a.id, b.id],
      overlapDescription: `${a.title} (${a.reportedHeadcount.toLocaleString("ko-KR")}명)와 ${b.title} (${b.reportedHeadcount.toLocaleString("ko-KR")}명)가 같은 시간대에 겹칩니다.`,
      expandedControlArea: "서울광장 → 태평로 전 구간",
      expectedDelayMinutes: 60,
      recommendation: "을지로 방면 우회",
      source: { provider: "서울경찰청", fetchedAt: minutesFromNow(now, -40) },
    },
  ];
}

/** 서울 열린데이터광장 실시간 도시데이터 목업 */
export function getCongestion(
  areaName = "광화문·덕수궁",
  now: Date = new Date()
): Congestion {
  return {
    areaCode: "POI001",
    areaName,
    level: "매우혼잡",
    score: 82,
    updatedAt: minutesFromNow(now, -4),
    source: {
      provider: "서울시 실시간 도시데이터",
      fetchedAt: minutesFromNow(now, -4),
    },
  };
}
