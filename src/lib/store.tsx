"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  saveNotificationToFirestore,
  saveAvailabilityLogToFirestore,
  saveTankerScheduleToFirestore,
  saveLeakageReportToFirestore,
  saveGroundwaterReadingToFirestore,
  saveWaterSavingLogToFirestore,
  saveWaterQualityToFirestore,
  saveForumPostToFirestore,
  updateStorageLevelInFirestore,
  fetchCollectionFromFirestore,
} from "@/lib/firebase";
import {
  UserRole,
  Society,
  WaterAvailabilityLog,
  TankerSchedule,
  BorewellPoint,
  GroundwaterReading,
  RainwaterHarvestingUnit,
  MaintenanceChecklistLog,
  LeakageReport,
  WaterSavingLog,
  CommunityAdvisory,
  ForumPost,
  AlertNotification,
  IoTDevice,
  WaterQualityReading,
} from "@/types";
import {
  mockSocieties,
  mockAvailabilityLogs,
  mockTankerSchedules,
  mockBorewellPoints,
  mockGroundwaterReadings,
  mockRwhUnits,
  mockMaintenanceLogs,
  mockLeakageReports,
  mockWaterSavingLogs,
  mockAdvisories,
  mockForumPosts,
  mockAlerts,
  mockIoTDevices,
  mockWaterQualityReadings,
} from "@/lib/mockData";
import { defaultPlatformConfig, PlatformConfig } from "@/lib/config";

interface AppContextType {
  // Config & Role
  config: PlatformConfig;
  updateConfig: (updates: Partial<PlatformConfig>) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedSociety: Society;
  setSelectedSociety: (society: Society) => void;
  allSocieties: Society[];

  // Emergency Valve State
  isEmergencyCutoffActive: boolean;
  toggleEmergencyCutoff: () => void;

  // Live Storage
  currentStorageLiters: number;
  setCurrentStorageLiters: (val: number | ((prev: number) => number)) => void;

  // Water Availability
  availabilityLogs: WaterAvailabilityLog[];
  addAvailabilityLog: (log: Omit<WaterAvailabilityLog, "id" | "createdAt">) => void;

  // Tanker Management
  tankerSchedules: TankerSchedule[];
  addTankerSchedule: (schedule: Omit<TankerSchedule, "id">) => void;
  confirmTankerArrival: (id: string, actualLiters: number, notes?: string) => void;
  updateTankerStatus: (id: string, status: TankerSchedule["status"]) => void;

  // Groundwater
  borewellPoints: BorewellPoint[];
  groundwaterReadings: GroundwaterReading[];
  addGroundwaterReading: (reading: Omit<GroundwaterReading, "id" | "timestamp">) => void;

  // Rainwater Harvesting
  rwhUnits: RainwaterHarvestingUnit[];
  maintenanceLogs: MaintenanceChecklistLog[];
  addRwhUnit: (unit: Omit<RainwaterHarvestingUnit, "id">) => void;
  addMaintenanceLog: (log: Omit<MaintenanceChecklistLog, "id">) => void;

  // Leakage Reports
  leakageReports: LeakageReport[];
  addLeakageReport: (report: Omit<LeakageReport, "id" | "timestamp" | "status">) => void;
  updateLeakageStatus: (id: string, status: LeakageReport["status"], technician?: string, notes?: string) => void;
  forwardLeakageToUtility: (id: string, channel: LeakageReport["forwardedUtilityChannel"]) => void;

  // Community Conservation
  waterSavingLogs: WaterSavingLog[];
  addWaterSavingLog: (log: Omit<WaterSavingLog, "id" | "timestamp" | "isVerifiedByAdmin">) => void;
  verifyWaterSavingLog: (id: string, adminName: string) => void;

  // Advisories & Forum
  advisories: CommunityAdvisory[];
  forumPosts: ForumPost[];
  addForumPost: (post: Omit<ForumPost, "id" | "timestamp" | "upvotes" | "repliesCount">) => void;
  upvoteForumPost: (id: string) => void;

  // Alerts & Notifications
  alerts: AlertNotification[];
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  triggerAlert: (alert: Omit<AlertNotification, "id" | "timestamp" | "isRead">) => void;

  // IoT Devices & Quality
  iotDevices: IoTDevice[];
  waterQualityReadings: WaterQualityReading[];
  addWaterQualityReading: (reading: Omit<WaterQualityReading, "id" | "timestamp">) => void;
  ingestDeviceTelemetry: (reading: {
    deviceId: string;
    measurementPointId: string;
    measurementType: string;
    value: number;
    unit: string;
  }) => void;

  // Global reset
  resetToSeedData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "aquatrace_v2_";

// Helper function to sync mutations to the local backend API
async function syncToBackend(action: string, data: any) {
  try {
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    }).catch((e) => console.warn("Backend sync notice:", e));
  } catch (err) {
    console.warn("Backend sync failed:", err);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(defaultPlatformConfig);
  const [currentRole, setCurrentRoleState] = useState<UserRole>("resident");
  const [selectedSociety, setSelectedSociety] = useState<Society>(mockSocieties[0]);
  const [isEmergencyCutoffActive, setIsEmergencyCutoffActive] = useState<boolean>(false);
  const [currentStorageLiters, setCurrentStorageLiters] = useState<number>(142500);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
    } catch {}
  };

  // Core entities
  const [availabilityLogs, setAvailabilityLogs] = useState<WaterAvailabilityLog[]>(mockAvailabilityLogs);
  const [tankerSchedules, setTankerSchedules] = useState<TankerSchedule[]>(mockTankerSchedules);
  const [borewellPoints, setBorewellPoints] = useState<BorewellPoint[]>(mockBorewellPoints);
  const [groundwaterReadings, setGroundwaterReadings] = useState<GroundwaterReading[]>(mockGroundwaterReadings);
  const [rwhUnits, setRwhUnits] = useState<RainwaterHarvestingUnit[]>(mockRwhUnits);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceChecklistLog[]>(mockMaintenanceLogs);
  const [leakageReports, setLeakageReports] = useState<LeakageReport[]>(mockLeakageReports);
  const [waterSavingLogs, setWaterSavingLogs] = useState<WaterSavingLog[]>(mockWaterSavingLogs);
  const [advisories, setAdvisories] = useState<CommunityAdvisory[]>(mockAdvisories);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(mockForumPosts);
  const [alerts, setAlerts] = useState<AlertNotification[]>(mockAlerts);
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>(mockIoTDevices);
  const [waterQualityReadings, setWaterQualityReadings] = useState<WaterQualityReading[]>(mockWaterQualityReadings);

  // Initialize from Local Backend / LocalStorage on mount
  useEffect(() => {
    async function initFromBackend() {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const db = await res.json();
          if (db.availabilityLogs) setAvailabilityLogs(db.availabilityLogs);
          if (db.tankerSchedules) setTankerSchedules(db.tankerSchedules);
          if (db.borewellPoints) setBorewellPoints(db.borewellPoints);
          if (db.groundwaterReadings) setGroundwaterReadings(db.groundwaterReadings);
          if (db.rwhUnits) setRwhUnits(db.rwhUnits);
          if (db.maintenanceLogs) setMaintenanceLogs(db.maintenanceLogs);
          if (db.leakageReports) setLeakageReports(db.leakageReports);
          if (db.waterSavingLogs) setWaterSavingLogs(db.waterSavingLogs);
          if (db.alerts) setAlerts(db.alerts);
          if (db.advisories) setAdvisories(db.advisories);
          if (db.forumPosts) setForumPosts(db.forumPosts);
          if (db.iotDevices) setIotDevices(db.iotDevices);
          if (db.waterQualityReadings) setWaterQualityReadings(db.waterQualityReadings);
          if (db.currentStorageLiters !== undefined) setCurrentStorageLiters(db.currentStorageLiters);
          if (db.isEmergencyCutoffActive !== undefined) setIsEmergencyCutoffActive(db.isEmergencyCutoffActive);
          if (db.config) setConfig(db.config);
          return;
        }
      } catch (err) {
        console.warn("Could not fetch from /api/data, using local store:", err);
      }

      // Fallback to LocalStorage
      try {
        const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
        if (savedRole) setCurrentRoleState(savedRole as UserRole);

        const savedLeaks = localStorage.getItem(`${STORAGE_KEY_PREFIX}leaks`);
        if (savedLeaks) setLeakageReports(JSON.parse(savedLeaks));

        const savedSavings = localStorage.getItem(`${STORAGE_KEY_PREFIX}savings`);
        if (savedSavings) setWaterSavingLogs(JSON.parse(savedSavings));

        const savedTankers = localStorage.getItem(`${STORAGE_KEY_PREFIX}tankers`);
        if (savedTankers) setTankerSchedules(JSON.parse(savedTankers));

        const savedGW = localStorage.getItem(`${STORAGE_KEY_PREFIX}groundwater`);
        if (savedGW) setGroundwaterReadings(JSON.parse(savedGW));

        const savedAvail = localStorage.getItem(`${STORAGE_KEY_PREFIX}avail`);
        if (savedAvail) setAvailabilityLogs(JSON.parse(savedAvail));

        const savedStorage = localStorage.getItem(`${STORAGE_KEY_PREFIX}storage`);
        if (savedStorage) setCurrentStorageLiters(Number(savedStorage));
      } catch {}

      // Hydrate alerts from Firestore if available
      try {
        const remoteAlerts = await fetchCollectionFromFirestore<AlertNotification>("notifications", 20);
        if (remoteAlerts && remoteAlerts.length > 0) {
          setAlerts((prev) => {
            const seen = new Set(prev.map((a) => a.id));
            const newOnes = remoteAlerts.filter((a) => a && a.id && !seen.has(a.id));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }
      } catch {}
    }

    initFromBackend();
  }, []);

  // Update Config
  const updateConfig = (updates: Partial<PlatformConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...updates };
      syncToBackend("update_config", updated);
      return updated;
    });
  };

  // Emergency Cutoff
  const toggleEmergencyCutoff = () => {
    setIsEmergencyCutoffActive((prev) => {
      const next = !prev;
      triggerAlert({
        societyId: selectedSociety.id,
        title: next ? "EMERGENCY MAIN VALVE CUTOFF ENGAGED" : "Emergency Main Valve Re-opened",
        message: next
          ? "All motorized outflow valves to Basement and Tower distribution lines have been isolated by Administrator."
          : "Motorized gate valves restored to standard pressure telemetry.",
        severity: next ? "danger" : "info",
        source: "Manual Safety Interlock",
        recommendedAction: next ? "Inspect basement sensors before re-opening valves." : "Monitor line pressure.",
      });
      syncToBackend("toggle_emergency", {});
      return next;
    });
  };

  // Add Availability Log
  const addAvailabilityLog = (log: Omit<WaterAvailabilityLog, "id" | "createdAt">) => {
    const newEntry: WaterAvailabilityLog = {
      ...log,
      id: `wal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    setAvailabilityLogs((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}avail`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Dynamically increase stored water
    const addedLiters = Number(newEntry.quantityLiters) || 0;
    setCurrentStorageLiters((prev) => {
      const nextVal = Math.min(240000, prev + addedLiters);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}storage`, String(nextVal));
      } catch {}
      updateStorageLevelInFirestore(selectedSociety.id, nextVal);
      return nextVal;
    });

    // Automatic Notification Alert
    triggerAlert({
      societyId: selectedSociety.id,
      title: `Water Intake Logged: +${newEntry.quantityLiters.toLocaleString()} L`,
      message: `${newEntry.source.toUpperCase()} supply recorded into ${newEntry.storageTankName} by ${newEntry.submittedBy}. Sump storage updated.`,
      severity: newEntry.shortageStatus === "low" || newEntry.shortageStatus === "critical" ? "warning" : "info",
      source: "Water Ledger Inflow Desk",
      recommendedAction: "Review daily balance vs demand quota in overview dashboard.",
      actionUrl: "/dashboard/water-availability",
    });

    syncToBackend("add_availability_log", newEntry);
    saveAvailabilityLogToFirestore(newEntry);
  };

  // Tanker Management
  const addTankerSchedule = (schedule: Omit<TankerSchedule, "id">) => {
    const newEntry: TankerSchedule = {
      ...schedule,
      id: `tnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };

    setTankerSchedules((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}tankers`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    triggerAlert({
      societyId: selectedSociety.id,
      title: `Tanker Scheduled: ${newEntry.vendorName}`,
      message: `${newEntry.plannedQuantityLiters.toLocaleString()} L planned for arrival during ${newEntry.scheduledTimeWindow} (${newEntry.tankerNumber}).`,
      severity: "info",
      source: "Water Procurement Desk",
      recommendedAction: "Security personnel to verify tanker volume and seal at gate.",
      actionUrl: "/dashboard/tanker",
    });

    syncToBackend("add_tanker", newEntry);
    saveTankerScheduleToFirestore(newEntry);
  };

  const confirmTankerArrival = (id: string, actualLiters: number, notes?: string) => {
    let vendorName = "Private Tanker";
    let tankerNum = "KA-01";
    let confirmedTanker: TankerSchedule | null = null;

    setTankerSchedules((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          vendorName = item.vendorName;
          tankerNum = item.tankerNumber;
          confirmedTanker = {
            ...item,
            actualQuantityLiters: actualLiters,
            status: "completed" as const,
            actualArrivalTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            confirmedBy: "Vikram Sethi (Admin Verified)",
            notes: notes || item.notes,
          };
          return confirmedTanker;
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}tankers`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (confirmedTanker) {
      saveTankerScheduleToFirestore(confirmedTanker);
    }

    // Also automatically log into Daily Water Availability!
    addAvailabilityLog({
      societyId: selectedSociety.id,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      source: "tanker",
      quantityLiters: actualLiters,
      durationMinutes: 45,
      storageTankName: "Underground Sump 2 (Auxiliary Buffer)",
      shortageStatus: "adequate",
      notes: `Gate delivery verified: ${vendorName} (${tankerNum}). ${notes || "Flowmeter verified"}`,
      submittedBy: "Verified Gate Flowmeter",
      submitterRole: "admin",
      isSensorVerified: true,
    });

    triggerAlert({
      societyId: selectedSociety.id,
      title: `Tanker Delivery Verified: +${actualLiters.toLocaleString()} L`,
      message: `Delivery from ${vendorName} (${tankerNum}) verified by gate flowmeter. Storage updated.`,
      severity: "success",
      source: "Gate Flowmeter Verification",
      recommendedAction: "Inspect water clarity and chlorine level in auxiliary sump.",
      actionUrl: "/dashboard/tanker",
    });

    syncToBackend("confirm_tanker", { id, actualLiters, notes });
  };

  const updateTankerStatus = (id: string, status: TankerSchedule["status"]) => {
    setTankerSchedules((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const mod = { ...item, status };
          saveTankerScheduleToFirestore(mod);
          return mod;
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}tankers`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToBackend("confirm_tanker", { id, status });
  };

  // Groundwater
  const addGroundwaterReading = (reading: Omit<GroundwaterReading, "id" | "timestamp">) => {
    const newEntry: GroundwaterReading = {
      ...reading,
      id: `gwr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };

    setGroundwaterReadings((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}groundwater`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Also update current depth on the selected borewell point
    setBorewellPoints((prev) =>
      prev.map((bw) =>
        bw.id === reading.borewellId
          ? { ...bw, currentDepthMeters: reading.depthMeters, swlMeters: reading.depthMeters }
          : bw
      )
    );

    // If depth is critical or caution, trigger notification
    if (newEntry.depthMeters >= 18.0) {
      triggerAlert({
        societyId: selectedSociety.id,
        title: `Borewell Depth Caution: ${newEntry.depthMeters}m Below Datum`,
        message: `Static water level in Borewell has dropped to ${newEntry.depthMeters}m. Alternating resting cycle recommended.`,
        severity: newEntry.depthMeters >= 20 ? "danger" : "warning",
        source: "Hydrological Piezometer Sensor",
        recommendedAction: "Activate alternating resting cycle and switch load to municipal storage.",
        actionUrl: "/dashboard/groundwater",
      });
    } else {
      triggerAlert({
        societyId: selectedSociety.id,
        title: `Groundwater Logged: ${newEntry.depthMeters}m Below Casing`,
        message: `Manual acoustic dip-tape verified by ${newEntry.reportedBy}. Level within safe aquifer zone.`,
        severity: "info",
        source: "Community Aquifer Ground Truth",
        actionUrl: "/dashboard/groundwater",
      });
    }

    syncToBackend("add_groundwater", newEntry);
    saveGroundwaterReadingToFirestore(newEntry);
  };

  // Rainwater
  const addRwhUnit = (unit: Omit<RainwaterHarvestingUnit, "id">) => {
    const newEntry: RainwaterHarvestingUnit = {
      ...unit,
      id: `rwh_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    setRwhUnits((prev) => [...prev, newEntry]);
    syncToBackend("add_rwh_unit", newEntry);
  };

  const addMaintenanceLog = (log: Omit<MaintenanceChecklistLog, "id">) => {
    const newEntry: MaintenanceChecklistLog = {
      ...log,
      id: `mnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };

    setMaintenanceLogs((prev) => [newEntry, ...prev]);

    // Update parent RWH status
    setRwhUnits((prev) =>
      prev.map((u) =>
        u.id === log.unitId
          ? {
              ...u,
              lastInspectionDate: log.inspectionDate,
              status: log.overallStatus === "passed" ? "optimal" : "maintenance_due",
            }
          : u
      )
    );

    triggerAlert({
      societyId: selectedSociety.id,
      title: `RWH Maintenance Logged: ${newEntry.overallStatus.toUpperCase()}`,
      message: `Inspection recorded by ${newEntry.inspectorName}. First-flush diverters & filters cleaned.`,
      severity: newEntry.overallStatus === "passed" ? "success" : "warning",
      source: "RWH Maintenance Ledger",
      actionUrl: "/dashboard/rainwater",
    });

    syncToBackend("add_maintenance_log", newEntry);
  };

  // Leakage Reports
  const addLeakageReport = (report: Omit<LeakageReport, "id" | "timestamp" | "status">) => {
    const newEntry: LeakageReport = {
      ...report,
      id: `leak_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      status: "submitted",
    };

    setLeakageReports((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}leaks`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Trigger high-urgency alert
    triggerAlert({
      societyId: selectedSociety.id,
      title: `New Leakage Report: ${report.title}`,
      message: `${report.locationDetails} (${report.urgency.toUpperCase()} URGENCY) reported by ${report.submittedBy}.`,
      severity: report.urgency === "critical" || report.urgency === "high" ? "danger" : "warning",
      source: "Community Resident Portal",
      recommendedAction: "Review issue details and dispatch maintenance team to isolate pipe.",
      actionUrl: "/dashboard/leakage",
    });

    syncToBackend("add_leakage", newEntry);
    saveLeakageReportToFirestore(newEntry);
  };

  const updateLeakageStatus = (
    id: string,
    status: LeakageReport["status"],
    technician?: string,
    notes?: string
  ) => {
    setLeakageReports((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const mod = {
            ...item,
            status,
            assignedTechnician: technician || item.assignedTechnician,
            resolutionTimestamp: status === "resolved" ? new Date().toISOString() : item.resolutionTimestamp,
            resolutionNotes: notes || item.resolutionNotes,
          };
          saveLeakageReportToFirestore(mod);
          return mod;
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}leaks`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (status === "resolved") {
      triggerAlert({
        societyId: selectedSociety.id,
        title: `Leakage Resolved & Verified`,
        message: `Plumbing issue #${id} has been repaired by ${technician || "Maintenance"} and tested for line integrity.`,
        severity: "success",
        source: "Technician Dispatch Desk",
        actionUrl: "/dashboard/leakage",
      });
    }

    syncToBackend("update_leakage_status", { id, status, technician, notes });
  };

  const forwardLeakageToUtility = (
    id: string,
    channel: LeakageReport["forwardedUtilityChannel"] = "BWSSB Official Portal"
  ) => {
    const refNum = `BWSSB-ESC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setLeakageReports((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const mod = {
            ...item,
            status: "forwarded" as const,
            forwardedUtilityChannel: channel,
            utilityReferenceNumber: refNum,
            forwardedTimestamp: new Date().toISOString(),
          };
          saveLeakageReportToFirestore(mod);
          return mod;
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}leaks`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    triggerAlert({
      societyId: selectedSociety.id,
      title: `Report Forwarded to Public Utility: Ref #${refNum}`,
      message: `Leakage complaint officially forwarded to ${channel}. Tracking docket generated.`,
      severity: "info",
      source: "Public Utility Integration Bridge",
      recommendedAction: "Monitor docket resolution status with municipal department.",
      actionUrl: "/dashboard/leakage",
    });

    syncToBackend("forward_leakage", { id, channel });
  };

  // Water Saving
  const addWaterSavingLog = (
    log: Omit<WaterSavingLog, "id" | "timestamp" | "isVerifiedByAdmin">
  ) => {
    const newEntry: WaterSavingLog = {
      ...log,
      id: `wsl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isVerifiedByAdmin: currentRole === "admin",
      verifiedBy: currentRole === "admin" ? "Vikram Sethi (Admin)" : undefined,
    };

    setWaterSavingLogs((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}savings`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    triggerAlert({
      societyId: selectedSociety.id,
      title: `Water Saving Logged: +${(newEntry.measuredLitersSaved || newEntry.estimatedLitersSaved).toLocaleString()} L`,
      message: `${newEntry.residentName} (${newEntry.apartmentUnit}) logged: ${newEntry.activityTitle}. Added to leaderboard.`,
      severity: "success",
      source: "Community Conservation Hub",
      actionUrl: "/dashboard/conservation",
    });

    syncToBackend("add_water_saving", newEntry);
    saveWaterSavingLogToFirestore(newEntry);
  };

  const verifyWaterSavingLog = (id: string, adminName: string) => {
    setWaterSavingLogs((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const mod = {
            ...item,
            isVerifiedByAdmin: true,
            verifiedBy: adminName,
          };
          saveWaterSavingLogToFirestore(mod);
          return mod;
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}savings`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    syncToBackend("verify_water_saving", { id, adminName });
  };

  // Forum & Advisory
  const addForumPost = (post: Omit<ForumPost, "id" | "timestamp" | "upvotes" | "repliesCount">) => {
    const newEntry: ForumPost = {
      ...post,
      id: `fp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      upvotes: 1,
      repliesCount: 0,
    };
    setForumPosts((prev) => [newEntry, ...prev]);

    triggerAlert({
      societyId: selectedSociety.id,
      title: `New Discussion: ${newEntry.title}`,
      message: `${newEntry.authorName} posted a conservation tip: "${newEntry.title.substring(0, 50)}..."`,
      severity: "info",
      source: "Community Best-Practice Forum",
      actionUrl: "/dashboard/conservation",
    });

    syncToBackend("add_forum_post", newEntry);
    saveForumPostToFirestore(newEntry);
  };

  const upvoteForumPost = (id: string) => {
    setForumPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );
    syncToBackend("upvote_post", { id });
  };

  // Alerts
  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) => (id === "all" || item.id === id ? { ...item, isRead: true } : item))
    );
    syncToBackend("mark_alert_read", { id });
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
    syncToBackend("dismiss_alert", { id });
  };

  const triggerAlert = (alert: Omit<AlertNotification, "id" | "timestamp" | "isRead">) => {
    const newEntry: AlertNotification = {
      ...alert,
      id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setAlerts((prev) => [newEntry, ...prev]);
    syncToBackend("trigger_alert", newEntry);
    saveNotificationToFirestore(newEntry);
  };

  // IoT Devices & Quality
  const addWaterQualityReading = (reading: Omit<WaterQualityReading, "id" | "timestamp">) => {
    const newEntry: WaterQualityReading = {
      ...reading,
      id: `wq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    setWaterQualityReadings((prev) => [newEntry, ...prev]);

    triggerAlert({
      societyId: selectedSociety.id,
      title: `Water Quality Sample Logged`,
      message: `${newEntry.measurementPoint}: TDS ${newEntry.tdsPpm} ppm · Turbidity ${newEntry.turbidityNtu} NTU · pH ${newEntry.ph}.`,
      severity: newEntry.status === "abnormal_range" ? "warning" : "info",
      source: "Water Quality Potability Lab",
      actionUrl: "/dashboard/water-quality",
    });

    syncToBackend("add_water_quality", newEntry);
    saveWaterQualityToFirestore(newEntry);
  };

  const ingestDeviceTelemetry = (reading: {
    deviceId: string;
    measurementPointId: string;
    measurementType: string;
    value: number;
    unit: string;
  }) => {
    setIotDevices((prev) =>
      prev.map((dev) =>
        dev.id === reading.deviceId
          ? {
              ...dev,
              lastPing: "Just now",
              currentReading: {
                value: reading.value,
                unit: reading.unit,
                type: reading.measurementType,
              },
            }
          : dev
      )
    );

    if (reading.measurementType === "groundwater_depth") {
      addGroundwaterReading({
        societyId: selectedSociety.id,
        borewellId: reading.measurementPointId || "bw_02",
        depthMeters: reading.value,
        waterElevationMsl: +(920.4 - reading.value).toFixed(2),
        source: "iot_transducer",
        reportedBy: `IoT Gateway Node (${reading.deviceId})`,
        status: "calibrated",
        notes: "Real-time automated ingest packet.",
      });
    }
  };

  // Reset
  const resetToSeedData = () => {
    try {
      localStorage.clear();
    } catch {}
    setAvailabilityLogs(mockAvailabilityLogs);
    setTankerSchedules(mockTankerSchedules);
    setBorewellPoints(mockBorewellPoints);
    setGroundwaterReadings(mockGroundwaterReadings);
    setRwhUnits(mockRwhUnits);
    setMaintenanceLogs(mockMaintenanceLogs);
    setLeakageReports(mockLeakageReports);
    setWaterSavingLogs(mockWaterSavingLogs);
    setAlerts(mockAlerts);
    setWaterQualityReadings(mockWaterQualityReadings);
    setCurrentStorageLiters(142500);
    setCurrentRoleState("resident");
    syncToBackend("reset", {});
  };

  return (
    <AppContext.Provider
      value={{
        config,
        updateConfig,
        currentRole,
        setCurrentRole,
        selectedSociety,
        setSelectedSociety,
        allSocieties: mockSocieties,
        isEmergencyCutoffActive,
        toggleEmergencyCutoff,
        currentStorageLiters,
        setCurrentStorageLiters,
        availabilityLogs,
        addAvailabilityLog,
        tankerSchedules,
        addTankerSchedule,
        confirmTankerArrival,
        updateTankerStatus,
        borewellPoints,
        groundwaterReadings,
        addGroundwaterReading,
        rwhUnits,
        maintenanceLogs,
        addRwhUnit,
        addMaintenanceLog,
        leakageReports,
        addLeakageReport,
        updateLeakageStatus,
        forwardLeakageToUtility,
        waterSavingLogs,
        addWaterSavingLog,
        verifyWaterSavingLog,
        advisories,
        forumPosts,
        addForumPost,
        upvoteForumPost,
        alerts,
        markAlertRead,
        dismissAlert,
        triggerAlert,
        iotDevices,
        waterQualityReadings,
        addWaterQualityReading,
        ingestDeviceTelemetry,
        resetToSeedData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
