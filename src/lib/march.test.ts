import { describe, expect, it } from "vitest";
import { estimateHeadPosition } from "@/lib/march";
import type { MarchRoute } from "@/types";

const route: MarchRoute = {
  reportCount: 0,
  waypoints: [
    {
      name: "A",
      location: { lat: 0, lng: 0 },
      scheduledAt: "2026-09-04T14:00:00+09:00",
    },
    {
      name: "B",
      location: { lat: 10, lng: 10 },
      scheduledAt: "2026-09-04T15:00:00+09:00",
    },
    {
      name: "C",
      location: { lat: 20, lng: 20 },
      scheduledAt: "2026-09-04T16:00:00+09:00",
    },
  ],
};

describe("estimateHeadPosition", () => {
  it("clamps to the first waypoint before the march starts", () => {
    const r = estimateHeadPosition(route, new Date("2026-09-04T13:00:00+09:00"));
    expect(r.position).toEqual({ lat: 0, lng: 0 });
    expect(r.progress).toBe(0);
  });

  it("clamps to the last waypoint after the march ends", () => {
    const r = estimateHeadPosition(route, new Date("2026-09-04T17:00:00+09:00"));
    expect(r.position).toEqual({ lat: 20, lng: 20 });
  });

  it("interpolates by schedule when no reports exist", () => {
    const r = estimateHeadPosition(route, new Date("2026-09-04T14:30:00+09:00"));
    expect(r.basis).toBe("scheduled");
    expect(r.progress).toBeCloseTo(0.5, 5);
    expect(r.position.lat).toBeCloseTo(5, 5);
    expect(r.position.lng).toBeCloseTo(5, 5);
  });

  it("anchors to the confirmed report time when one exists", () => {
    const reported: MarchRoute = {
      reportCount: 12,
      lastReportAt: "2026-09-04T14:45:00+09:00",
      waypoints: [
        { ...route.waypoints[0], actualPassedAt: "2026-09-04T14:15:00+09:00" },
        route.waypoints[1],
        route.waypoints[2],
      ],
    };
    // 14:15 실제 통과 확인, 다음 지점 예정 15:00 → 45분 구간의 20분 지점(≈0.444)
    const r = estimateHeadPosition(
      reported,
      new Date("2026-09-04T14:35:00+09:00")
    );
    expect(r.basis).toBe("reported");
    expect(r.progress).toBeCloseTo(20 / 45, 5);
  });

  it("still returns a position with zero reports (schedule-only fallback)", () => {
    const r = estimateHeadPosition(route, new Date("2026-09-04T15:30:00+09:00"));
    expect(r.basis).toBe("scheduled");
    expect(r.fromWaypoint).toBe("B");
    expect(r.toWaypoint).toBe("C");
  });
});
