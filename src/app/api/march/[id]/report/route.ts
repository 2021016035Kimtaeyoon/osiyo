import { NextResponse } from "next/server";
import { getAssemblyById } from "@/lib/mock";
import { incrementReport } from "@/lib/report";

/** "지금 여기 지나감" 익명 제보. 위치·식별자를 읽거나 저장하지 않고 건수만 늘린다. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assembly = getAssemblyById(id);
  if (!assembly?.marchRoute) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const reportCount = incrementReport(id, assembly.marchRoute.reportCount);
  return NextResponse.json({ reportCount });
}
