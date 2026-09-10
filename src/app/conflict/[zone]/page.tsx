import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssemblyById, getConflictAlerts } from "@/lib/mock";
import { BackHeader } from "@/components/BackHeader";
import { Notice } from "@/components/Notice";
import { ConflictVenn } from "@/components/ConflictVenn";
import { SourceTag } from "@/components/SourceTag";
import { formatTime } from "@/lib/format";

export default async function ConflictPage({
  params,
}: {
  params: Promise<{ zone: string }>;
}) {
  const { zone } = await params;
  const zoneName = decodeURIComponent(zone);
  const alert = getConflictAlerts().find((c) => c.zoneName === zoneName);
  if (!alert) notFound();

  const assemblies = alert.assemblyIds
    .map((id) => getAssemblyById(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const first = assemblies[0];

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="맞불 겹침 경보" />
      <div className="flex-1 space-y-3.5 px-4 pb-10">
        <Notice variant="warn">
          {zoneName}에 <b>성격이 다른 신고 {assemblies.length}건</b>이
          겹쳤습니다. 통제 범위가 넓어지고 해산이 늦어질 수 있습니다.
        </Notice>

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <ConflictVenn assemblies={assemblies} />
        </div>

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            예상되는 영향
          </h3>
          <dl className="divide-y divide-line text-[13.5px]">
            <Row k="통제 범위" v={alert.expandedControlArea} />
            <Row
              k="해산 예정"
              v={
                first
                  ? `${formatTime(first.endAt)}${
                      alert.expectedDelayMinutes
                        ? ` → 최대 ${alert.expectedDelayMinutes}분 지연 가능`
                        : ""
                    }`
                  : "-"
              }
            />
            <Row k="권장" v={alert.recommendation} />
          </dl>
          <div className="mt-3">
            <SourceTag source={alert.source} />
          </div>
        </div>

        <Notice variant="ok">
          <b>표시하지 않는 것</b>
          <br />
          오시요는 어느 집단이 지금 어디 있는지를 상대편에게 알려주지
          않습니다. 구역 단위의 교통 위험 신호만 제공합니다.
        </Notice>

        <Link
          href="/route"
          className="block rounded-2xl bg-navy px-4 py-3.5 text-center text-[15px] font-extrabold text-white"
        >
          우회 경로 보기
        </Link>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.75">
      <span className="shrink-0 font-semibold text-muted">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  );
}
