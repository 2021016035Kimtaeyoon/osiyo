import { BottomTabBar } from "@/components/BottomTabBar";
import type { ReactNode } from "react";

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-[78px]">
      {children}
      <BottomTabBar />
    </div>
  );
}
