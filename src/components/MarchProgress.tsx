import type { MarchWaypoint } from "@/types";
import type { HeadPositionEstimate } from "@/lib/march";
import { formatTime } from "@/lib/format";

function timePercents(waypoints: MarchWaypoint[]): number[] {
  const times = waypoints.map((w) => new Date(w.scheduledAt).getTime());
  const min = times[0];
  const max = times[times.length - 1];
  const span = max - min || 1;
  return times.map((t) => ((t - min) / span) * 100);
}

export function MarchProgress({
  waypoints,
  estimate,
}: {
  waypoints: MarchWaypoint[];
  estimate: HeadPositionEstimate;
}) {
  const percents = timePercents(waypoints);
  const fromIdx = waypoints.findIndex((w) => w.name === estimate.fromWaypoint);
  const toIdx = waypoints.findIndex((w) => w.name === estimate.toWaypoint);

  const fillPct =
    toIdx === -1
      ? percents[fromIdx]
      : percents[fromIdx] +
        (percents[toIdx] - percents[fromIdx]) * estimate.progress;

  return (
    <div className="pb-0.5 pt-1.5">
      <div className="relative my-6.5 h-1 rounded-full bg-[#E7ECF5]">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-amber"
          style={{ width: `${fillPct}%` }}
        />
        {waypoints.map((w, i) => {
          const isNow = i === fromIdx;
          const isDone = i < fromIdx || (i === fromIdx && toIdx === -1);
          return (
            <span
              key={w.name}
              style={{ left: `${percents[i]}%` }}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                isNow
                  ? "size-5.5 border-4 border-white bg-amber-dark shadow-[0_0_0_3px_rgba(242,169,59,0.4)]"
                  : isDone
                    ? "size-3.5 bg-amber"
                    : "size-3.5 bg-[#D3DBE9]"
              }`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10.5px] font-bold text-muted">
        {waypoints.map((w, i) => (
          <span
            key={w.name}
            className={i === 0 ? "text-left" : i === waypoints.length - 1 ? "text-right" : "text-center"}
          >
            <b
              className={`block text-[11.5px] ${i === fromIdx ? "text-amber-dark" : "text-navy"}`}
            >
              {w.name}
            </b>
            {i === fromIdx ? "현재" : formatTime(w.scheduledAt)}
          </span>
        ))}
      </div>
    </div>
  );
}
