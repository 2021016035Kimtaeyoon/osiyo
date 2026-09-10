import { NextResponse } from "next/server";
import { getAssemblyById } from "@/lib/mock";
import { incrementAttending } from "@/lib/attend";

/**
 * 참여 예정 표시. 요청에서 어떤 식별자도 읽지 않는다 — 본문도, 헤더도, IP도 로깅하지 않는다.
 * 저장하는 것은 오직 집계된 숫자 하나뿐이다.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assembly = getAssemblyById(id);
  if (!assembly) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const attendingCount = incrementAttending(id, assembly.attendingCount);
  return NextResponse.json({ attendingCount });
}
