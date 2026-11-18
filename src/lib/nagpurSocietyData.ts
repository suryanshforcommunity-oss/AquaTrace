import {
  WaterAvailabilityLog,
  TankerSchedule,
  BorewellPoint,
  GroundwaterReading,
  RainwaterHarvestingUnit,
  MaintenanceChecklistLog,
  LeakageReport,
  WaterSavingLog,
  ForumPost,
  AlertNotification,
  WaterQualityReading,
} from "@/types";
import { NAGPUR_TOWNSHIPS } from "./nagpurData";

/**
 * Generates rich, realistic, society-specific datasets for each Nagpur township.
 * Ensures that when a user switches society in the navigation bar, ALL data,
 * storage levels, tanker manifests, borewell soundings, leak reports,
 * and alerts update dynamically to reflect that exact society.
 */

// Helper to generate borewells for a society
export function getBorewellsForSociety(societyId: string): BorewellPoint[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];
  const count = township.borewellCount || 3;

  const namesBySociety: Record<string, string[]> = {
    soc_nagpur_bloomdale: [
      "BW-01 (Sector 20 Villa Ring)",
      "BW-02 (Clubhouse Basalt Point)",
      "BW-03 (Tower 4 Deep Aquifer)",
      "BW-04 (North Gate Inflow Well)",
      "BW-05 (Phase 2 Outer Perimeter)",
    ],
    soc_nagpur_godrej_anandam: [
      "BW-01 (Model Mill Central Sump)",
      "BW-02 (Tower B Heritage Well)",
      "BW-03 (Courtyard Piezoresistive Point)",
    ],
    soc_nagpur_vrindavan: [
      "BW-01 (Jamtha Highway Aquifer #1)",
      "BW-02 (Sector 1 Central Park Deep)",
      "BW-03 (Commercial Complex Well)",
      "BW-04 (Sector 2 Perimeter Aquifer)",
      "BW-05 (Sports Complex Deep Bore)",
      "BW-06 (South Boulevard Reserve)",
    ],
    soc_nagpur_shiv_kailasa: [
      "BW-01 (Beltarodi Basalt Transducer)",
      "BW-02 (Manish Nagar North Wing Deep)",
      "BW-03 (Tower 2 Rear Parking Point)",
      "BW-04 (South Gate Inflow Basalt)",
    ],
    soc_nagpur_sandesh_city: [
      "BW-01 (VCA Stadium Opposite Point)",
      "BW-02 (Wardha Road Expressway Well)",
      "BW-03 (Sector A Sump Basalt)",
      "BW-04 (Clubhouse Deep Aquifer)",
    ],
    soc_nagpur_empress_city: [
      "BW-01 (Cotton Market Central Basalt)",
      "BW-02 (Gandhi Sagar Inflow Aquifer)",
      "BW-03 (Tower 1 Commercial Deep Well)",
    ],
    soc_greenwood_01: [
      "PBW-01 (Koradi Road North Block)",
      "PBW-02 (Mankapur Clubhouse Borehole)",
      "PBW-03 (East Wing Deep Aquifer)",
    ],
  };

  const names = namesBySociety[societyId] || [
    "PBW-01 (North Block Deep)",
    "PBW-02 (Clubhouse Basalt Point)",
    "PBW-03 (East Wing Deep Aquifer)",
  ];

  return names.slice(0, count).map((name, idx) => ({
    id: `bw_${societyId}_${idx + 1}`,
    societyId,
    name,
    referenceDatumMsl: 312.4 + idx * 0.8,
    totalDepthMeters: 120 + idx * 15,
    casingHeightMeters: 0.85,
    safeThresholdMeters: 15.0,
    warningThresholdMeters: 20.0,
    criticalThresholdMeters: 25.0,
    sensorDeviceId: `ESP32-BW-${idx + 1}`,
    status: idx === 1 ? ("resting" as const) : ("active" as const),
    currentDepthMeters: +(18.2 + idx * 0.7 + (idx % 2 === 0 ? 0.3 : -0.4)).toFixed(2),
    swlMeters: +(16.5 + idx * 0.6).toFixed(2),
    pwlMeters: +(23.4 + idx * 0.9).toFixed(2),
    yieldLpm: 75 + idx * 12,
  }));
}

// Generate Water Availability Logs
export function getAvailabilityLogsForSociety(societyId: string): WaterAvailabilityLog[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];
  const quota = township.dailyWaterQuotaLiters;

  return [
    {
      id: `wal_${societyId}_001`,
      societyId,
      date: "2026-11-18",
      time: "06:30",
      source: "municipal",
      quantityLiters: Math.round(quota * 0.62),
      durationMinutes: 180,
      storageTankName: `${township.name.split(" ")[0]} Main Sump A`,
      shortageStatus: "adequate",
      notes: "NMC Pench gravity feeder line inflow verified by ultrasonic electromagnetic meter.",
      submittedBy: "Rajesh Shinde (NMC Operator)",
      submitterRole: "maintenance",
      isSensorVerified: true,
      createdAt: "2026-11-18T06:30:00Z",
    },
    {
      id: `wal_${societyId}_002`,
      societyId,
      date: "2026-11-18",
      time: "10:15",
      source: "borewell",
      quantityLiters: Math.round(quota * 0.26),
      durationMinutes: 120,
      storageTankName: "Deep Basalt Secondary Sump",
      shortageStatus: "adequate",
      notes: "Basalt aquifer pump cycle executed. Dynamic drawdown stable within safe threshold.",
      submittedBy: "Anil Raut (Pump Operator)",
      submitterRole: "maintenance",
      isSensorVerified: true,
      createdAt: "2026-11-18T10:15:00Z",
    },
    {
      id: `wal_${societyId}_003`,
      societyId,
      date: "2026-11-18",
      time: "14:45",
      source: "tanker",
      quantityLiters: 12000,
      durationMinutes: 45,
      storageTankName: "Gate Intake Header Sump",
      shortageStatus: "adequate",
      notes: "NMC Potable Tanker #MH-31-AP-4012 delivery cleared through gate ultrasonic flowmeter.",
      submittedBy: "Sanjay Wankhede (Estate Desk)",
      submitterRole: "admin",
      isSensorVerified: true,
      createdAt: "2026-11-18T14:45:00Z",
    },
    {
      id: `wal_${societyId}_004`,
      societyId,
      date: "2026-11-17",
      time: "06:45",
      source: "municipal",
      quantityLiters: Math.round(quota * 0.58),
      durationMinutes: 160,
      storageTankName: `${township.name.split(" ")[0]} Main Sump A`,
      shortageStatus: "adequate",
      notes: "Morning NMC supply slot received under normal domestic grid pressure.",
      submittedBy: "Rajesh Shinde (NMC Operator)",
      submitterRole: "maintenance",
      isSensorVerified: true,
      createdAt: "2026-11-17T06:45:00Z",
    },
  ];
}

// Generate Tanker Schedules
export function getTankerSchedulesForSociety(societyId: string): TankerSchedule[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];

  return [
    {
      id: `tnk_${societyId}_001`,
      societyId,
      scheduledDate: "2026-11-18",
      scheduledTimeWindow: "16:00 - 17:00",
      vendorName: "Vidarbha Water Carriers",
      tankerNumber: "MH-31-AP-4012",
      driverName: "Dinesh Meshram",
      driverPhone: "+91 98230 44551",
      sourceType: "municipal_potable",
      plannedQuantityLiters: 6000,
      actualQuantityLiters: 6000,
      status: "arrived",
      actualArrivalTime: "16:15",
      costInINR: 1200,
      confirmedBy: "Vikram Sethi (Admin)",
      notes: `Gate flowmeter verified 6,000 L intake for ${township.name}.`,
    },
    {
      id: `tnk_${societyId}_002`,
      societyId,
      scheduledDate: "2026-11-18",
      scheduledTimeWindow: "18:30 - 19:30",
      vendorName: "Orange City Pure Water Supply",
      tankerNumber: "MH-31-CB-8845",
      driverName: "Pravin Patil",
      driverPhone: "+91 97640 11982",
      sourceType: "municipal_potable",
      plannedQuantityLiters: 12000,
      status: "en_route",
      costInINR: 2300,
      notes: "Driver dispatched from Kanhan terminal; ETA 25 minutes.",
    },
    {
      id: `tnk_${societyId}_003`,
      societyId,
      scheduledDate: "2026-11-19",
      scheduledTimeWindow: "08:30 - 09:30",
      vendorName: "NMC Municipal Water Logistics",
      tankerNumber: "MH-40-Y-1122",
      driverName: "Kailash Ghorpade",
      driverPhone: "+91 98901 33442",
      sourceType: "municipal_potable",
      plannedQuantityLiters: 6000,
      status: "scheduled",
      costInINR: 1150,
      notes: "Pre-booked morning slot for overhead residential distribution.",
    },
    {
      id: `tnk_${societyId}_004`,
      societyId,
      scheduledDate: "2026-11-17",
      scheduledTimeWindow: "11:00 - 12:00",
      vendorName: "Vidarbha Water Carriers",
      tankerNumber: "MH-31-AP-9901",
      driverName: "Raju Tembhurne",
      driverPhone: "+91 98224 88761",
      sourceType: "municipal_potable",
      plannedQuantityLiters: 6000,
      actualQuantityLiters: 6000,
      status: "completed",
      actualArrivalTime: "11:20",
      costInINR: 1200,
      confirmedBy: "Ramesh Kumar (Plumber)",
      notes: "Delivered to secondary sump; clean water screening verified.",
    },
  ];
}

// Generate Rainwater Catchments
export function getRwhUnitsForSociety(societyId: string): RainwaterHarvestingUnit[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];

  return [
    {
      id: `rwh_${societyId}_001`,
      societyId,
      name: `${township.name.split(" ")[0]} Tower A Catchment`,
      buildingBlock: "Tower A & Terrace Catchment",
      roofAreaSqM: 1200,
      annualAvgRainfallMm: 1100, // Nagpur annual rainfall avg ~1,100 mm
      runoffCoefficient: 0.88,
      collectionEfficiency: 0.92,
      potentialVolumeLiters: 1067000,
      actualCollectedLiters: 890000,
      effectivenessPercent: 83.4,
      filterType: "Rainy Dual-Vortex Silt Mesh + Activated Carbon",
      storageTankCapacityLiters: 120000,
      lastInspectionDate: "2026-11-05",
      nextMaintenanceDue: "2026-12-10",
      status: "optimal",
      inspectorName: "Ramesh Kumar (Plumber)",
    },
    {
      id: `rwh_${societyId}_002`,
      societyId,
      name: "Clubhouse & Sports Center Terrace",
      buildingBlock: "Clubhouse Rooftop",
      roofAreaSqM: 850,
      annualAvgRainfallMm: 1100,
      runoffCoefficient: 0.85,
      collectionEfficiency: 0.90,
      potentialVolumeLiters: 715000,
      actualCollectedLiters: 610000,
      effectivenessPercent: 85.3,
      filterType: "Gravity Sand-Gravel Coarse Separator",
      storageTankCapacityLiters: 80000,
      lastInspectionDate: "2026-11-02",
      nextMaintenanceDue: "2026-12-05",
      status: "optimal",
      inspectorName: "Ramesh Kumar (Plumber)",
    },
    {
      id: `rwh_${societyId}_003`,
      societyId,
      name: "Podium & Garden French Drain Infiltration",
      buildingBlock: "Central Podium Ring",
      roofAreaSqM: 1600,
      annualAvgRainfallMm: 1100,
      runoffCoefficient: 0.75,
      collectionEfficiency: 0.85,
      potentialVolumeLiters: 1122000,
      actualCollectedLiters: 840000,
      effectivenessPercent: 74.8,
      filterType: "Geotextile Perforated Infiltration Recharge Pit",
      storageTankCapacityLiters: 150000,
      lastInspectionDate: "2026-10-28",
      nextMaintenanceDue: "2026-11-28",
      status: "optimal",
      inspectorName: "Vikram Sethi (Admin)",
    },
  ];
}

// Generate Leakage Reports
export function getLeakageReportsForSociety(societyId: string): LeakageReport[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];

  return [
    {
      id: `leak_${societyId}_001`,
      societyId,
      title: "Pipe Joint Weeping Near Basement Manifold",
      description: `Pressure line weeping observed near main pump manifold in ${township.name} basement. Estimated loss: ~8 Litres/hour.`,
      locationDetails: "Basement Level 1, Pump Manifold Section 3",
      buildingBlock: "Basement Level 1",
      category: "valve_fault",
      urgency: "medium",
      status: "in_progress",
      timestamp: "2026-11-18T09:15:00Z",
      submittedBy: "Aarav Patel (Resident - Block A)",
      submitterContact: "+91 98450 11223",
      assignedTechnician: "Ramesh Kumar (Plumber)",
      resolutionNotes: "Gasket replacement scheduled for 17:00 today.",
    },
    {
      id: `leak_${societyId}_002`,
      societyId,
      title: "Overhead Tank Float Valve Overflowing",
      description: "Float valve stuck in open position causing slight overflow into drain pipe.",
      locationDetails: "Tower B Overhead Sump Deck",
      buildingBlock: "Tower B Terrace",
      category: "tank_overflow",
      urgency: "high",
      status: "resolved",
      timestamp: "2026-11-17T14:30:00Z",
      submittedBy: "Priya Sharma (Resident)",
      submitterContact: "+91 97110 54321",
      assignedTechnician: "Ramesh Kumar (Plumber)",
      resolutionTimestamp: "2026-11-17T16:10:00Z",
      resolutionNotes: "Float mechanism cleaned and lubricated. Valve tested and verified shut.",
    },
    {
      id: `leak_${societyId}_003`,
      societyId,
      title: "Drip Irrigation Line Punctured in Lawn",
      description: "Minor puncture in perimeter garden drip pipe after landscaping maintenance.",
      locationDetails: "Clubhouse Perimeter Garden Bed",
      buildingBlock: "Clubhouse Ground",
      category: "pipe_burst",
      urgency: "low",
      status: "under_review",
      timestamp: "2026-11-18T11:45:00Z",
      submittedBy: "Anil Raut (Gardener)",
      submitterContact: "+91 98860 99887",
      resolutionNotes: "Under review by facility manager.",
    },
  ];
}

// Generate Water Saving Logs
export function getWaterSavingLogsForSociety(societyId: string): WaterSavingLog[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];

  return [
    {
      id: `wsl_${societyId}_001`,
      societyId,
      residentName: "Aarav Patel",
      apartmentUnit: "Block A - 402",
      activityCategory: "aerator_installed",
      activityTitle: "Fitted 3.5 LPM aerators in kitchen & bathroom taps",
      description: "Replaced 8.2 LPM standard aerators with 3.5 LPM laminar flow nozzles.",
      estimatedLitersSaved: 65,
      measuredLitersSaved: 60,
      isMeasuredByMeter: true,
      isVerifiedByAdmin: true,
      verifiedBy: "Vikram Sethi (Admin)",
      timestamp: "2026-11-18T08:30:00Z",
    },
    {
      id: `wsl_${societyId}_002`,
      societyId,
      residentName: "Priya Sharma",
      apartmentUnit: "Block B - 204",
      activityCategory: "greywater_gardening",
      activityTitle: "Diverted washing machine rinse water to balcony plants",
      description: "Reused final rinse discharge for planter boxes and balcony garden.",
      estimatedLitersSaved: 45,
      measuredLitersSaved: 40,
      isMeasuredByMeter: false,
      isVerifiedByAdmin: true,
      verifiedBy: "Vikram Sethi (Admin)",
      timestamp: "2026-11-17T17:15:00Z",
    },
    {
      id: `wsl_${societyId}_003`,
      societyId,
      residentName: "Rajesh Deshmukh",
      apartmentUnit: "Block C - 102",
      activityCategory: "leak_fixed",
      activityTitle: "Dual-flush cistern installed (3L / 6L split)",
      description: "Replaced single 10L siphon mechanism with water-efficient dual-flush unit.",
      estimatedLitersSaved: 80,
      measuredLitersSaved: 75,
      isMeasuredByMeter: true,
      isVerifiedByAdmin: true,
      verifiedBy: "Vikram Sethi (Admin)",
      timestamp: "2026-11-16T12:00:00Z",
    },
  ];
}

// Generate Community Alerts
export function getAlertsForSociety(societyId: string): AlertNotification[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === societyId) || NAGPUR_TOWNSHIPS[0];

  return [
    {
      id: `alt_${societyId}_001`,
      societyId,
      title: "Storage Sump Capacity Normal (78% Full)",
      message: `Usable water in ${township.name} central sumps is 78% full. Estimated 4.4 days of uncurtailed supply.`,
      severity: "info",
      source: "Automated Telemetry Ping",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard",
      recommendedAction: "Standard domestic consumption permitted.",
    },
    {
      id: `alt_${societyId}_002`,
      societyId,
      title: "NMC Municipal Water Inflow Confirmed",
      message: `Morning NMC Pench pipeline replenishment slot received and metered into storage.`,
      severity: "info",
      source: "Flow Transmitter Gate 1",
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      isRead: true,
      actionUrl: "/dashboard/water-availability",
      recommendedAction: "Check availability log for hourly intake rates.",
    },
    {
      id: `alt_${societyId}_003`,
      societyId,
      title: "Weekend Water Conservation Advisory",
      message: `Temperatures projected to rise to ${(township.typicalSummerTempPeak - 2).toFixed(0)}°C this weekend. Please schedule desert cooler refills in the evening.`,
      severity: "warning",
      source: "Society Admin Broadcast Console",
      timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard/ai-forecast",
      recommendedAction: "Avoid washing cars or running hose pipes on Saturday morning.",
    },
  ];
}

// Composite Aggregate Helpers for all Nagpur Townships
export function getAllSocietiesBorewells(): BorewellPoint[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getBorewellsForSociety(t.id));
}

export function getAllSocietiesAvailabilityLogs(): WaterAvailabilityLog[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getAvailabilityLogsForSociety(t.id));
}

export function getAllSocietiesTankerSchedules(): TankerSchedule[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getTankerSchedulesForSociety(t.id));
}

export function getAllSocietiesRwhUnits(): RainwaterHarvestingUnit[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getRwhUnitsForSociety(t.id));
}

export function getAllSocietiesLeakageReports(): LeakageReport[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getLeakageReportsForSociety(t.id));
}

export function getAllSocietiesWaterSavingLogs(): WaterSavingLog[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getWaterSavingLogsForSociety(t.id));
}

export function getAllSocietiesAlerts(): AlertNotification[] {
  return NAGPUR_TOWNSHIPS.flatMap((t) => getAlertsForSociety(t.id));
}

