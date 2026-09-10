import type { Source } from "@/types";
import { formatAsOf } from "@/lib/format";

export function SourceTag({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-pill bg-line/60 px-2 py-1 text-[11px] font-semibold text-muted">
      {source.provider} · {formatAsOf(source.fetchedAt)}
    </span>
  );
}
