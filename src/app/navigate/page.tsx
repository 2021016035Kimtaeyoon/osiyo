import { BackHeader } from "@/components/BackHeader";
import { Notice } from "@/components/Notice";
import { RerouteButton } from "@/components/RerouteButton";
import { getDemoRoute } from "@/lib/demoRoute";
import { getAssemblies } from "@/lib/mock";
import { estimateHeadPosition } from "@/lib/march";
import { etaTimeLabel, formatTime } from "@/lib/format";
import type { RouteStepIcon } from "@/types";

const ICON: Record<RouteStepIcon, string> = {
  straight: "↑",
  left: "↰",
  right: "↱",
  warn: "⚠",
  done: "✓",
  flag: "🏁",
};

const ICON_STYLE: Record<RouteStepIcon, string> = {
  straight: "bg-[#EDF1F9] text-navy-2",
  left: "bg-[#EDF1F9] text-navy-2",
  right: "bg-[#EDF1F9] text-navy-2",
  warn: "bg-warn-bg text-warn",
  done: "bg-ok-bg text-ok",
  flag: "bg-[#EDF1F9] text-navy-2",
};

export default async function NavigatePage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const { comparison, dispersalAt } = getDemoRoute();
  const route =
    kind === "shortest" ? comparison.shortest : comparison.avoidance;

  const currentIdx = Math.min(1, route.steps.length - 1);
  const current = route.steps[currentIdx];
  const remainingM = route.steps
    .slice(currentIdx)
    .reduce((sum, s) => sum + s.distanceM, 0);

  const etaLabel = etaTimeLabel(route.durationMin);
  const marching = getAssemblies().find(
    (a) => a.status === "진행중" && a.marchRoute
  );
  const marchHead = marching?.marchRoute
    ? estimateHeadPosition(marching.marchRoute, new Date())
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="경로 안내 중" />
      <div className="flex-1 space-y-3.5 px-4 pb-10">
        <div className="rounded-2xl bg-navy p-5 text-white">
          <div className="flex items-center gap-4">
            <span className="text-[38px] leading-none text-amber">
              {ICON[current.icon]}
            </span>
            <div>
              <p className="text-[26px] font-black tracking-tight">
                {current.distanceM}m
              </p>
              <p className="mt-0.5 text-[13.5px] font-bold text-[#C3D3EE]">
                {current.instruction}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-[#8FA6CE]/30 pt-3.5 text-[12px] font-bold text-[#A9BEE4]">
            <span>
              남은 거리 <b className="text-[14px] text-white">{(remainingM / 1000).toFixed(1)}km</b>
            </span>
            <span>
              도착 <b className="text-[14px] text-white">{etaLabel}</b>
            </span>
            <span>
              소요 <b className="text-[14px] text-white">{route.durationMin}분</b>
            </span>
          </div>
        </div>

        {route.throughRestrictedZone ? (
          <Notice variant="warn">
            <b>전방 {current.distanceM}m 통제 구간</b>
            <br />이 경로는 통제 구간을 통과합니다. 지연이 예상됩니다.
          </Notice>
        ) : (
          <Notice>
            이 경로는 통제 구간을 자동으로 피해서 안내됩니다.
            {dispersalAt && ` 해산 예정 ${formatTime(dispersalAt)}.`}
          </Notice>
        )}

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-1 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            남은 경로
          </h3>
          <ul>
            {route.steps.map((s, i) => (
              <li
                key={i}
                className={`flex gap-3 py-3 ${i < route.steps.length - 1 ? "border-b border-line" : ""}`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-[9px] text-[14px] ${
                    i < currentIdx ? ICON_STYLE.done : ICON_STYLE[s.icon]
                  }`}
                >
                  {i < currentIdx ? ICON.done : ICON[s.icon]}
                </span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-bold leading-snug text-ink">
                    {s.instruction}
                  </p>
                  {s.detail && (
                    <p className="mt-0.5 text-[11.5px] font-semibold text-muted">
                      {s.detail}
                    </p>
                  )}
                </div>
                <span className="shrink-0 pl-2 text-[12px] font-extrabold text-mist">
                  {i < currentIdx ? "지남" : `${s.distanceM}m`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-1 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            실시간 반영
          </h3>
          <dl className="divide-y divide-line text-[13.5px]">
            {marchHead && (
              <div className="flex justify-between py-1.75">
                <span className="font-semibold text-muted">행진 선두</span>
                <span className="font-bold text-ink">
                  {marchHead.fromWaypoint} · 내 경로와 무관
                </span>
              </div>
            )}
            <div className="flex justify-between py-1.75">
              <span className="font-semibold text-muted">경로 재탐색</span>
              <span className="font-bold text-ink">통제 변경 시 자동</span>
            </div>
            <div className="flex justify-between py-1.75">
              <span className="font-semibold text-muted">해산 시</span>
              <span className="font-bold text-ink">최단 경로로 재안내 알림</span>
            </div>
          </dl>
        </div>

        <RerouteButton />
      </div>
    </div>
  );
}
