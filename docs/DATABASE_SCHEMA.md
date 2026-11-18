# Cloud Firestore Database Schema & Data Models
## Community Water Intelligence & Conservation Platform

This document describes the production Firestore collections, field definitions, indexes, and document relationships.

---

### 1. `societies` Collection
Represents registered residential layouts, apartment complexes, and RWAs.

```typescript
interface SocietyDocument {
  id: string; // Document ID (e.g., "soc_greenwood_01")
  name: string; // e.g. "Greenwood Heights RWA (Block A, B & C)"
  location: string; // City / sub-ward
  totalApartments: number; // 420
  totalResidents: number; // 1650
  dailyWaterQuotaLiters: number; // 175000
  usableStorageCapacityLiters: number; // 240000
  borewellCount: number; // 3
  rwhUnitCount: number; // 4
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Timestamp;
}
```

---

### 2. `availabilityLogs` Collection
Logs daily water supply events across all sources.

```typescript
interface AvailabilityLogDocument {
  id: string;
  societyId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  source: "municipal" | "tanker" | "borewell" | "rainwater" | "other";
  quantityLiters: number;
  durationMinutes: number;
  storageTankName: string;
  shortageStatus: "surplus" | "adequate" | "low" | "critical";
  notes?: string;
  submittedBy: string;
  submitterRole: "resident" | "admin" | "maintenance" | "utility";
  isSensorVerified: boolean;
  createdAt: Timestamp;
}
```

---

### 3. `tankerSchedules` Collection
Tracks commercial and municipal tanker bookings, gate deliveries, and volumetric reconciliation.

```typescript
interface TankerScheduleDocument {
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
  status: "scheduled" | "en_route" | "arrived" | "delayed" | "missed" | "completed" | "disputed";
  actualArrivalTime?: string;
  costInINR: number;
  confirmedBy?: string;
  notes?: string;
}
```

---

### 4. `groundwaterReadings` Collection
Time-series hydrostatic depth measurements below wellhead casing datums.

```typescript
interface GroundwaterReadingDocument {
  id: string;
  societyId: string;
  borewellId: string; // e.g. "bw_02"
  depthMeters: number; // e.g. 18.42m below datum
  waterElevationMsl: number; // e.g. +901.98m MSL
  source: "iot_transducer" | "manual_dip_tape" | "hydrological_feed";
  reportedBy: string;
  status: "calibrated" | "verified" | "flagged";
  notes?: string;
  timestamp: Timestamp;
}
```

---

### 5. `harvestingUnits` & `maintenanceLogs`
Rooftop catchment assets and maintenance inspection checklists.

```typescript
interface HarvestingUnitDocument {
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
}

interface MaintenanceLogDocument {
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
}
```

---

### 6. `leakageReports` Collection
Citizen reports and public utility dockets.

```typescript
interface LeakageReportDocument {
  id: string;
  societyId: string;
  title: string;
  category: "pipe_burst" | "tank_overflow" | "ground_seepage" | "valve_fault" | "tap_leak" | "wastage";
  urgency: "low" | "medium" | "high" | "critical";
  locationDetails: string;
  buildingBlock: string;
  description: string;
  photoUrl?: string;
  submittedBy: string;
  submitterContact?: string;
  timestamp: Timestamp;
  status: "submitted" | "under_review" | "forwarded" | "in_progress" | "resolved";
  assignedTechnician?: string;
  forwardedUtilityChannel?: "BWSSB Official Portal" | "Municipal Water Board" | "RWA Maintenance Desk";
  utilityReferenceNumber?: string;
  forwardedTimestamp?: Timestamp;
  resolutionTimestamp?: Timestamp;
  resolutionNotes?: string;
}
```

---

### 7. `waterSavingLogs` Collection
Audited community conservation activities.

```typescript
interface WaterSavingLogDocument {
  id: string;
  societyId: string;
  residentName: string;
  apartmentUnit: string;
  activityCategory: "aerator_installed" | "ro_reject_reused" | "greywater_gardening" | "leak_fixed" | "car_bucket_wash" | "rwh_maintenance";
  activityTitle: string;
  description: string;
  estimatedLitersSaved: number;
  measuredLitersSaved: number; // Stored strictly separately!
  isMeasuredByMeter: boolean;
  isVerifiedByAdmin: boolean;
  verifiedBy?: string;
  timestamp: Timestamp;
  photoProofUrl?: string;
}
```

