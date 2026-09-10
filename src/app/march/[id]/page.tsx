import { notFound } from "next/navigation";
import { getAssemblyById } from "@/lib/mock";
import { estimateHeadPosition } from "@/lib/march";
import { getReportCount } from "@/lib/report";
import { BackHeader } from "@/components/BackHeader";
import { Notice } from "@/components/Notice";
import { MarchProgress } from "@/components/MarchProgress";
import { ReportButton } from "@/components/ReportButton";
import { KakaoMap } from "@/components/KakaoMap";
import type { MapMarker, MapPolyline } from "@/components/SchematicMap";

export default async function MarchTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assembly = getAssemblyById(id);
  if (!assembly?.marchRoute) notFound();

  const route = assembly.marchRoute;
  const estimate = estimateHeadPosition(route, new Date());
  const reportCount = getReportCount(id, route.reportCount);

  const markers: MapMarker[] = [
    {
      id: "head",
      position: estimate.position,
      variant: "primary",
      label: `현재 선두 · ${estimate.fromWaypoint}`,
    },
  ];
  const polylines: MapPolyline[] = [
    {
      path: route.waypoints.map((w) => w.location),
      color: "#2B4B8C",
      width: 5,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="행진 실시간 추적" />
      <div className="flex-1 space-y-3.5 px-4 pb-10">
        <Notice>
          신고서에는 <b>{assembly.location.name.split(" ")[0]}</b>이라고만
          적혀 있지만, 행렬은 계속 이동합니다. 현재 선두는{" "}
          <b>{estimate.fromWaypoint}</b>입니다.
        </Notice>

        <KakaoMap
          center={estimate.position}
          markers={markers}
          polylines={polylines}
          height={220}
        />

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-1 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            {assembly.title}
          </h3>
          <MarchProgress waypoints={route.waypoints} estimate={estimate} />
        </div>

        <div className="rounded-2xl border border-line bg-white p-4.5">
          <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
            <span className="size-1.5 rounded-full bg-amber" />
            위치는 이렇게 계산합니다
          </h3>
          <dl className="divide-y divide-line text-[13.5px]">
            <div className="flex justify-between py-1.75">
              <span className="font-semibold text-muted">익명 제보</span>
              <span className="font-bold text-ink">
                {reportCount}건
                {route.lastReportAt && " · 최근 제보 있음"}
              </span>
            </div>
            <div className="flex justify-between py-1.75">
              <span className="font-semibold text-muted">신고 시간표 보간</span>
              <span className="font-bold text-ink">
                {estimate.basis === "reported" ? "제보 기준" : "제보 없는 구간 자동 추정"}
              </span>
            </div>
          </dl>
          <div className="mt-3">
            <Notice>
              제보가 <b>0건이어도</b> 신고된 시간표로 예상 위치가 계속
              표시됩니다.
            </Notice>
          </div>
        </div>

        <ReportButton assemblyId={id} />
      </div>
    </div>
  );
}
