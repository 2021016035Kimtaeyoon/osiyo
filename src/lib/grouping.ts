const dayKeyFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function seoulDayKey(iso: string): string {
  return dayKeyFmt.format(new Date(iso));
}

export function isSameSeoulDay(isoA: string, isoB: string): boolean {
  return seoulDayKey(isoA) === seoulDayKey(isoB);
}
