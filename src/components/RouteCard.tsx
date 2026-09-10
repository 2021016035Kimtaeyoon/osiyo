import type { RouteOption } from "@/types";

export function RouteCard({
  route,
  selected,
  onSelect,
}: {
  route: RouteOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const bad = route.throughRestrictedZone;
  return (
    <button
      onClick={onSelect}
      className={`block w-full rounded-2xl border-2 p-4 text-left transition active:scale-[0.985] ${
        bad
          ? "border-[#EBAFAD] bg-warn-bg"
          : selected
            ? "border-amber bg-[#FFFDF8]"
            : "border-line bg-white"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2.5">
        <span
          className={`text-[14.5px] font-extrabold tracking-tight ${bad ? "text-warn" : "text-navy"}`}
        >
          {bad ? "✕" : "✓"} {route.label}
        </span>
        <span
          className={`text-[21px] font-black tracking-tight ${bad ? "text-warn" : "text-navy"}`}
        >
          {route.baselineDurationMin != null && (
            <s className="mr-1.5 text-[13px] font-bold text-muted">
              {route.baselineDurationMin}분
            </s>
          )}
          {route.durationMin}분
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] font-semibold leading-relaxed text-muted">
        {route.distanceKm}km
        {bad && (
          <>
            <br />
            <b className="text-warn">
              {route.steps.find((s) => s.throughRestrictedZone)?.instruction}
            </b>
          </>
        )}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {bad ? (
          <>
            <span className="rounded-[7px] bg-amber-bg px-2 py-1 text-[10.5px] font-bold text-amber-dark">
              통제 구간 포함
            </span>
            <span className="rounded-[7px] bg-amber-bg px-2 py-1 text-[10.5px] font-bold text-amber-dark">
              지연 {route.durationMin - (route.baselineDurationMin ?? route.durationMin)}분
            </span>
          </>
        ) : (
          <span className="rounded-[7px] bg-[#EDF1F9] px-2 py-1 text-[10.5px] font-bold text-navy-2">
            통제 구간 없음
          </span>
        )}
      </div>
    </button>
  );
}
