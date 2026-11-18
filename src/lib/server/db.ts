import fs from "fs";
import path from "path";
import os from "os";
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
import { defaultPlatformConfig } from "@/lib/config";
import {
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
import { PlatformConfig } from "@/lib/config";

export interface DatabaseSchema {
  config: PlatformConfig;
  selectedSocietyId: string;
  isEmergencyCutoffActive: boolean;
  currentStorageLiters: number;
  societies: Society[];
  availabilityLogs: WaterAvailabilityLog[];
  tankerSchedules: TankerSchedule[];
  borewellPoints: BorewellPoint[];
  groundwaterReadings: GroundwaterReading[];
  rwhUnits: RainwaterHarvestingUnit[];
  maintenanceLogs: MaintenanceChecklistLog[];
  leakageReports: LeakageReport[];
  waterSavingLogs: WaterSavingLog[];
  advisories: CommunityAdvisory[];
  forumPosts: ForumPost[];
  alerts: AlertNotification[];
  iotDevices: IoTDevice[];
  waterQualityReadings: WaterQualityReading[];
  lastUpdated: string;
}

// In-memory cache for serverless environments (e.g. Vercel)
let memoryDb: DatabaseSchema | null = null;

// Determine writable DB path: fallback to os.tmpdir() on Vercel/read-only environments
const DATA_DIR = path.join(process.cwd(), "data");
const PRIMARY_DB_FILE = path.join(DATA_DIR, "db.json");
const TMP_DB_FILE = path.join(os.tmpdir(), "aquatrace_db.json");

function getInitialDatabase(): DatabaseSchema {
  return {
    config: defaultPlatformConfig,
    selectedSocietyId: mockSocieties[0].id,
    isEmergencyCutoffActive: false,
    currentStorageLiters: 142500,
    societies: mockSocieties,
    availabilityLogs: mockAvailabilityLogs,
    tankerSchedules: mockTankerSchedules,
    borewellPoints: mockBorewellPoints,
    groundwaterReadings: mockGroundwaterReadings,
    rwhUnits: mockRwhUnits,
    maintenanceLogs: mockMaintenanceLogs,
    leakageReports: mockLeakageReports,
    waterSavingLogs: mockWaterSavingLogs,
    advisories: mockAdvisories,
    forumPosts: mockForumPosts,
    alerts: mockAlerts,
    iotDevices: mockIoTDevices,
    waterQualityReadings: mockWaterQualityReadings,
    lastUpdated: new Date().toISOString(),
  };
}

export function readDatabase(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  // 1. Try reading from temporary writable store first if it exists
  try {
    if (fs.existsSync(TMP_DB_FILE)) {
      const raw = fs.readFileSync(TMP_DB_FILE, "utf-8");
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    // ignore
  }

  // 2. Try reading from local project data directory
  try {
    if (fs.existsSync(PRIMARY_DB_FILE)) {
      const raw = fs.readFileSync(PRIMARY_DB_FILE, "utf-8");
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn("Could not read from PRIMARY_DB_FILE:", err);
  }

  // 3. Initialize fresh schema
  const initial = getInitialDatabase();
  memoryDb = initial;

  // Try saving to disk if writable
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  } catch (writeErr) {
    // If local dir is read-only (e.g. Vercel), save to tmpdir
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch {
      // Keep in-memory
    }
  }

  return memoryDb;
}

export function writeDatabase(data: DatabaseSchema): void {
  data.lastUpdated = new Date().toISOString();
  memoryDb = data;

  let written = false;

  // Try writing to primary project data directory
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    written = true;
  } catch {
    // Read-only filesystem on Vercel
  }

  // If primary write was not possible or in serverless environment, save to tmpdir
  if (!written || process.env.VERCEL) {
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (tmpErr) {
      console.warn("Could not write to TMP_DB_FILE, state retained in memory:", tmpErr);
    }
  }
}

export function resetDatabase(): DatabaseSchema {
  const initial = getInitialDatabase();
  writeDatabase(initial);
  return initial;
}
