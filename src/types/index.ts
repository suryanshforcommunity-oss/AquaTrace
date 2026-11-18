export type UserRole = "resident" | "admin" | "maintenance" | "utility" | "iot";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  societyId: string;
  apartmentUnit?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Society {
  id: string;
  name: string;
  location: string;
  totalApartments: number;
  totalResidents: number;
  dailyWaterQuotaLiters: number;
  usableStorageCapacityLiters: number;
  borewellCount: number;
  rwhUnitCount: number;
  coordinates: { lat: number; lng: number };
}

export type WaterSourceType = "municipal" | "tanker" | "borewell" | "rainwater" | "other";

export interface WaterAvailabilityLog {
  id: string;
  societyId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  source: WaterSourceType;
  quantityLiters: number;
  durationMinutes: number;
  storageTankName: string;
  shortageStatus: "surplus" | "adequate" | "low" | "critical";
  notes?: string;
  submittedBy: string;
  submitterRole: UserRole;
  isSensorVerified: boolean;
  createdAt: string;
}

export type TankerStatus =
  | "scheduled"
  | "en_route"
  | "arrived"
  | "delayed"
  | "missed"
  | "completed"
  | "disputed";

export interface TankerSchedule {
  id: string;
  societyId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeWindow: string; // e.g. "15:30 - 16:30"
  vendorName: string;
  tankerNumber: string;
  driverName: string;
  driverPhone: string;
  sourceType: "municipal_potable" | "treated_secondary" | "private_sweet";
  plannedQuantityLiters: number;
  actualQuantityLiters?: number;
  status: TankerStatus;
  actualArrivalTime?: string;
  costInINR: number;
  confirmedBy?: string;
  deliverySlipUrl?: string;
  notes?: string;
}

export interface BorewellPoint {
  id: string;
  societyId: string;
  name: string;
  referenceDatumMsl: number; // e.g. 920.4 m MSL
  totalDepthMeters: number;
  casingHeightMeters: number;
  safeThresholdMeters: number;
  warningThresholdMeters: number;
  criticalThresholdMeters: number;
  sensorDeviceId?: string;
  status: "active" | "resting" | "offline";
  currentDepthMeters: number;
  swlMeters: number;
  pwlMeters: number;
  yieldLpm: number;
}

export interface GroundwaterReading {
  id: string;
  societyId: string;
  borewellId: string;
  depthMeters: number; // meters below reference point
  waterElevationMsl: number;
  timestamp: string;
  source: "iot_transducer" | "manual_dip_tape" | "hydrological_feed";
  reportedBy: string;
  status: "verified" | "flagged" | "calibrated";
  notes?: string;
}

export interface RainwaterHarvestingUnit {
  id: string;
  societyId: string;
  name: string;
  buildingBlock: string;
  roofAreaSqM: number;
  annualAvgRainfallMm: number;
  runoffCoefficient: number; // default 0.85
  collectionEfficiency: number; // default 0.90
  potentialVolumeLiters: number;
  actualCollectedLiters: number;
  effectivenessPercent: number;
  filterType: string;
  storageTankCapacityLiters: number;
  lastInspectionDate: string;
  nextMaintenanceDue: string;
  status: "optimal" | "maintenance_due" | "clogged";
  inspectorName?: string;
}

export interface MaintenanceChecklistLog {
  id: string;
  unitId: string;
  societyId: string;
  inspectionDate: string;
  inspectorName: string;
  guttersCleared: boolean;
  firstFlushDiverted: boolean;
  filterMeshCleaned: boolean;
  pipeJointsInspected: boolean;
  storageTankSedimentFlushed: boolean;
  overallStatus: "passed" | "repairs_needed" | "critical";
  notes: string;
  photoUrl?: string;
}

export type LeakageUrgency = "low" | "medium" | "high" | "critical";
export type LeakageStatus =
  | "submitted"
  | "under_review"
  | "forwarded"
  | "in_progress"
  | "resolved";

export interface LeakageReport {
  id: string;
  societyId: string;
  title: string;
  category: "pipe_burst" | "tank_overflow" | "ground_seepage" | "valve_fault" | "tap_leak" | "wastage";
  urgency: LeakageUrgency;
  locationDetails: string;
  buildingBlock: string;
  description: string;
  photoUrl?: string;
  submittedBy: string;
  submitterContact?: string;
  timestamp: string;
  status: LeakageStatus;
  assignedTechnician?: string;
  forwardedUtilityChannel?: "BWSSB Official Portal" | "Municipal Water Board" | "RWA Maintenance Desk";
  utilityReferenceNumber?: string;
  forwardedTimestamp?: string;
  resolutionTimestamp?: string;
  resolutionNotes?: string;
  notes?: string;
}

export interface WaterSavingLog {
  id: string;
  societyId: string;
  residentName: string;
  apartmentUnit: string;
  activityCategory:
    | "aerator_installed"
    | "ro_reject_reused"
    | "greywater_gardening"
    | "leak_fixed"
    | "short_shower"
    | "rwh_maintenance"
    | "car_bucket_wash";
  activityTitle: string;
  description: string;
  estimatedLitersSaved: number;
  measuredLitersSaved: number;
  isMeasuredByMeter: boolean;
  isVerifiedByAdmin: boolean;
  verifiedBy?: string;
  timestamp: string;
  photoProofUrl?: string;
}

export interface CommunityAdvisory {
  id: string;
  title: string;
  category: "leak_prevention" | "drought_coping" | "tank_care" | "rwh_tips" | "seasonal" | "conservation_idea";
  content: string;
  author: string;
  date: string;
  readTime: string;
  likes: number;
  isOfficial: boolean;
}

export interface ForumPost {
  id: string;
  societyId: string;
  authorName: string;
  authorRole: UserRole;
  apartmentUnit: string;
  title: string;
  content: string;
  category: "conservation_idea" | "question" | "tanker_alert" | "maintenance_request";
  timestamp: string;
  upvotes: number;
  repliesCount: number;
  isPinned?: boolean;
}

export interface AlertNotification {
  id: string;
  societyId: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  timestamp: string;
  source: string;
  recommendedAction?: string;
  isRead: boolean;
  targetRole?: UserRole;
  actionUrl?: string;
}

export interface IoTDevice {
  id: string;
  societyId: string;
  name: string;
  type: "hydrostatic_groundwater" | "ultrasonic_tank_level" | "flow_meter" | "water_quality_probe" | "pressure_transducer";
  location: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevelPercent: number;
  signalStrengthDbm: number;
  status: "online" | "warning" | "offline";
  lastPing: string;
  currentReading: {
    value: number;
    unit: string;
    type: string;
  };
}

export interface WaterQualityReading {
  id: string;
  societyId: string;
  measurementPoint: string;
  timestamp: string;
  tdsPpm: number; // 50 - 500 ppm typical
  turbidityNtu: number; // 0 - 5 NTU typical
  ph: number; // 6.5 - 8.5 typical
  status: "normal_range" | "abnormal_range" | "requires_lab_test";
  screeningDisclaimer: string;
}

export interface WaterForecastDay {
  date: string;
  historicalDemandLiters: number;
  predictedDemandLiters: number;
  expectedSupplyLiters: number;
  deficitOrSurplusLiters: number;
  shortageRisk: "low" | "moderate" | "high" | "severe";
  temperatureCelsius: number;
  rainfallMmForecast: number;
}
