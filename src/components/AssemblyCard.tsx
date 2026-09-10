import Link from "next/link";
import type { Assembly } from "@/types";
import { formatHeadcount, formatTimeRange } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export function AssemblyCard({ assembly }: { assembly: Assembly }) {
  const hasRestriction = assembly.restrictedZones.length > 0;
  return (
    <Link
      href={`/assembly/${assembly.id}`}
      className="block rounded-card border border-line bg-surface p-4 shadow-sm shadow-navy/5 transition active:scale-[0.985]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-navy leading-snug">
          {assembly.title}
        </h3>
        <StatusBadge status={assembly.status} startAt={assembly.startAt} />
      </div>
      <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-muted">
        {assembly.location.name} · {formatTimeRange(assembly.startAt, assembly.endAt)}
        <br />
        신고 인원 {formatHeadcount(assembly.reportedHeadcount)}
        {assembly.organizer && ` · 주최 ${assembly.organizer}`}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {assembly.topics.map((t) => (
          <span
            key={t}
            className="rounded-[7px] bg-[#EDF1F9] px-2 py-1 text-[10.5px] font-bold text-navy-2"
          >
            {t}
          </span>
        ))}
        {assembly.marchRoute && (
          <span className="rounded-[7px] bg-[#EDF1F9] px-2 py-1 text-[10.5px] font-bold text-navy-2">
            행진 있음
          </span>
        )}
        {hasRestriction && (
          <span className="rounded-[7px] bg-amber-bg px-2 py-1 text-[10.5px] font-bold text-amber-dark">
            진입 금지 {assembly.restrictedZones.length}곳
          </span>
        )}
      </div>
    </Link>
  );
}
