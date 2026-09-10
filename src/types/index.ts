/** 위도/경도 좌표 */
export interface LatLng {
  lat: number;
  lng: number;
}

/** 데이터 출처와 기준 시각. 화면에 노출되는 모든 공공데이터는 이 정보를 함께 표시한다. */
export interface Source {
  provider: "경찰청" | "서울경찰청" | "서울시 실시간 도시데이터" | "서울시 TOPIS" | "공공데이터포털";
  fetchedAt: string; // ISO 8601
}

export type AssemblyStatus = "예정" | "진행중" | "종료";

export type AssemblyTopic =
  | "노동"
  | "환경"
  | "주거"
  | "교육"
  | "인권"
  | "정치"
  | "기타";

/** 신고서에 기재된 행진 경로 상의 한 지점 */
export interface MarchWaypoint {
  name: string;
  location: LatLng;
  scheduledAt: string; // ISO 8601, 신고서 기준 예정 통과 시각
  actualPassedAt?: string; // ISO 8601, 제보/추정으로 확인된 실제 통과 시각
}

/** 행진 경로 전체 */
export interface MarchRoute {
  waypoints: MarchWaypoint[];
  /** 최근 익명 제보 건수 (위치 저장 없이 집계만) */
  reportCount: number;
  /** 가장 최근 제보 시각 */
  lastReportAt?: string;
}

export type ComplianceKind = "금지" | "의무" | "참고";

export interface Compliance {
  kind: ComplianceKind;
  title: string;
  description: string;
  /** 근거 조문, 예: "집회 및 시위에 관한 법률 제12조" */
  legalBasis?: string;
}

/** 진입 금지 등 통제 구역 (원형으로 단순화) */
export interface RestrictedZone {
  name: string;
  center: LatLng;
  radiusM: number;
  activeFrom: string; // ISO 8601
  activeUntil: string; // ISO 8601
}

export interface Assembly {
  id: string;
  title: string;
  organizer: string;
  topics: AssemblyTopic[];
  status: AssemblyStatus;
  location: {
    name: string; // 예: "광화문 세종대로"
    center: LatLng;
  };
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601 (해산 예정)
  reportedHeadcount: number;
  /** 참여 예정 집계 숫자 (익명, 서버는 총합만 저장) */
  attendingCount: number;
  marchRoute?: MarchRoute;
  compliance: Compliance[];
  restrictedZones: RestrictedZone[];
  /** dB 단위 소음 한도. 구간별로 다르면 최댓값 기준 */
  noiseLimitDb?: number;
  source: Source;
}

export type CongestionLevel = "원활" | "보통" | "혼잡" | "매우혼잡";

/** 지역 단위 혼잡도. 서울 열린데이터광장 실시간 도시데이터 기반 */
export interface Congestion {
  areaCode: string;
  areaName: string;
  level: CongestionLevel;
  /** 0-100, 시각화용 */
  score: number;
  updatedAt: string; // ISO 8601
  source: Source;
}

/** 서로 다른 두 신고가 겹치는 구역 단위 경보. 개별 집단의 실시간 위치는 담지 않는다. */
export interface ConflictAlert {
  zoneName: string;
  assemblyIds: [string, string, ...string[]];
  overlapDescription: string;
  expandedControlArea: string;
  expectedDelayMinutes?: number;
  recommendation: string;
  source: Source;
}

export type RouteStepIcon =
  | "straight"
  | "left"
  | "right"
  | "warn"
  | "done"
  | "flag";

export interface RouteStep {
  instruction: string;
  detail?: string;
  distanceM: number;
  icon: RouteStepIcon;
  /** 이 구간이 집회 통제 구역과 겹치는지 */
  throughRestrictedZone?: boolean;
}

export interface RouteOption {
  kind: "shortest" | "avoidance";
  label: string;
  distanceKm: number;
  durationMin: number;
  /** 통제 미반영 시 원래 소요시간 (shortest 옵션에서 취소선 표시용) */
  baselineDurationMin?: number;
  throughRestrictedZone: boolean;
  steps: RouteStep[];
  polyline: LatLng[];
}

export interface RouteComparison {
  shortest: RouteOption;
  avoidance: RouteOption;
}
