/**
 * 참여 예정 집계. 익명 카운터만 메모리에 보관한다 — 누가 눌렀는지는 절대 기록하지 않는다.
 * TODO(6단계): SQLite(Prisma)로 교체. 그때도 저장 대상은 숫자 하나뿐이어야 한다.
 */
const increments = new Map<string, number>();

export function getAttendingCount(assemblyId: string, baseCount: number): number {
  return baseCount + (increments.get(assemblyId) ?? 0);
}

export function incrementAttending(assemblyId: string, baseCount: number): number {
  const next = (increments.get(assemblyId) ?? 0) + 1;
  increments.set(assemblyId, next);
  return baseCount + next;
}
