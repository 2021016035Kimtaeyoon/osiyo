import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "오시요",
  description:
    "집회 신고 정보를 모아 참여자에게는 준수사항을, 회피자에게는 우회 경로를 안내합니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full`}>
      <body className="min-h-full bg-bg text-ink antialiased">
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
