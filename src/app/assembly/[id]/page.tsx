import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssemblyById } from "@/lib/mock";
import { BackHeader } from "@/components/BackHeader";
import { SourceTag } from "@/components/SourceTag";
import { Notice } from "@/components/Notice";
import { AttendButton } from "@/components/AttendButton";
import {
  formatDate,
  formatHeadcount,
  formatTime,
} from "@/lib/format";

export default async function AssemblyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assembly = getAssemblyById(id);
  if (!assembly) notFound();

  const restrictionCount = assembly.restrictedZones.length;

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title={assembly.title} />
      <div className="flex-1 space-y-4 px-4 pb-10">
        <div className="rounded-2xl border-2 border-amber bg-white p-4.5">
          <h2 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            언제 · 어디서
          </h2>
          <dl className="divide-y divide-line text-[13.5px]">
            <Row k="날짜" v={formatDate(assembly.startAt)} />
            <Row k="집결 시간" v={formatTime(assembly.startAt)} />
            <Row k="집결 장소" v={assembly.location.name} />
            <Row k="해산 예정" v={formatTime(assembly.endAt)} />
            <Row k="신고 인원" v={formatHeadcount(assembly.reportedHeadcount)} />
            <Row k="주최" v={assembly.organizer} />
            {assembly.marchRoute && (
              <Row
                k="행진 경로"
                v={assembly.marchRoute.waypoints.map((w) => w.name).join(" → ")}
                small
              />
            )}
          </dl>
          <div className="mt-3">
            <SourceTag source={assembly.source} />
          </div>
        </div>

        {(restrictionCount > 0 || assembly.noiseLimitDb) && (
          <Notice>
            이 집회에는{" "}
            {restrictionCount > 0 && (
              <b>진입 금지 구역 {restrictionCount}곳</b>
            )}
            {restrictionCount > 0 && assembly.noiseLimitDb && "과 "}
            {assembly.noiseLimitDb && <b>소음 한도 {assembly.noiseLimitDb}dB</b>}{" "}
            규정이 있습니다. 참여 전에 반드시 확인하세요.
          </Notice>
        )}

        <Link
          href={`/assembly/${assembly.id}/rules`}
          className="block rounded-2xl bg-navy px-4 py-3.5 text-center text-[15px] font-extrabold text-white"
        >
          준수사항 전체 보기 ›
        </Link>

        {assembly.marchRoute && (
          <Link
            href={`/march/${assembly.id}`}
            className="block rounded-2xl border border-line bg-white px-4 py-3.5 text-center text-[14px] font-bold text-navy"
          >
            행진 실시간 추적 ›
          </Link>
        )}

        <div>
          <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-muted">
            현재 참여 예정
          </p>
          <div className="rounded-2xl border border-line bg-white py-5.5 text-center">
            <p className="text-[34px] font-black tracking-tighter text-navy">
              {assembly.attendingCount.toLocaleString("ko-KR")}
              <span className="text-[16px] font-semibold text-muted">명</span>
            </p>
            <p className="mt-1.5 text-[12px] font-semibold text-muted">
              주최자에게 인원 예측으로 전달됩니다
            </p>
          </div>
        </div>

        <AttendButton assemblyId={assembly.id} />
      </div>
    </div>
  );
}

function Row({ k, v, small }: { k: string; v: string; small?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-1.75">
      <span className="shrink-0 font-semibold text-muted">{k}</span>
      <span
        className={`text-right font-bold text-ink ${small ? "text-[12.5px] font-medium text-muted" : ""}`}
      >
        {v}
      </span>
    </div>
  );
}
