import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssemblyById } from "@/lib/mock";
import { getAttendingCount } from "@/lib/attend";

export default async function JoinedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ count?: string }>;
}) {
  const { id } = await params;
  const { count } = await searchParams;
  const assembly = getAssemblyById(id);
  if (!assembly) notFound();

  const attendingCount =
    Number(count) || getAttendingCount(id, assembly.attendingCount);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-7 py-10 text-center">
      <div className="mb-5.5 grid size-22 place-items-center rounded-full bg-ok-bg text-[38px] text-ok">
        ✓
      </div>
      <h1 className="mb-2.5 text-[22px] font-black tracking-tight text-navy">
        참여 예정으로 집계됐습니다
      </h1>
      <p className="text-[14px] leading-relaxed font-medium text-muted">
        주최자는 이제 물품 준비와
        <br />
        질서유지인 배치를 숫자로 계획할 수 있습니다.
      </p>

      <p className="mt-5.5 text-[40px] font-black tracking-tighter text-navy">
        {attendingCount.toLocaleString("ko-KR")}
        <span className="text-[17px] font-semibold text-muted">명</span>
      </p>
      <p className="text-[12px] font-bold text-muted">현재 참여 예정 인원</p>

      <div className="mt-6.5 w-full rounded-2xl border border-[#9BD3B4] bg-ok-bg p-3.5 text-left text-[12.5px] font-medium leading-relaxed text-[#1E6B43]">
        <b>저장된 것</b> — 예상 인원 숫자 1건
        <br />
        <b>저장되지 않은 것</b> — 이름, 연락처, 위치, 누가 눌렀는지
      </div>

      <Link
        href="/"
        className="mt-4 block w-full rounded-2xl border border-line bg-white py-3.5 text-center text-[15px] font-extrabold text-navy"
      >
        홈으로
      </Link>
    </div>
  );
}
