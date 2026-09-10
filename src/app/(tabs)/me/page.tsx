import { Notice } from "@/components/Notice";

export default function MePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pb-3.5 pt-4">
        <p className="text-[19px] font-black tracking-tighter text-navy">
          내 <span className="text-amber">정보</span>
        </p>
      </div>

      <div className="flex-1 space-y-3.5 px-4 pb-8">
        <Notice variant="ok">
          <b>로그인이 없습니다.</b>
          <br />
          오시요는 계정을 만들지 않으며, 누가 어떤 집회를 봤는지 저장하지
          않습니다.
        </Notice>

        <section>
          <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-muted">
            알림 설정
          </p>
          <div className="rounded-2xl border border-line bg-white p-4.5">
            <Row k="주간 예보" v="월요일 08:00" on />
            <Row k="내 경로 통제 알림" v="켜짐" on />
            <Row k="관심 주제 새 집회" v="꺼짐" />
            <Row k="맞불 겹침 경보" v="켜짐" on last />
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
            알림 발송은 준비 중입니다. 현재는 기본값만 표시합니다.
          </p>
        </section>

        <section>
          <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-muted">
            데이터 출처
          </p>
          <div className="rounded-2xl border border-line bg-white p-4.5">
            <Row k="집회 정보" v="경찰청 · 서울경찰청" />
            <Row k="혼잡도" v="서울시 실시간 도시데이터" />
            <Row k="교통 통제" v="서울시 TOPIS" last />
          </div>
        </section>

        <Notice>
          집회·혼잡도·통제 정보는 신고·공공데이터 기준 추정치이며 실제와 다를
          수 있습니다. 정확한 최신 정보는 출발 전 관할 경찰서 공지를 함께
          확인하세요.
        </Notice>
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  on,
  last,
}: {
  k: string;
  v: string;
  on?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 text-[13.5px] ${last ? "" : "border-b border-line"}`}
    >
      <span className="font-semibold text-muted">{k}</span>
      <span className={`font-bold ${on ? "text-ok" : "text-muted"}`}>
        {v}
        {on && " ✓"}
      </span>
    </div>
  );
}
