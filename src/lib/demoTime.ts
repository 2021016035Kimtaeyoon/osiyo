/**
 * 목업 데이터는 실제 서버 API로 교체되기 전까지 "지금 보고 있어도 살아있는 것처럼"
 * 보여야 데모/심사 어느 시점에 열어도 자연스럽다. 그래서 절대 시각 대신
 * 현재 시각(now) 기준 상대 오프셋으로 모든 시간 필드를 계산한다.
 * 6단계에서 실제 API로 교체되면 이 파일은 제거된다.
 */
import type { AssemblyStatus } from "@/types";

export function minutesFromNow(now: Date, minutes: number): string {
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

export function hoursFromNow(now: Date, hours: number): string {
  return minutesFromNow(now, hours * 60);
}

export function deriveStatus(
  startAtIso: string,
  endAtIso: string,
  now: Date
): AssemblyStatus {
  const t = now.getTime();
  if (t < new Date(startAtIso).getTime()) return "예정";
  if (t > new Date(endAtIso).getTime()) return "종료";
  return "진행중";
}
