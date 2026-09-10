import type { Congestion } from "@/types";
import { SourceTag } from "@/components/SourceTag";

const LEVEL_COLOR: Record<Congestion["level"], string> = {
  원활: "text-ok",
  보통: "text-navy-2",
  혼잡: "text-amber-dark",
  매우혼잡: "text-warn",
};

export function CongestionBar({ congestion }: { congestion: Congestion }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px] font-extrabold">
        <span className="text-muted">현재 혼잡도 · {congestion.areaName}</span>
        <span className={LEVEL_COLOR[congestion.level]}>{congestion.level}</span>
      </div>
      <div className="my-1.5 h-2.25 overflow-hidden rounded-full bg-[#E7ECF5]">
        <div
          className="h-full rounded-full bg-amber-dark"
          style={{ width: `${congestion.score}%` }}
        />
      </div>
      <SourceTag source={congestion.source} />
    </div>
  );
}
