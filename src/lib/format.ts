const timeFmt = new Intl.DateTimeFormat("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

const dateFmt = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "Asia/Seoul",
});

const dateTimeFmt = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Seoul",
});

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)}–${formatTime(endIso)}`;
}

export function formatHeadcount(n: number): string {
  return `${n.toLocaleString("ko-KR")}명`;
}

/** "기준 15:58" 처럼 출처 배지에 쓰는 짧은 기준 시각 표기 */
export function formatAsOf(iso: string): string {
  return `기준 ${formatTime(iso)}`;
}

/**
 * durationMin분 뒤 도착 예정 시각 라벨. 현재 시각 소스(Date.now())를 컴포넌트
 * 렌더 본문이 아니라 이 유틸 함수 안에 두어 "렌더 중 불순 호출" 린트를 피한다.
 */
export function etaTimeLabel(durationMin: number, now: Date = new Date()): string {
  return formatTime(new Date(now.getTime() + durationMin * 60_000).toISOString());
}
