import type { Compliance, ComplianceKind } from "@/types";

const ICON: Record<ComplianceKind, { glyph: string; cls: string }> = {
  금지: { glyph: "✕", cls: "bg-warn-bg text-warn" },
  의무: { glyph: "✓", cls: "bg-ok-bg text-ok" },
  참고: { glyph: "i", cls: "bg-[#EDF1F9] text-navy-2" },
};

export function RuleList({
  kind,
  items,
}: {
  kind: ComplianceKind;
  items: Compliance[];
}) {
  if (items.length === 0) return null;
  const heading =
    kind === "금지" ? "하면 안 되는 것" : kind === "의무" ? "지켜야 하는 것" : "알아두면 좋은 것";

  return (
    <div className="rounded-2xl border border-line bg-white p-4.5">
      <h3 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-extrabold text-navy">
        <span className="size-1.5 rounded-full bg-amber" />
        {heading}
      </h3>
      <ul>
        {items.map((rule, i) => {
          const icon = ICON[kind];
          return (
            <li
              key={i}
              className={`flex gap-2.5 py-2.75 text-[13.5px] leading-relaxed font-medium text-ink ${
                i < items.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <span
                className={`mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-[7px] text-[12px] font-black ${icon.cls}`}
              >
                {icon.glyph}
              </span>
              <span>
                <b className="font-bold">{rule.title}</b>
                <br />
                {rule.description}
                {rule.legalBasis && (
                  <span className="block text-[11px] font-semibold text-muted">
                    {rule.legalBasis}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
