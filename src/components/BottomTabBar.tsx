"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/map", label: "지도", icon: "🗺️" },
  { href: "/forecast", label: "예보", icon: "📅" },
  { href: "/me", label: "내 정보", icon: "👤" },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[78px] w-full max-w-[480px] border-t border-line bg-white/96 pb-3 backdrop-blur-md"
      aria-label="주요 메뉴"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 pt-2"
            aria-current={active ? "page" : undefined}
          >
            <span
              className={`text-[19px] leading-none ${active ? "" : "opacity-40 grayscale"}`}
            >
              {tab.icon}
            </span>
            <span
              className={`text-[10.5px] font-extrabold ${active ? "text-navy" : "text-muted"}`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
