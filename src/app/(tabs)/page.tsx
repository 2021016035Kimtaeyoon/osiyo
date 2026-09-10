import Link from "next/link";
import { getAssemblies, getConflictAlerts } from "@/lib/mock";
import { HomeFeed } from "@/components/HomeFeed";
import { formatHeadcount, formatTime } from "@/lib/format";

export default function HomePage() {
  const assemblies = getAssemblies();
  const conflictAlerts = getConflictAlerts();
  const now = new Date().toISOString();

  const marching = assemblies.find(
    (a) => a.status === "진행중" && a.marchRoute
  );
  const currentWaypoint = marching?.marchRoute?.waypoints
    .filter((w) => w.actualPassedAt)
    .at(-1);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pb-3.5 pt-4">
        <p className="text-[23px] font-black tracking-tighter text-navy">
          오시<span className="text-amber">요</span>
        </p>
        <button
          aria-label="알림"
          className="grid size-9 place-items-center rounded-xl bg-white text-[16px] shadow-sm shadow-navy/10"
        >
          🔔
        </button>
      </div>

      <Link
        href="/search"
        className="mx-4 mb-3.5 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-3 shadow-sm shadow-navy/5"
      >
        <span className="text-mist">🔍</span>
        <span className="text-[14px] font-medium text-muted">
          관심 주제로 집회 검색
        </span>
      </Link>

      {marching && currentWaypoint && (
        <Link
          href={`/march/${marching.id}`}
          className="mx-4 mb-3.5 block rounded-2xl bg-navy p-4.5 text-white"
        >
          <p className="text-[10.5px] font-extrabold tracking-[0.16em] text-amber">
            지금 진행 중
          </p>
          <p className="mt-2 text-[17px] font-extrabold leading-snug tracking-tight">
            {marching.location.name.split(" ")[0]} 일대 집회가
            <br />
            {currentWaypoint.name}로 이동 중입니다
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#A9BEE4]">
            해산 예정 {formatTime(marching.endAt)} · 현재 참여{" "}
            {formatHeadcount(marching.attendingCount)} · 익명 제보{" "}
            {marching.marchRoute?.reportCount ?? 0}건
          </p>
        </Link>
      )}

      <HomeFeed assemblies={assemblies} conflictAlerts={conflictAlerts} now={now} />
    </div>
  );
}
