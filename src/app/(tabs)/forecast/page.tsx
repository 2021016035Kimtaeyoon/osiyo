import { getAssemblies } from "@/lib/mock";
import { Notice } from "@/components/Notice";
import { SourceTag } from "@/components/SourceTag";
import { formatDate, formatHeadcount, formatTimeRange } from "@/lib/format";

export default function ForecastPage() {
  const upcoming = getAssemblies()
    .filter((a) => a.status === "예정")
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pb-3.5 pt-4">
        <p className="text-[19px] font-black tracking-tighter text-navy">
          이번 주 <span className="text-amber">통제 예보</span>
        </p>
      </div>

      <div className="flex-1 space-y-3.5 px-4 pb-8">
        <Notice>
          집회는 법으로 <b>최소 48시간 전에 신고</b>됩니다. 그래서 이번 주
          통제는 이미 정해져 있는 경우가 많습니다. 표시된 시간·구간은 신고
          기준 추정치이며 실제와 다를 수 있습니다.
        </Notice>

        {upcoming.length === 0 && (
          <p className="rounded-card border border-dashed border-line py-10 text-center text-[13px] font-medium text-muted">
            이번 주 예정된 집회가 없습니다.
          </p>
        )}

        {upcoming.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border-2 border-amber bg-white p-4.5"
          >
            <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
              <span className="size-1.5 rounded-full bg-amber" />
              {formatDate(a.startAt)} · {a.title}
            </h3>
            <dl className="divide-y divide-line text-[13.5px]">
              <div className="flex justify-between py-1.75">
                <span className="font-semibold text-muted">위치</span>
                <span className="font-bold text-ink">{a.location.name}</span>
              </div>
              <div className="flex justify-between py-1.75">
                <span className="font-semibold text-muted">시간</span>
                <span className="font-bold text-ink">
                  {formatTimeRange(a.startAt, a.endAt)}
                </span>
              </div>
              <div className="flex justify-between py-1.75">
                <span className="font-semibold text-muted">신고 인원</span>
                <span className="font-bold text-ink">
                  {formatHeadcount(a.reportedHeadcount)}
                </span>
              </div>
              {a.restrictedZones.length > 0 && (
                <div className="flex justify-between py-1.75">
                  <span className="font-semibold text-muted">진입 금지</span>
                  <span className="font-bold text-ink">
                    {a.restrictedZones.length}곳
                  </span>
                </div>
              )}
            </dl>
            <div className="mt-3">
              <SourceTag source={a.source} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
