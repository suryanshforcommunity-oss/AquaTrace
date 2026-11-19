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
import {
  getAllSocietiesBorewells,
  getAllSocietiesAvailabilityLogs,
  getAllSocietiesTankerSchedules,
  getAllSocietiesRwhUnits,
  getAllSocietiesLeakageReports,
  getAllSocietiesWaterSavingLogs,
  getAllSocietiesAlerts,
} from "@/lib/nagpurSocietyData";
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
  societyStorageMap: Record<string, number>;
  increaseSocietyStorage: (societyId: string, addedLiters: number) => void;

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

// Intelligent merge helpers to prevent refresh data loss
function mergeById<T extends { id: string }>(base: T[], overlay: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of base) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of overlay) {
    if (item && item.id) {
      if (map.has(item.id)) {
        map.set(item.id, { ...map.get(item.id)!, ...item });
      } else {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values());
}

const mergeEntityArrays = mergeById;

const statusWeight: Record<string, number> = {
  resolved: 5,
  in_progress: 4,
  forwarded: 3,
  under_review: 2,
  submitted: 1,
};

function mergeLeakageReports(base: LeakageReport[], overlay: LeakageReport[]): LeakageReport[] {
  const map = new Map<string, LeakageReport>();
  for (const item of base) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of overlay) {
    if (item && item.id) {
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, item);
      } else {
        const itemWeight = statusWeight[item.status] || 0;
        const existingWeight = statusWeight[existing.status] || 0;
        const finalStatus = itemWeight >= existingWeight ? item.status : existing.status;
        map.set(item.id, {
          ...existing,
          ...item,
          status: finalStatus,
          assignedTechnician: item.assignedTechnician || existing.assignedTechnician,
          resolutionNotes: item.resolutionNotes || existing.resolutionNotes,
          resolutionTimestamp: item.resolutionTimestamp || existing.resolutionTimestamp,
        });
      }
    }
  }
  return Array.from(map.values());
}

function mergeTankerSchedules(base: TankerSchedule[], overlay: TankerSchedule[]): TankerSchedule[] {
  const map = new Map<string, TankerSchedule>();
  for (const item of base) {
    if (item && item.id) map.set(item.id, item);
  }
  for (const item of overlay) {
    if (item && item.id) {
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, item);
      } else {
        const isCompleted = item.status === "completed" || existing.status === "completed";
        map.set(item.id, {
          ...existing,
          ...item,
          status: isCompleted ? "completed" : item.status || existing.status,
          actualQuantityLiters: item.actualQuantityLiters || existing.actualQuantityLiters,
          actualArrivalTime: item.actualArrivalTime || existing.actualArrivalTime,
        });
      }
    }
  }
  return Array.from(map.values());
}

// Safe JSON parse helper to prevent any unhandled syntax or type errors from corrupted storage
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const val = JSON.parse(raw);
    return val !== null && val !== undefined ? val : fallback;
  } catch {
    return fallback;
  }
}

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

const combinedBorewells = [...mockBorewellPoints, ...getAllSocietiesBorewells()];
const combinedAvailabilityLogs = [...mockAvailabilityLogs, ...getAllSocietiesAvailabilityLogs()];
const combinedTankerSchedules = [...mockTankerSchedules, ...getAllSocietiesTankerSchedules()];
const combinedRwhUnits = [...mockRwhUnits, ...getAllSocietiesRwhUnits()];
const combinedLeakageReports = [...mockLeakageReports, ...getAllSocietiesLeakageReports()];
const combinedWaterSavingLogs = [...mockWaterSavingLogs, ...getAllSocietiesWaterSavingLogs()];
const combinedAlerts = [...mockAlerts, ...getAllSocietiesAlerts()];

function buildDefaultSocietyStorage(): Record<string, number> {
  const initialMap: Record<string, number> = {};
  for (const soc of mockSocieties) {
    initialMap[soc.id] = Math.round((soc.usableStorageCapacityLiters || 320000) * 0.78);
  }
  return initialMap;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(defaultPlatformConfig);
  const [currentRole, setCurrentRoleState] = useState<UserRole>("resident");
  const [selectedSociety, setSelectedSocietyState] = useState<Society>(mockSocieties[0]);
  const [isEmergencyCutoffActive, setIsEmergencyCutoffActive] = useState<boolean>(false);
  const [societyStorageMap, setSocietyStorageMap] = useState<Record<string, number>>(buildDefaultSocietyStorage);

  const currentStorageLiters =
    societyStorageMap[selectedSociety.id] ??
    Math.round((selectedSociety.usableStorageCapacityLiters || 320000) * 0.78);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, role);
    } catch {}
  };

  const setSelectedSociety = (society: Society) => {
    setSelectedSocietyState(society);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}society`, JSON.stringify(society));
      const currentLevel =
        societyStorageMap[society.id] ?? Math.round((society.usableStorageCapacityLiters || 320000) * 0.78);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}storage`, currentLevel.toString());
    } catch {}
  };

  const increaseSocietyStorage = (societyId: string, addedLiters: number) => {
    const targetSoc = mockSocieties.find((s) => s.id === societyId) || selectedSociety;
    const capacity = targetSoc.usableStorageCapacityLiters || 500000;
    setSocietyStorageMap((prev) => {
      const current = prev[societyId] ?? Math.round(capacity * 0.78);
      const updatedVal = Math.min(capacity, Math.round(current + addedLiters));
      const updated = { ...prev, [societyId]: updatedVal };
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}society_storage_map`, JSON.stringify(updated));
        if (societyId === selectedSociety.id) {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}storage`, updatedVal.toString());
        }
      } catch {}
      updateStorageLevelInFirestore(societyId, updatedVal);
      return updated;
    });
  };

  const setCurrentStorageLiters = (valOrFn: number | ((prev: number) => number)) => {
    const capacity = selectedSociety.usableStorageCapacityLiters || 500000;
    setSocietyStorageMap((prev) => {
      const current = prev[selectedSociety.id] ?? Math.round(capacity * 0.78);
      const nextVal = typeof valOrFn === "function" ? valOrFn(current) : valOrFn;
      const clamped = Math.max(0, Math.min(capacity, Math.round(nextVal)));
      const updated = { ...prev, [selectedSociety.id]: clamped };
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}society_storage_map`, JSON.stringify(updated));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}storage`, clamped.toString());
      } catch {}
      updateStorageLevelInFirestore(selectedSociety.id, clamped);
      return updated;
    });
  };

  // Core entities — pre-populated with Nagpur townships data
  const [availabilityLogs, setAvailabilityLogs] = useState<WaterAvailabilityLog[]>(combinedAvailabilityLogs);
  const [tankerSchedules, setTankerSchedules] = useState<TankerSchedule[]>(combinedTankerSchedules);
  const [borewellPoints, setBorewellPoints] = useState<BorewellPoint[]>(combinedBorewells);
  const [groundwaterReadings, setGroundwaterReadings] = useState<GroundwaterReading[]>(mockGroundwaterReadings);
  const [rwhUnits, setRwhUnits] = useState<RainwaterHarvestingUnit[]>(combinedRwhUnits);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceChecklistLog[]>(mockMaintenanceLogs);
  const [leakageReports, setLeakageReports] = useState<LeakageReport[]>(combinedLeakageReports);
  const [waterSavingLogs, setWaterSavingLogs] = useState<WaterSavingLog[]>(combinedWaterSavingLogs);
  const [advisories, setAdvisories] = useState<CommunityAdvisory[]>(mockAdvisories);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(mockForumPosts);
  const [alerts, setAlerts] = useState<AlertNotification[]>(combinedAlerts);
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>(mockIoTDevices);
  const [waterQualityReadings, setWaterQualityReadings] = useState<WaterQualityReading[]>(mockWaterQualityReadings);

  // Initialize from LocalStorage immediately & merge with Backend / Firestore on mount
  useEffect(() => {
    // Phase 1: Fast local load from LocalStorage to prevent flash of default state
    try {
      const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      if (savedRole) setCurrentRoleState(savedRole as UserRole);

      let activeSoc = mockSocieties[0];
      const savedSociety = localStorage.getItem(`${STORAGE_KEY_PREFIX}society`);
      if (savedSociety) {
        activeSoc = safeJsonParse(savedSociety, mockSocieties[0]);
        setSelectedSocietyState(activeSoc);
      }

      const savedLeaks = localStorage.getItem(`${STORAGE_KEY_PREFIX}leaks`);
      if (savedLeaks) setLeakageReports(mergeLeakageReports(combinedLeakageReports, safeJsonParse(savedLeaks, [])));
      else setLeakageReports(combinedLeakageReports);

      const savedTankers = localStorage.getItem(`${STORAGE_KEY_PREFIX}tankers`);
      if (savedTankers) setTankerSchedules(mergeTankerSchedules(combinedTankerSchedules, safeJsonParse(savedTankers, [])));
      else setTankerSchedules(combinedTankerSchedules);

      const savedAvail = localStorage.getItem(`${STORAGE_KEY_PREFIX}avail`);
      if (savedAvail) setAvailabilityLogs(mergeEntityArrays(combinedAvailabilityLogs, safeJsonParse(savedAvail, [])));
      else setAvailabilityLogs(combinedAvailabilityLogs);

      const savedSavings = localStorage.getItem(`${STORAGE_KEY_PREFIX}savings`);
      if (savedSavings) setWaterSavingLogs(mergeEntityArrays(combinedWaterSavingLogs, safeJsonParse(savedSavings, [])));
      else setWaterSavingLogs(combinedWaterSavingLogs);

      const savedGW = localStorage.getItem(`${STORAGE_KEY_PREFIX}groundwater`);
      if (savedGW) setGroundwaterReadings(mergeEntityArrays(mockGroundwaterReadings, safeJsonParse(savedGW, [])));

      const savedMaintenance = localStorage.getItem(`${STORAGE_KEY_PREFIX}maintenance`);
      if (savedMaintenance) setMaintenanceLogs(mergeEntityArrays(mockMaintenanceLogs, safeJsonParse(savedMaintenance, [])));

      const savedRwh = localStorage.getItem(`${STORAGE_KEY_PREFIX}rwh`);
      if (savedRwh) setRwhUnits(mergeEntityArrays(combinedRwhUnits, safeJsonParse(savedRwh, [])));
      else setRwhUnits(combinedRwhUnits);

      const savedAlerts = localStorage.getItem(`${STORAGE_KEY_PREFIX}alerts`);
      if (savedAlerts) setAlerts(mergeEntityArrays(combinedAlerts, safeJsonParse(savedAlerts, [])));
      else setAlerts(combinedAlerts);

      const savedStorageMap = localStorage.getItem(`${STORAGE_KEY_PREFIX}society_storage_map`);
      if (savedStorageMap) {
        const parsedMap = safeJsonParse<Record<string, number> | null>(savedStorageMap, null);
        if (parsedMap && typeof parsedMap === "object" && !Array.isArray(parsedMap)) {
          setSocietyStorageMap((prev) => ({ ...prev, ...parsedMap }));
        }
      } else {
        const savedStorage = localStorage.getItem(`${STORAGE_KEY_PREFIX}storage`);
        if (savedStorage) {
          const parsedNum = Number(savedStorage);
          if (!isNaN(parsedNum) && parsedNum > 0) {
            setSocietyStorageMap((prev) => ({ ...prev, [activeSoc.id]: parsedNum }));
          }
        }
      }

      const savedEmergency = localStorage.getItem(`${STORAGE_KEY_PREFIX}emergency`);
      if (savedEmergency !== null) setIsEmergencyCutoffActive(savedEmergency === "true");

      const savedQuality = localStorage.getItem(`${STORAGE_KEY_PREFIX}quality`);
      if (savedQuality) setWaterQualityReadings(safeJsonParse(savedQuality, mockWaterQualityReadings));

      const savedForum = localStorage.getItem(`${STORAGE_KEY_PREFIX}forum`);
      if (savedForum) setForumPosts(safeJsonParse(savedForum, mockForumPosts));
    } catch (e) {
      console.warn("LocalStorage initial read notice:", e);
    }

    // Phase 2: Fetch and intelligently MERGE backend data (never clobbering resolved/saved state)
    async function initFromBackend() {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const db = await res.json();
          if (db.leakageReports) {
            setLeakageReports((prev) => {
              const merged = mergeLeakageReports(db.leakageReports, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}leaks`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.tankerSchedules) {
            setTankerSchedules((prev) => {
              const merged = mergeTankerSchedules(db.tankerSchedules, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}tankers`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.availabilityLogs) {
            setAvailabilityLogs((prev) => {
              const merged = mergeById(db.availabilityLogs, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}avail`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.waterSavingLogs) {
            setWaterSavingLogs((prev) => {
              const merged = mergeById(db.waterSavingLogs, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}savings`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.groundwaterReadings) {
            setGroundwaterReadings((prev) => {
              const merged = mergeById(db.groundwaterReadings, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}groundwater`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.maintenanceLogs) {
            setMaintenanceLogs((prev) => {
              const merged = mergeById(db.maintenanceLogs, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}maintenance`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.rwhUnits) {
            setRwhUnits((prev) => {
              const merged = mergeById(db.rwhUnits, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}rwh`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.waterQualityReadings) {
            setWaterQualityReadings((prev) => {
              const merged = mergeById(db.waterQualityReadings, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}quality`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.forumPosts) {
            setForumPosts((prev) => {
              const merged = mergeById(db.forumPosts, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}forum`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.alerts) {
            setAlerts((prev) => {
              const merged = mergeById(db.alerts, prev);
              try { localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(merged)); } catch {}
              return merged;
            });
          }
          if (db.borewellPoints) setBorewellPoints(db.borewellPoints);
          if (db.advisories) setAdvisories(db.advisories);
          if (db.iotDevices) setIotDevices(db.iotDevices);
          if (db.config) setConfig(db.config);
        }
      } catch (err) {
        console.warn("Could not fetch from /api/data, using local store:", err);
      }

      // Phase 3: Hydrate & merge from Firebase Cloud Firestore
      try {
        const [
          remoteAlerts,
          remoteLeaks,
          remoteTankers,
          remoteAvail,
          remoteSavings,
          remoteGW,
          remoteQuality,
          remotePosts,
        ] = await Promise.all([
          fetchCollectionFromFirestore<AlertNotification>("notifications", 30),
          fetchCollectionFromFirestore<LeakageReport>("leakage_reports", 30),
          fetchCollectionFromFirestore<TankerSchedule>("tanker_schedules", 30),
          fetchCollectionFromFirestore<WaterAvailabilityLog>("availability_logs", 30),
          fetchCollectionFromFirestore<WaterSavingLog>("water_saving_logs", 30),
          fetchCollectionFromFirestore<GroundwaterReading>("groundwater_readings", 30),
          fetchCollectionFromFirestore<WaterQualityReading>("water_quality_readings", 30),
          fetchCollectionFromFirestore<ForumPost>("forum_posts", 30),
        ]);

        if (remoteLeaks && remoteLeaks.length > 0) {
          setLeakageReports((prev) => {
            const merged = mergeLeakageReports(prev, remoteLeaks);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}leaks`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteTankers && remoteTankers.length > 0) {
          setTankerSchedules((prev) => {
            const merged = mergeTankerSchedules(prev, remoteTankers);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}tankers`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteAvail && remoteAvail.length > 0) {
          setAvailabilityLogs((prev) => {
            const merged = mergeById(prev, remoteAvail);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}avail`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteSavings && remoteSavings.length > 0) {
          setWaterSavingLogs((prev) => {
            const merged = mergeById(prev, remoteSavings);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}savings`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteGW && remoteGW.length > 0) {
          setGroundwaterReadings((prev) => {
            const merged = mergeById(prev, remoteGW);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}groundwater`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteQuality && remoteQuality.length > 0) {
          setWaterQualityReadings((prev) => {
            const merged = mergeById(prev, remoteQuality);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}quality`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remotePosts && remotePosts.length > 0) {
          setForumPosts((prev) => {
            const merged = mergeById(prev, remotePosts);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}forum`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
        if (remoteAlerts && remoteAlerts.length > 0) {
          setAlerts((prev) => {
            const merged = mergeById(prev, remoteAlerts);
            try { localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } catch (fbErr) {
        console.warn("Firestore sync notice (offline or test):", fbErr);
      }
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

  // Emergency Cutoff (Strictly Restricted to Administrator)
  const toggleEmergencyCutoff = () => {
    if (currentRole !== "admin") {
      alert("Permission Denied: Only Society Administrators can toggle the Emergency Master Valve Isolation.");
      return;
    }

    setIsEmergencyCutoffActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}emergency`, String(next));
      } catch {}
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

    // Dynamically increase stored water for target society
    const addedLiters = Number(newEntry.quantityLiters) || 0;
    const targetSocietyId = newEntry.societyId || selectedSociety.id;
    increaseSocietyStorage(targetSocietyId, addedLiters);

    // Automatic Notification Alert
    triggerAlert({
      societyId: targetSocietyId,
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
      societyId: newEntry.societyId || selectedSociety.id,
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
    let targetSocietyId = selectedSociety.id;
    let confirmedTanker: TankerSchedule | null = null;

    setTankerSchedules((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          vendorName = item.vendorName;
          tankerNum = item.tankerNumber;
          if (item.societyId) targetSocietyId = item.societyId;
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

    // Also automatically log into Daily Water Availability for that specific society!
    addAvailabilityLog({
      societyId: targetSocietyId,
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
    setRwhUnits((prev) => {
      const updated = [...prev, newEntry];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}rwh`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToBackend("add_rwh_unit", newEntry);
  };

  const addMaintenanceLog = (log: Omit<MaintenanceChecklistLog, "id">) => {
    const newEntry: MaintenanceChecklistLog = {
      ...log,
      id: `mnt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };

    setMaintenanceLogs((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}maintenance`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update parent RWH status
    setRwhUnits((prev) => {
      const updated: RainwaterHarvestingUnit[] = prev.map((u) =>
        u.id === log.unitId
          ? {
              ...u,
              lastInspectionDate: log.inspectionDate,
              status: log.overallStatus === "passed" ? "optimal" : "maintenance_due",
            }
          : u
      );
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}rwh`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

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
    let resolvedItem: LeakageReport | null = null;
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
          resolvedItem = mod;
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

    syncToBackend("update_leakage_status", { id, status, technician, notes, report: resolvedItem });
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
    setForumPosts((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}forum`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

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
    setForumPosts((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}forum`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToBackend("upvote_post", { id });
  };

  // Alerts
  const markAlertRead = (id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((item) => (id === "all" || item.id === id ? { ...item, isRead: true } : item));
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToBackend("mark_alert_read", { id });
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToBackend("dismiss_alert", { id });
  };

  const triggerAlert = (alert: Omit<AlertNotification, "id" | "timestamp" | "isRead">) => {
    const newEntry: AlertNotification = {
      ...alert,
      id: `alt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setAlerts((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
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
    setWaterQualityReadings((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}quality`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

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
    setSocietyStorageMap(buildDefaultSocietyStorage());
    setAvailabilityLogs(combinedAvailabilityLogs);
    setTankerSchedules(combinedTankerSchedules);
    setBorewellPoints(combinedBorewells);
    setGroundwaterReadings(mockGroundwaterReadings);
    setRwhUnits(combinedRwhUnits);
    setMaintenanceLogs(mockMaintenanceLogs);
    setLeakageReports(combinedLeakageReports);
    setWaterSavingLogs(combinedWaterSavingLogs);
    setAlerts(combinedAlerts);
    setWaterQualityReadings(mockWaterQualityReadings);
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
        societyStorageMap,
        increaseSocietyStorage,
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
