import Link from "next/link";
import type { ConflictAlert } from "@/types";
import { getAssemblyById } from "@/lib/mock";
import { formatTimeRange } from "@/lib/format";

export function ConflictCard({ alert }: { alert: ConflictAlert }) {
  const assemblies = alert.assemblyIds
    .map((id) => getAssemblyById(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const first = assemblies[0];
  if (!first) return null;

  const totalHeadcount = assemblies.reduce(
    (sum, a) => sum + a.reportedHeadcount,
    0
  );

  return (
    <Link
      href={`/conflict/${encodeURIComponent(alert.zoneName)}`}
      className="block rounded-card border border-line bg-surface p-4 shadow-sm shadow-navy/5 transition active:scale-[0.985]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-navy leading-snug">
          {first.location.name.split(" ")[0]} 앞 맞불 집회 {assemblies.length}건
        </h3>
        <span className="shrink-0 rounded-pill bg-warn-bg px-2.5 py-1 text-[11px] font-extrabold text-warn">
          겹침
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-muted">
        {alert.zoneName} · {formatTimeRange(first.startAt, first.endAt)}
        <br />
        신고 {assemblies.length}건 겹침 · 총 {totalHeadcount.toLocaleString("ko-KR")}명 ·
        통제 범위 확대 예상
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-[7px] bg-amber-bg px-2 py-1 text-[10.5px] font-bold text-amber-dark">
          맞불 경보
        </span>
        <span className="rounded-[7px] bg-[#EDF1F9] px-2 py-1 text-[10.5px] font-bold text-navy-2">
          교통 통제
        </span>
      </div>
    </Link>
  );
}
