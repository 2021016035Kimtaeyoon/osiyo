import type { Assembly } from "@/types";

export function ConflictVenn({ assemblies }: { assemblies: Assembly[] }) {
  const [a, b] = assemblies;
  return (
    <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-70">
      <circle
        cx={112}
        cy={92}
        r={66}
        fill="#2B4B8C"
        fillOpacity={0.15}
        stroke="#2B4B8C"
        strokeWidth={2}
      />
      <circle
        cx={188}
        cy={92}
        r={66}
        fill="#F2A93B"
        fillOpacity={0.22}
        stroke="#D98A1B"
        strokeWidth={2}
      />
      <text x={72} y={84} fontSize={13} fontWeight={800} fill="#2B4B8C" textAnchor="middle">
        신고 A
      </text>
      <text x={72} y={104} fontSize={11.5} fill="#5A6E90" textAnchor="middle">
        {a?.reportedHeadcount.toLocaleString("ko-KR")}명
      </text>
      <text x={228} y={84} fontSize={13} fontWeight={800} fill="#D98A1B" textAnchor="middle">
        신고 B
      </text>
      <text x={228} y={104} fontSize={11.5} fill="#8A7444" textAnchor="middle">
        {b?.reportedHeadcount.toLocaleString("ko-KR")}명
      </text>
      <text x={150} y={96} fontSize={12.5} fontWeight={900} fill="#13234A" textAnchor="middle">
        겹침
      </text>
    </svg>
  );
}
