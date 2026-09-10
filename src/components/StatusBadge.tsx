import type { AssemblyStatus } from "@/types";
import { formatTime } from "@/lib/format";

const styles: Record<AssemblyStatus, string> = {
  진행중: "bg-warn-bg text-warn",
  예정: "bg-amber-bg text-amber-dark",
  종료: "bg-line text-muted",
};

export function StatusBadge({
  status,
  startAt,
}: {
  status: AssemblyStatus;
  startAt: string;
}) {
  const label = status === "예정" ? `${formatTime(startAt)} 시작` : status;
  return (
    <span
      className={`shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-extrabold ${styles[status]}`}
    >
      {label}
    </span>
  );
}
