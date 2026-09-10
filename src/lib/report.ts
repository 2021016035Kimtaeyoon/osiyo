/**
 * 행진 제보 집계. 위치·시각·기기 정보를 저장하지 않고 건수만 늘린다.
 * TODO(6단계): SQLite(Prisma)로 교체해도 저장 대상은 건수 하나뿐이어야 한다.
 */
const increments = new Map<string, number>();

export function getReportCount(assemblyId: string, baseCount: number): number {
  return baseCount + (increments.get(assemblyId) ?? 0);
}

export function incrementReport(assemblyId: string, baseCount: number): number {
  const next = (increments.get(assemblyId) ?? 0) + 1;
  increments.set(assemblyId, next);
  return baseCount + next;
}
