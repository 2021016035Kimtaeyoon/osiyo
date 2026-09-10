import { notFound } from "next/navigation";
import { getAssemblyById } from "@/lib/mock";
import { BackHeader } from "@/components/BackHeader";
import { Notice } from "@/components/Notice";
import { RuleList } from "@/components/RuleList";
import { AttendButton } from "@/components/AttendButton";

export default async function RulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assembly = getAssemblyById(id);
  if (!assembly) notFound();

  const prohibited = assembly.compliance.filter((c) => c.kind === "금지");
  const required = assembly.compliance.filter((c) => c.kind === "의무");
  const info = assembly.compliance.filter((c) => c.kind === "참고");

  return (
    <div className="flex min-h-screen flex-col">
      <BackHeader title="준수사항" />
      <div className="flex-1 space-y-3.5 px-4 pb-10">
        <Notice variant="warn">
          아래 내용은 <b>집회 및 시위에 관한 법률</b>과 이 집회의 신고 내용에서
          자동 생성되었습니다. 위반 시 해산 명령 또는 처벌 대상이 될 수 있습니다.
        </Notice>

        <RuleList kind="금지" items={prohibited} />
        <RuleList kind="의무" items={required} />
        <RuleList kind="참고" items={info} />

        <Notice variant="ok">
          이 안내는 <b>주최 측이 참가자에게 고지한 기록</b>으로도 남습니다.
          주최자는 고지 이행을 증명할 수 있습니다.
        </Notice>

        <AttendButton
          assemblyId={assembly.id}
          label="확인했습니다 · 참여 예정 표시"
        />
      </div>
    </div>
  );
}
