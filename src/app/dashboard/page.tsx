"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/shared/Modal";
import { formatNumber, formatLiters, formatDate, formatDateTime, getStatusColor } from "@/lib/utils";
import { calculateDaysRemaining } from "@/lib/daysRemaining";
import {
  Droplets,
  ArrowDownToLine,
  Hourglass,
  Activity,
  Truck,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Radio,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  Gauge,
  Wifi,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Wrench,
  Building2,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function MainDashboardPage() {
  const {
    config,
    currentRole,
    selectedSociety,
    currentStorageLiters,
    availabilityLogs,
    tankerSchedules,
    borewellPoints,
    groundwaterReadings,
    rwhUnits,
    leakageReports,
    waterSavingLogs,
    alerts,
    confirmTankerArrival,
    addAvailabilityLog,
    addLeakageReport,
  } = useAppStore();

  // Active view tab state: overview, sensors, water_left, tankers
  const [activeTab, setActiveTab] = useState<"overview" | "sensors" | "water_left" | "tankers">("overview");

  // Modal states
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isConfirmTankerOpen, setIsConfirmTankerOpen] = useState(false);
  const [isResidentLeakModalOpen, setIsResidentLeakModalOpen] = useState(false);
  const [selectedTankerId, setSelectedTankerId] = useState<string | null>(null);
  const [actualLitersInput, setActualLitersInput] = useState<number>(6000);

  // New availability log form state (Admin only)
  const [newLogSource, setNewLogSource] = useState<"municipal" | "tanker" | "borewell" | "rainwater">("municipal");
  const [newLogQty, setNewLogQty] = useState<number>(50000);
  const [newLogDuration, setNewLogDuration] = useState<number>(120);
  const [newLogNotes, setNewLogNotes] = useState<string>("");

  // Resident leak report state
  const [residentLeakTitle, setResidentLeakTitle] = useState("");
  const [residentLeakCategory, setResidentLeakCategory] = useState<any>("pipe_burst");
  const [residentLeakUrgency, setResidentLeakUrgency] = useState<any>("high");
  const [residentLeakLocation, setResidentLeakLocation] = useState("");
  const [residentLeakDescription, setResidentLeakDescription] = useState("");

  // Society-filtered lists
  const societyBorewells = borewellPoints.filter((b) => b.id.includes(selectedSociety.id)).length > 0
    ? borewellPoints.filter((b) => b.id.includes(selectedSociety.id))
    : borewellPoints;
  const societyTankers = tankerSchedules.filter((t) => t.societyId === selectedSociety.id).length > 0
    ? tankerSchedules.filter((t) => t.societyId === selectedSociety.id)
    : tankerSchedules;
  const societyLeaks = leakageReports.filter((l) => l.societyId === selectedSociety.id).length > 0
    ? leakageReports.filter((l) => l.societyId === selectedSociety.id)
    : leakageReports;
  const societyAlerts = alerts.filter((a) => a.societyId === selectedSociety.id).length > 0
    ? alerts.filter((a) => a.societyId === selectedSociety.id)
    : alerts;

  // Live KPI calculations — dynamically tied to local backend store & selected society
  const totalWaterAvailableLiters = currentStorageLiters;
  const avgDailyConsumption = selectedSociety.dailyWaterQuotaLiters || 432000;
  const storageCapacityPercent = Math.min(
    100,
    Math.round((totalWaterAvailableLiters / (selectedSociety.usableStorageCapacityLiters || 650000)) * 100)
  );
  const hoursLeft = Math.max(1, Math.round(totalWaterAvailableLiters / (avgDailyConsumption / 24)));

  const daysCalc = calculateDaysRemaining({
    usableStoredWaterLiters: totalWaterAvailableLiters,
    averageDailyConsumptionLiters: avgDailyConsumption,
    scheduledIncomingSupplyLiters: 12000,
  });

  const primaryBorewell = societyBorewells.find((b) => b.status === "active") || societyBorewells[0];
  const nextTanker = societyTankers.find((t) => t.status === "en_route" || t.status === "scheduled");

  const unresolvedLeaks = societyLeaks.filter(
    (l) => l.status === "submitted" || l.status === "under_review" || l.status === "in_progress"
  );

  // Chart 1: Water Availability vs Demand (Past 7 Days + 3 Days Forecast) scaled to selected society
  const quota = selectedSociety.dailyWaterQuotaLiters || 432000;
  const cap = selectedSociety.usableStorageCapacityLiters || 650000;
  const availabilityChartData = [
    { date: "11 Nov", available: Math.round(cap * 0.72), consumption: Math.round(quota * 0.94), forecastDemand: Math.round(quota * 0.95) },
    { date: "12 Nov", available: Math.round(cap * 0.75), consumption: Math.round(quota * 0.96), forecastDemand: Math.round(quota * 0.97) },
    { date: "13 Nov", available: Math.round(cap * 0.74), consumption: Math.round(quota * 0.92), forecastDemand: Math.round(quota * 0.93) },
    { date: "14 Nov", available: Math.round(cap * 0.78), consumption: Math.round(quota * 0.98), forecastDemand: Math.round(quota * 0.99) },
    { date: "15 Nov", available: Math.round(cap * 0.76), consumption: Math.round(quota * 1.04), forecastDemand: Math.round(quota * 1.05) },
    { date: "16 Nov", available: Math.round(cap * 0.77), consumption: Math.round(quota * 0.99), forecastDemand: Math.round(quota * 1.01) },
    { date: "17 Nov", available: totalWaterAvailableLiters, consumption: Math.round(quota * 0.95), forecastDemand: Math.round(quota * 0.98) },
    { date: "18 Nov (Fc)", available: Math.round(cap * 0.80), forecastDemand: Math.round(quota * 1.02) },
    { date: "19 Nov (Fc)", available: Math.round(cap * 0.76), forecastDemand: Math.round(quota * 1.06) },
    { date: "20 Nov (Fc)", available: Math.round(cap * 0.73), forecastDemand: Math.round(quota * 1.10) },
  ];

  // Chart 2: Inverted Groundwater Hydrograph (m below reference datum)
  const groundwaterChartData = [
    { date: "15 Oct", well2: 16.9, well1: 18.2, safeLine: 15.0, warningLine: 20.0 },
    { date: "25 Oct", well2: 17.3, well1: 18.6, safeLine: 15.0, warningLine: 20.0 },
    { date: "05 Nov", well2: 17.65, well1: 19.1, safeLine: 15.0, warningLine: 20.0 },
    { date: "10 Nov", well2: 17.8, well1: 19.3, safeLine: 15.0, warningLine: 20.0 },
    { date: "12 Nov", well2: 17.92, well1: 19.4, safeLine: 15.0, warningLine: 20.0 },
    { date: "14 Nov", well2: 18.15, well1: 19.6, safeLine: 15.0, warningLine: 20.0 },
    { date: "16 Nov", well2: 18.35, well1: 19.7, safeLine: 15.0, warningLine: 20.0 },
    { date: "17 Nov", well2: 18.4, well1: 19.8, safeLine: 15.0, warningLine: 20.0 },
  ];

  // Chart 3: Water Source Distribution
  const sourcePieData = [
    { name: "Municipal Supply", value: 45, color: "#073BCE" },
    { name: "Borewells", value: 32, color: "#1769E0" },
    { name: "Private Tankers", value: 18, color: "#FF6900" },
    { name: "Rainwater Harvesting", value: 5, color: "#20B8C4" },
  ];

  // Sensor reading records for the All Sensors view
  const sensorReadingsList = [
    {
      id: "sn_001",
      name: "Borewell #2 Hydrostatic Transducer",
      location: "Clubhouse Borehole PBW-02",
      type: "groundwater_depth",
      reading: "18.4 m",
      unit: "m below casing (+920.4m MSL)",
      status: "active",
      signal: "-68 dBm",
      battery: "Hardwired 24V",
      protocol: "RS485 Modbus / ESP32",
      lastUpdated: "4 mins ago",
      threshold: "Safe: <15m · Crit: >20m",
      warningLevel: "caution",
    },
    {
      id: "sn_002",
      name: "Borewell #1 Piezoresistive Sensor",
      location: "North Block Borehole PBW-01",
      type: "groundwater_depth",
      reading: "19.8 m",
      unit: "m below casing (+918.2m MSL)",
      status: "resting",
      signal: "-72 dBm",
      battery: "Hardwired 24V",
      protocol: "RS485 Modbus / ESP32",
      lastUpdated: "12 mins ago",
      threshold: "Resting cycle active (90 mins)",
      warningLevel: "warning",
    },
    {
      id: "sn_003",
      name: "Underground Sump 1 Ultrasonic Transmitter",
      location: "Central Basement Sump (Potable)",
      type: "tank_level",
      reading: "142,500 L",
      unit: "78% capacity (4.2m water column)",
      status: "active",
      signal: "-64 dBm",
      battery: "96% LiFePO4",
      protocol: "HTTPS REST / ESP32",
      lastUpdated: "1 min ago",
      threshold: "Dead storage: 15,000 L excluded",
      warningLevel: "normal",
    },
    {
      id: "sn_004",
      name: "Underground Sump 2 (Secondary Storage)",
      location: "East Wing Sump",
      type: "tank_level",
      reading: "45,000 L",
      unit: "62% capacity (2.8m water column)",
      status: "active",
      signal: "-70 dBm",
      battery: "98% LiFePO4",
      protocol: "HTTPS REST / ESP32",
      lastUpdated: "5 mins ago",
      threshold: "Direct intake from Tankers",
      warningLevel: "normal",
    },
    {
      id: "sn_005",
      name: "Main Line Electromagnetic Flowmeter",
      location: "Society Master Gate Intake",
      type: "flow_rate",
      reading: "84 LPM",
      unit: "28,400 L daily accumulated",
      status: "active",
      signal: "-66 dBm",
      battery: "Mains Powered",
      protocol: "MQTT / TLS",
      lastUpdated: "30 secs ago",
      threshold: "Peak limit: 120 LPM",
      warningLevel: "normal",
    },
    {
      id: "sn_006",
      name: "Water Quality Online Screening Sensor",
      location: "Potable Delivery Header",
      type: "water_quality",
      reading: "TDS 342 ppm · Turb 1.8 NTU · pH 7.4",
      unit: "Within standard non-potability screening limits",
      status: "active",
      signal: "-69 dBm",
      battery: "Hardwired 12V",
      protocol: "RS485 Modbus / ESP32",
      lastUpdated: "8 mins ago",
      threshold: "Lab test recommended for drinking",
      warningLevel: "normal",
    },
  ];

  const handleCreateAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== "admin") return;
    addAvailabilityLog({
      societyId: selectedSociety.id,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      source: newLogSource,
      quantityLiters: newLogQty,
      durationMinutes: newLogDuration,
      storageTankName: "Underground Sump 1 (Potable)",
      shortageStatus: "adequate",
      notes: newLogNotes || "Manual update from administrator dashboard.",
      submittedBy: "Vikram Sethi (Admin)",
      submitterRole: currentRole,
      isSensorVerified: false,
    });
    setIsLogModalOpen(false);
  };

  const handleResidentLeakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLeakageReport({
      societyId: selectedSociety.id,
      title: residentLeakTitle,
      category: residentLeakCategory,
      urgency: residentLeakUrgency,
      locationDetails: residentLeakLocation,
      buildingBlock: "Block A - 402",
      description: residentLeakDescription,
      submittedBy: "Aarav Patel (Resident - A-402)",
      submitterContact: "+91 98450 11223",
      resolutionNotes: "Submitted via Resident Quick-Report.",
    });
    setIsResidentLeakModalOpen(false);
    setResidentLeakTitle("");
    setResidentLeakLocation("");
    setResidentLeakDescription("");
  };

  const handleConfirmTankerSubmit = () => {
    if (selectedTankerId && (currentRole === "admin" || currentRole === "maintenance")) {
      confirmTankerArrival(selectedTankerId, actualLitersInput, "Verified at society gate intake valve.");
      setIsConfirmTankerOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Differentiated for Resident vs Admin */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl font-sans">
              {currentRole === "resident"
                ? "Resident Water Portal"
                : currentRole === "maintenance"
                ? "Technician Maintenance Desk"
                : currentRole === "utility"
                ? "Public Utility Authority Desk"
                : "Water Intelligence Command"}
            </h1>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                {currentRole === "resident" ? "Supply Normal" : "Telemetry Live"}
              </span>
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {currentRole === "resident"
              ? `${selectedSociety.name} · Unit: Block A - 402 · Real-time water availability & quality status`
              : `${selectedSociety.name} · ${selectedSociety.location} · 18 Hydrostatic Nodes Synced`}
          </p>
        </div>

        {/* Header Actions: Clean and Role-Specific */}
        <div className="flex items-center gap-2.5">
          {currentRole === "resident" ? (
            <>
              <button
                onClick={() => setIsResidentLeakModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Report Leak / Wastage</span>
              </button>

              <Link
                href="/dashboard/conservation"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Log Water Savings</span>
              </Link>
            </>
          ) : currentRole === "admin" ? (
            <>
              <button
                onClick={() => setIsLogModalOpen(true)}
                className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                + Record Water Intake
              </button>

              <Link
                href="/dashboard/tanker"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Tanker Logistics
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard/leakage"
              className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Work Orders &amp; Tickets
            </Link>
          )}
        </div>
      </div>

      {/* Segmented View Navigation (For Admins / Power Users) */}
      {currentRole === "admin" && (
        <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1 w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
              activeTab === "overview"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Executive Overview
          </button>

          <button
            onClick={() => setActiveTab("sensors")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
              activeTab === "sensors"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sensor Telemetry ({sensorReadingsList.length})
          </button>

          <button
            onClick={() => setActiveTab("water_left")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
              activeTab === "water_left"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sump Reserves ({daysCalc.formattedDays})
          </button>

          <button
            onClick={() => setActiveTab("tankers")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
              activeTab === "tankers"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tankers ({societyTankers.length})
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* RESIDENT-SPECIFIC DASHBOARD VIEW                               */}
      {/* ============================================================== */}
      {currentRole === "resident" && (
        <div className="space-y-6">
          {/* Top 3 Resident Vital Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Card 1: Society Water Availability */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Water Availability
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Supply Normal
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                    {formatNumber(totalWaterAvailableLiters)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">Litres</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {storageCapacityPercent}% capacity · Estimated <strong>{daysCalc.formattedDays} ({hoursLeft} Hours)</strong> uncurtailed supply.
                </div>
              </div>

              {/* Simple readable fill bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${storageCapacityPercent}%` }} />
              </div>

              <p className="text-[11px] text-slate-400">
                Central sumps are receiving steady supply from Cauvery municipal line and society borewells.
              </p>
            </div>

            {/* Card 2: Tap Water Quality Today */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Water Quality Today
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Optimal Tap Water
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                    TDS 342 <span className="text-sm font-normal text-slate-500">ppm</span>
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-600 font-medium flex items-center gap-3">
                  <span>pH: <strong>7.4</strong> (Neutral)</span>
                  <span>·</span>
                  <span>Turbidity: <strong>1.8 NTU</strong> (Clear)</span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-[11px] text-slate-600">
                Standard sand-media filtration and chlorination are active. Tap water is safe for all domestic use.
              </div>

              <Link
                href="/dashboard/water-quality"
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View water quality screening history &rarr;</span>
              </Link>
            </div>

            {/* Card 3: Upcoming Tanker Arrival Schedule */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Next Tanker Supply
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  En Route (24m)
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                    18:00 IST
                  </span>
                  <span className="text-xs font-medium text-slate-500">Today</span>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Cauvery Express Logistics · <strong>6,000 Litres Potable</strong>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-[11px] text-slate-500">
                Scheduled by Estate Office to refill Sump 2 before evening peak hours.
              </div>

              <Link
                href="/dashboard/tanker"
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View full tanker arrival schedule &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Resident Action Center (3 Purpose-Built Cards) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Action 1: Report Leakage */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report Leakage / Wastage</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Notice a pipe leak, dripping tap in common areas, or tank overflow? Report it with photo proof for immediate maintenance dispatch.
                </p>
              </div>

              <button
                onClick={() => setIsResidentLeakModalOpen(true)}
                className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-sm w-fit"
              >
                Report Leakage Now
              </button>
            </div>

            {/* Action 2: Log Water Savings */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Award className="h-4 w-4" />
                  <span>Log Water Savings &amp; Wing Standing</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Installed 3 LPM aerators or reused greywater for plants? Record your verified savings to help Wing A maintain #1 position on the leaderboard.
                </p>
              </div>

              <Link
                href="/dashboard/conservation"
                className="rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm w-fit"
              >
                Log Savings &amp; View Rank
              </Link>
            </div>

            {/* Action 3: Community Advisory */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Info className="h-4 w-4" />
                  <span>Borewell Resting Hours</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Borewell #2 hydrostatic sensor indicates 18.4m depth. Resting cycle is active between <strong>2:00 PM and 5:00 PM</strong> to allow the water table to recover.
                </p>
              </div>

              <Link
                href="/dashboard/groundwater"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Check Groundwater Chart &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Active Society Issues Transparency Feed */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Active Society Maintenance &amp; Plumbing Tickets</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live tracking of reported issues being resolved by the estate maintenance team.
                </p>
              </div>
              <Link href="/dashboard/leakage" className="text-xs font-semibold text-primary hover:underline">
                View All Tickets &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {societyLeaks.slice(0, 3).map((leak) => {
                const statusStyle = getStatusColor(leak.status);
                return (
                  <div
                    key={leak.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                        <span>{leak.title}</span>
                        <span className="text-[10px] text-slate-400">· {leak.locationDetails || leak.buildingBlock}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{leak.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{leak.status.replace("_", " ")}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {leak.assignedTechnician ? `Assigned: ${leak.assignedTechnician.split(" ")[0]}` : "Under Review"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADMINISTRATOR DASHBOARD VIEW (WHEN ROLE === 'admin')            */}
      {/* ============================================================== */}
      {currentRole === "admin" && activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Command Panel: Water Reserves & Operational Vitals */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Primary Command Block: Stored Water & Depletion Buffer (7 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 lg:col-span-7 flex flex-col justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Sump Storage Buffer &amp; Depletion Runaway
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{storageCapacityPercent}% Sump Capacity</span>
                  </div>
                </div>

                {/* Big Metric Numbers */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Usable Stored Water
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                        {formatNumber(totalWaterAvailableLiters)}
                      </span>
                      <span className="text-xs font-medium text-slate-500">Litres</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Of {formatNumber(selectedSociety.usableStorageCapacityLiters || 240000)} L Max Capacity
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Estimated Days Left
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
                        {daysCalc.formattedDays}
                      </span>
                      <span className="text-xs font-medium text-amber-600 font-semibold">
                        ({hoursLeft} Hours)
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Burn rate: 34,000 L/day (1,416 L/h velocity)
                    </div>
                  </div>
                </div>

                {/* Multi-Sump Proportional Fill Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Multi-Sump Allocation Buffer</span>
                    <span>15,000 L Dead Storage Isolated</span>
                  </div>
                  <div className="flex h-3 w-full overflow-hidden rounded-md bg-slate-100">
                    <div className="bg-primary h-full" style={{ width: "49%" }} title="Sump 1: 88.5k L (Potable)" />
                    <div className="bg-secondary h-full" style={{ width: "18%" }} title="Sump 2: 32.0k L (Secondary)" />
                    <div className="bg-aqua h-full" style={{ width: "12%" }} title="Overhead: 22.0k L" />
                    <div className="bg-slate-200 h-full" style={{ width: "21%" }} title="Free Headroom: 37.5k L" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Sump 1 (88.5k L)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Sump 2 (32.0k L)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-aqua" /> Overhead (22.0k L)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" /> Free Headroom (37.5k L)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Reserve within safe operational threshold</span>
                </span>
                <Link
                  href="/dashboard/water-remaining"
                  className="font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1 text-[11px]"
                >
                  <span>Depletion simulator</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Complementary Telemetry Strip (5 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 lg:col-span-5 flex flex-col justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Telemetry Vitals
                </span>
                <Link
                  href="/dashboard/iot-devices"
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>IoT Matrix &rarr;</span>
                </Link>
              </div>

              {/* 3 Telemetry Data Rows */}
              <div className="space-y-3.5 text-xs">
                {/* Row 1: Groundwater Depth */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="font-semibold text-slate-800">Groundwater Depth (Borewell #2)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Piezoresistive Transducer · RS485 Modbus
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-sans tabular-nums text-sm">
                      18.4 m
                    </div>
                    <div className="text-[10px] text-amber-600 font-medium">
                      Caution (&gt;15m safe line)
                    </div>
                  </div>
                </div>

                {/* Row 2: Today's Consumption */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="font-semibold text-slate-800">Today&apos;s Consumption Flow</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      84 LPM Instantaneous · Peak 07:30 AM
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-sans tabular-nums text-sm">
                      28,400 L
                    </div>
                    <div className="text-[10px] text-slate-500">
                      81% of 35k L quota
                    </div>
                  </div>
                </div>

                {/* Row 3: Next Tanker Supply */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Next Tanker Intake</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      KA-04-E-8821 (Cauvery Express) · 6,000 L
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 font-sans tabular-nums text-sm">
                      18:00 IST
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      En Route (24 mins)
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Water Quality: TDS 342 ppm · pH 7.4 (Normal)</span>
                <span className="font-medium text-slate-700">1 Active Leak Ticket</span>
              </div>
            </div>
          </div>

          {/* Center Analytics Section (3 Charts) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Chart 1: Water Availability vs Predicted Demand (8 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] lg:col-span-8">
              <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      Water Availability vs AI Predicted Demand
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      (Past 7 Days + 3-Day Forecast)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Storage reserve volume versus actual consumption burn rate and autoregressive forecast.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Stored Water
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-aqua" /> Consumption
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-orange" /> Forecast Demand
                  </span>
                </div>
              </div>

              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={availabilityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="availGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#073BCE" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#073BCE" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="consumpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#20B8C4" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#20B8C4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#667085" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#667085" }} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        `${formatNumber(Number(value))} L`,
                        name === "available"
                          ? "Stored Water"
                          : name === "consumption"
                          ? "Daily Consumption"
                          : "AI Forecast Demand",
                      ]}
                      contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="available"
                      stroke="#073BCE"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#availGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="consumption"
                      stroke="#20B8C4"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#consumpGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="forecastDemand"
                      stroke="#FF6900"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: "#FF6900" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Water Source Distribution (4 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] lg:col-span-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Water Source Distribution</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breakdown of incoming water by municipal, borewell, tanker, and rainwater.
                </p>
              </div>

              <div className="h-52 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourcePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourcePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => [`${v}%`, "Contribution"]}
                      contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                {sourcePieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Groundwater Depth Hydrograph Row (Inverted) */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    Groundwater Depth Hydrograph (Inverted Scale)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Depth below casing reference datum (+920.4m MSL)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inverted Y-axis plots sub-surface drawdowns accurately. Larger depth means water table is falling.
                </p>
              </div>

              <Link
                href="/dashboard/groundwater"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
              >
                <span>Borewell telemetry &amp; dip-tape log</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={groundwaterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#667085" }} />
                  <YAxis
                    domain={[15, 22]}
                    reversed={true}
                    tick={{ fontSize: 11, fill: "#667085" }}
                    tickFormatter={(v) => `${v}m`}
                  />
                  <Tooltip
                    formatter={(v: any, name: string) => [
                      `${v} metres below casing`,
                      name === "well2" ? "Borewell #2 (Clubhouse)" : "Borewell #1 (North Wing)",
                    ]}
                    contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="well2"
                    stroke="#073BCE"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#073BCE" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="well1"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: "#94A3B8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="warningLine"
                    stroke="#E8A317"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Borewell #2 (18.4m current)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> Borewell #1 (19.8m resting)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Warning Threshold (20.0m)
                </span>
              </div>
              <span className="text-slate-400">Zero-drift calibrated via acoustic dip-tape reference</span>
            </div>
          </div>

          {/* Operational Tables: Upcoming Tankers + Active Leakage Tickets */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Upcoming Tanker Deliveries Table (7 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Upcoming Tanker Deliveries</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scheduled municipal &amp; commercial water tanker arrivals and gate verification.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/tanker"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    View all &rarr;
                  </Link>
                </div>

                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Date / Time</th>
                        <th className="py-2.5">Tanker &amp; Vendor</th>
                        <th className="py-2.5">Source</th>
                        <th className="py-2.5">Planned Qty</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Gate Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {societyTankers.slice(0, 4).map((tanker) => {
                        return (
                          <tr key={tanker.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-2.5 whitespace-nowrap">
                              <div className="font-semibold text-slate-800">{tanker.scheduledTimeWindow}</div>
                              <div className="text-[10px] text-slate-400">{tanker.scheduledDate}</div>
                            </td>
                            <td className="py-2.5">
                              <div className="font-semibold text-slate-800">{tanker.tankerNumber}</div>
                              <div className="text-[10px] text-slate-500">{tanker.vendorName}</div>
                            </td>
                            <td className="py-2.5">
                              <span className="text-slate-600 capitalize text-[11px]">
                                {tanker.sourceType.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-2.5 font-semibold font-mono text-slate-900">
                              {formatNumber(tanker.plannedQuantityLiters)} L
                            </td>
                            <td className="py-2.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 capitalize">
                                <span className={`h-1.5 w-1.5 rounded-full ${tanker.status === 'completed' ? 'bg-emerald-500' : tanker.status === 'en_route' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                                {tanker.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              {tanker.status === "en_route" || tanker.status === "arrived" ? (
                                <button
                                  onClick={() => {
                                    setSelectedTankerId(tanker.id);
                                    setActualLitersInput(tanker.plannedQuantityLiters);
                                    setIsConfirmTankerOpen(true);
                                  }}
                                  className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-slate-800 transition"
                                >
                                  Verify Intake
                                </button>
                              ) : tanker.status === "completed" ? (
                                <span className="text-[11px] text-emerald-700 font-medium flex items-center justify-end gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Logged</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">Scheduled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Next expected arrival: Cauvery Express (24 mins)</span>
                <Link href="/dashboard/tanker" className="text-slate-700 font-semibold hover:text-slate-900">
                  + Schedule Tanker
                </Link>
              </div>
            </div>

            {/* Right Column: Active Grid Leakage & Conservation Hub (5 cols) */}
            <div className="space-y-5 lg:col-span-5">
              {/* Recent Leakage Reports Card */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Active Leakage Tickets</span>
                    <span className="text-[11px] text-slate-400">({unresolvedLeaks.length} Open)</span>
                  </div>
                  <Link href="/dashboard/leakage" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                    View all &rarr;
                  </Link>
                </div>

                <div className="mt-3 space-y-2.5">
                  {societyLeaks.slice(0, 2).map((leak) => (
                    <div
                      key={leak.id}
                      className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 hover:bg-slate-100/40 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-slate-900">{leak.title}</div>
                        <span className="text-[10px] font-semibold text-rose-700 uppercase">
                          {leak.urgency}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-1">{leak.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{leak.locationDetails || leak.buildingBlock}</span>
                        <span className="text-slate-600 font-medium">Status: {leak.status.replace("_", " ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Conservation Standing */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-bold text-sm text-slate-900">Wing Conservation Standing</span>
                  <Link href="/dashboard/conservation" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                    Full Hub &rarr;
                  </Link>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">1. Wing A (Gulmohar)</span>
                    <span className="font-mono font-bold text-emerald-700">8,400 L Saved</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">2. Wing C (Pine)</span>
                    <span className="font-mono font-bold text-emerald-700">6,100 L Saved</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">3. Wing B (Oak)</span>
                    <span className="font-mono font-bold text-emerald-700">4,100 L Saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: SENSORS MATRIX TAB (ADMIN ONLY) */}
      {currentRole === "admin" && activeTab === "sensors" && (
        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-slate-900">All Sensor Telemetry &amp; Node Health</h2>
                <span className="text-xs text-emerald-700 font-medium">
                  · 6/6 Nodes Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Submersible hydrostatic transducers, ultrasonic sump level sensors, and electromagnetic flowmeters.
              </p>
            </div>
            <Link
              href="/dashboard/iot-devices"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Hardware Simulation Console &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sensorReadingsList.map((sensor) => (
              <div
                key={sensor.id}
                className="rounded-lg border border-slate-200/80 bg-slate-50/40 p-4 space-y-3 hover:border-slate-300 hover:bg-white transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {sensor.protocol}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                    <span className={`h-1.5 w-1.5 rounded-full ${sensor.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="capitalize">{sensor.status}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-slate-900">{sensor.name}</h3>
                  <p className="text-[11px] text-slate-500">{sensor.location}</p>
                </div>

                <div className="rounded border border-slate-200/60 bg-white p-2.5">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Live Reading</div>
                  <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">{sensor.reading}</div>
                  <div className="text-[10px] text-slate-500">{sensor.unit}</div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Signal: {sensor.signal}</span>
                  <span>Power: {sensor.battery}</span>
                  <span>{sensor.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: AMOUNT OF WATER LEFT & STORAGE TAB (ADMIN ONLY) */}
      {currentRole === "admin" && activeTab === "water_left" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Visual Water Tank Container (6 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 lg:col-span-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-bold text-sm text-slate-900">Usable Water Storage Reservoir</h2>
                  <p className="text-xs text-slate-500">
                    Current buffer across Central Underground Sumps and Overhead Tanks.
                  </p>
                </div>
                <span className="text-xs text-emerald-700 font-semibold">
                  78.2% Usable Volume
                </span>
              </div>

              {/* Graphic Reservoir Container */}
              <div className="relative h-44 w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200 p-2 flex flex-col justify-end">
                {/* Usable Water Fill */}
                <div
                  className="w-full bg-primary rounded-lg relative transition-all duration-700 flex items-center justify-center text-white"
                  style={{ height: "78%" }}
                >
                  <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Usable Volume</span>
                    <div className="font-mono text-3xl font-bold">{formatNumber(totalWaterAvailableLiters)} L</div>
                  </div>
                </div>

                {/* Dead Storage Threshold Line */}
                <div className="absolute bottom-4 left-0 w-full border-t border-dashed border-rose-500 px-3 flex justify-between text-[10px] text-rose-700 font-medium bg-white/80">
                  <span>Sediment Dead Storage (15,000 L)</span>
                  <span>Excluded to Prevent Pump Cavitation</span>
                </div>
              </div>

              {/* Storage Details Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <span className="text-slate-500">Underground Sump 1 (Potable):</span>
                  <div className="font-mono text-base font-bold text-slate-900 mt-0.5">88,500 L</div>
                  <span className="text-[10px] text-slate-500">Cauvery Pipeline Intake</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <span className="text-slate-500">Underground Sump 2 (Secondary):</span>
                  <div className="font-mono text-base font-bold text-slate-900 mt-0.5">32,000 L</div>
                  <span className="text-[10px] text-slate-500">Direct Tanker Discharge</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <span className="text-slate-500">Overhead Tank (Tower A):</span>
                  <div className="font-mono text-base font-bold text-slate-900 mt-0.5">12,000 L</div>
                  <span className="text-[10px] text-slate-500">Gravity Feed Distribution</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <span className="text-slate-500">Overhead Tank (Tower B):</span>
                  <div className="font-mono text-base font-bold text-slate-900 mt-0.5">10,000 L</div>
                  <span className="text-[10px] text-slate-500">Gravity Feed Distribution</span>
                </div>
              </div>
            </div>

            {/* Depletion Countdown & Runaway Details (6 cols) */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 lg:col-span-6 space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-bold text-sm text-slate-900">Estimated Days of Water Remaining</h2>
                  <span className="text-xs text-amber-700 font-medium">
                    Medium Shortage Risk
                  </span>
                </div>

                <div className="mt-4 p-5 rounded-lg border border-slate-200 bg-slate-50 text-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Calculated Depletion Buffer
                  </span>
                  <div className="font-mono text-4xl font-bold text-slate-900 mt-1">
                    {daysCalc.formattedDays}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Approximately <strong>105 Hours</strong> of uncurtailed supply remaining at current velocity.
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Average Daily Consumption:</span>
                    <span className="font-mono font-bold text-slate-900">{formatNumber(avgDailyConsumption)} L/day</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Hourly Burn Velocity:</span>
                    <span className="font-mono font-bold text-slate-900">1,416 L/hour</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Confirmed Incoming Tanker:</span>
                    <span className="font-mono font-semibold text-emerald-700">+6,000 L (Arriving 18:00)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Rationing Trigger:</span>
                    <span className="font-semibold text-rose-700">&lt; 2.0 Days remaining</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/dashboard/water-remaining"
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  Full Depletion Simulator &rarr;
                </Link>
                <span className="text-[11px] text-slate-400">Multi-Sump Physics Model</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TANKER LOGISTICS & HISTORY TAB (ADMIN ONLY) */}
      {currentRole === "admin" && activeTab === "tankers" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Municipal &amp; Private Tanker Hub</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Upcoming tanker schedule, gate entry verification, and historical procurement ledger.
                </p>
              </div>

              <Link
                href="/dashboard/tanker"
                className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                + Book New Supply
              </Link>
            </div>

            {/* Next Tanker Live Banner */}
            {nextTanker && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{nextTanker.tankerNumber}</span>
                    <span className="text-slate-500 font-normal">({nextTanker.vendorName})</span>
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Driver: {nextTanker.driverName} ({nextTanker.driverPhone}) · Slot: {nextTanker.scheduledTimeWindow}
                  </div>
                  <div className="text-slate-500 font-mono mt-0.5">
                    Planned: {formatNumber(nextTanker.plannedQuantityLiters)} L · ₹{formatNumber(nextTanker.costInINR)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTankerId(nextTanker.id);
                    setActualLitersInput(nextTanker.plannedQuantityLiters);
                    setIsConfirmTankerOpen(true);
                  }}
                  className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shrink-0"
                >
                  Confirm Gate Intake
                </button>
              </div>
            )}
          </div>

          {/* Delivery History Table */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Procurement Delivery Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified receipt ledger with planned vs. actual intake variance.
                </p>
              </div>
              <span className="text-xs text-slate-400">{societyTankers.length} entries</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Date &amp; Slot</th>
                    <th className="py-2.5">Tanker &amp; Vendor</th>
                    <th className="py-2.5">Grade</th>
                    <th className="py-2.5">Planned Qty</th>
                    <th className="py-2.5">Actual Intake</th>
                    <th className="py-2.5">Variance</th>
                    <th className="py-2.5">Cost (₹)</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {societyTankers.map((t) => {
                    const variance = t.actualQuantityLiters ? t.actualQuantityLiters - t.plannedQuantityLiters : 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-2.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{t.scheduledDate}</div>
                          <div className="text-[10px] text-slate-400">{t.scheduledTimeWindow}</div>
                        </td>
                        <td className="py-2.5">
                          <div className="font-semibold text-slate-900">{t.tankerNumber}</div>
                          <div className="text-[10px] text-slate-500">{t.vendorName}</div>
                        </td>
                        <td className="py-2.5">
                          <span className="text-slate-600 capitalize text-[11px]">
                            {t.sourceType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono font-semibold text-slate-900">
                          {formatNumber(t.plannedQuantityLiters)} L
                        </td>
                        <td className="py-2.5 font-mono font-semibold text-slate-900">
                          {t.actualQuantityLiters ? `${formatNumber(t.actualQuantityLiters)} L` : "Pending"}
                        </td>
                        <td className="py-2.5 font-mono text-[11px]">
                          {t.actualQuantityLiters ? (
                            variance === 0 ? (
                              <span className="text-slate-500">0 L</span>
                            ) : variance < 0 ? (
                              <span className="text-rose-600 font-semibold">{variance} L</span>
                            ) : (
                              <span className="text-emerald-600 font-semibold">+{variance} L</span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 font-mono text-slate-700">₹{formatNumber(t.costInINR)}</td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 capitalize">
                            <span className={`h-1.5 w-1.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {t.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MAINTENANCE TECHNICIAN VIEW (WHEN ROLE === 'maintenance')      */}
      {/* ============================================================== */}
      {currentRole === "maintenance" && (
        <div className="space-y-6">
          {/* Top Technician Status Strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Assigned Work Orders
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-slate-900">
                {unresolvedLeaks.length} Active
              </div>
              <span className="text-[11px] text-rose-600 font-medium">1 Critical pipe repair pending</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Next Tanker Gate Intake
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-primary">
                18:00 IST
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Cauvery Express · 6,000 L</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Pump Room Operational Duty
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-slate-900">
                2 Active / 1 Rest
              </div>
              <span className="text-[11px] text-slate-500">Borewell #1 on rest cycle (90 mins)</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                RWH Filter Status
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-emerald-700">
                3/3 Optimal
              </div>
              <span className="text-[11px] text-slate-500">Next silt flush due 15 Dec</span>
            </div>
          </div>

          {/* Maintenance Work Orders & Sump Telemetry */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Work Orders Queue */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">On-Site Plumbing &amp; Leakage Dispatch</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tickets assigned to technician desk for inspection &amp; repair.</p>
                </div>
                <Link href="/dashboard/leakage" className="text-xs font-semibold text-primary hover:underline">
                  Full Dispatch Board &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {societyLeaks.map((leak) => (
                  <div key={leak.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-xs text-slate-900">{leak.title}</span>
                        <div className="text-[11px] text-slate-500">{leak.locationDetails || leak.buildingBlock} · Reported by {leak.submittedBy}</div>
                      </div>
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 uppercase">
                        {leak.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/70">{leak.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">Status: <strong className="text-slate-800 uppercase">{leak.status.replace("_", " ")}</strong></span>
                      <Link
                        href="/dashboard/leakage"
                        className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Update Repair Notes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pump Room & Tank Gate Intake Actions */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">Pump &amp; Intake Checkpoints</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Gate verification &amp; pump automation controls.</p>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Borewell #2 Pump</span>
                      <span className="text-emerald-700 font-bold">RUNNING</span>
                    </div>
                    <span className="text-slate-500">Current depth: 18.4m · Flow: 84 LPM · Motor Temp: 42°C</span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Borewell #1 Pump</span>
                      <span className="text-amber-700 font-bold">RESTING (AUTO)</span>
                    </div>
                    <span className="text-slate-500">Current depth: 19.8m · Next start in 48 mins</span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Sump 1 Gate Ultrasonic Sensor</span>
                      <span className="text-emerald-700 font-bold">ONLINE</span>
                    </div>
                    <span className="text-slate-500">Intake manifold valve ready for 18:00 delivery</span>
                  </div>
                </div>
              </div>

              {nextTanker && (
                <div className="rounded-lg border border-primary/20 bg-primary-light/20 p-3.5 space-y-2">
                  <span className="text-xs font-bold text-primary block">Incoming Tanker Arrival:</span>
                  <div className="text-xs text-slate-700">
                    <strong>{nextTanker.tankerNumber}</strong> ({nextTanker.vendorName})
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTankerId(nextTanker.id);
                      setActualLitersInput(nextTanker.plannedQuantityLiters);
                      setIsConfirmTankerOpen(true);
                    }}
                    className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm"
                  >
                    Verify Flowmeter &amp; Record Intake
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PUBLIC UTILITY DESK (WHEN ROLE === 'utility')                   */}
      {/* ============================================================== */}
      {currentRole === "utility" && (
        <div className="space-y-6">
          {/* Top Utility Vitals */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Ward Drought Vulnerability
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-amber-700">
                68 / 100 (High)
              </div>
              <span className="text-[11px] text-slate-500">South-East Sub-Basin Index</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Municipal Allocation
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-primary">
                65,000 L / Day
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">92% of ward feeder quota</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Escalated Mainline Tickets
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-rose-700">
                1 Forwarded
              </div>
              <span className="text-[11px] text-slate-500">Docket #BWSSB-2026-9812</span>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Aquifer Piezometric Trend
              </span>
              <div className="mt-1 font-bold font-mono text-2xl text-slate-900">
                -0.6m / Month
              </div>
              <span className="text-[11px] text-slate-500">Depletion rate in deep fracture zone</span>
            </div>
          </div>

          {/* Utility Forwarded Dockets & Regional Water Radar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Municipal Escalation Dockets</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Society mainline leaks escalated to public utility department.</p>
                </div>
                <span className="text-xs text-slate-400">Official BWSSB Queue</span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-xs text-slate-900">Docket #BWSSB-2026-9812: Main feeder pipe fracture</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">Greenwood Heights Gate 1 Mainline · Escalated by Vikram Sethi (Admin)</div>
                  </div>
                  <span className="rounded bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 uppercase">Critical</span>
                </div>
                <p className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/70">
                  Municipal inlet pipe split under 3.2 bar street pressure, leaking ~120 LPM into storm drain. Requires BWSSB road-cutting gang.
                </p>
                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-slate-500">Forwarded: 17 Nov 2026, 09:30 IST</span>
                  <span className="text-emerald-700 font-semibold">BWSSB Gang Dispatched</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm lg:col-span-5 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Ward Groundwater Monitoring</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hydrological sensor telemetry shared with utility portal.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800 block">Borewell #2 Hydrostatic Sensor:</span>
                  <span className="font-mono text-sm font-bold text-slate-900">18.4m below datum</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Within permissible abstraction zone. Caution advisory triggered.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800 block">Society Water Conservation Index:</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">14.2% demand reduction</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Greenwood Heights leads Ward 174 in greywater recycling and aerator adoption.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Resident Quick Report Leakage */}
      <Modal
        isOpen={isResidentLeakModalOpen}
        onClose={() => setIsResidentLeakModalOpen(false)}
        title="Report a Water Leakage or Wastage"
        subtitle="Submit a report for immediate maintenance technician dispatch"
      >
        <form onSubmit={handleResidentLeakSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Issue Headline</label>
            <input
              type="text"
              value={residentLeakTitle}
              onChange={(e) => setResidentLeakTitle(e.target.value)}
              placeholder="e.g. Broken sprinkler spraying water into drain"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Category</label>
              <select
                value={residentLeakCategory}
                onChange={(e: any) => setResidentLeakCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="pipe_burst">Pipe Burst / High Pressure Leak</option>
                <option value="tank_overflow">Overhead Tank Overflow</option>
                <option value="tap_leak">Continuous Tap / Fixture Leak</option>
                <option value="wastage">Avoidable Water Wastage</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Urgency</label>
              <select
                value={residentLeakUrgency}
                onChange={(e: any) => setResidentLeakUrgency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="high">High (Active Steady Stream)</option>
                <option value="critical">Critical (Flooding / Severe Loss)</option>
                <option value="medium">Medium (Continuous Drip)</option>
                <option value="low">Low (Minor Seepage)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Exact Location in Society</label>
            <input
              type="text"
              value={residentLeakLocation}
              onChange={(e) => setResidentLeakLocation(e.target.value)}
              placeholder="e.g. Block A, Basement-1 near pillar 14"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Description</label>
            <textarea
              value={residentLeakDescription}
              onChange={(e) => setResidentLeakDescription(e.target.value)}
              placeholder="Provide any additional details to help the plumber locate and fix the issue quickly..."
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsResidentLeakModalOpen(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
            >
              Dispatch Leak Report
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Water Availability Log (Admin Only) */}
      {currentRole === "admin" && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Record Water Availability Update"
          subtitle="Log municipal, tanker or borewell water volume received"
        >
          <form onSubmit={handleCreateAvailability} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Water Source</label>
              <select
                value={newLogSource}
                onChange={(e: any) => setNewLogSource(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="municipal">Municipal Supply (BWSSB / Cauvery)</option>
                <option value="tanker">Commercial Water Tanker</option>
                <option value="borewell">Society Borewells (PBW-01 &amp; 02)</option>
                <option value="rainwater">Rainwater Harvesting Sump</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Volume (Litres)</label>
                <input
                  type="number"
                  value={newLogQty}
                  onChange={(e) => setNewLogQty(Number(e.target.value))}
                  min={100}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Supply Duration (Minutes)</label>
                <input
                  type="number"
                  value={newLogDuration}
                  onChange={(e) => setNewLogDuration(Number(e.target.value))}
                  min={5}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Observation Notes</label>
              <textarea
                value={newLogNotes}
                onChange={(e) => setNewLogNotes(e.target.value)}
                placeholder="e.g. Pipeline pressure was normal; auxiliary pump 1 run for 2 hours."
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
              >
                Submit Availability Log
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Confirm Tanker Arrival (Admin / Maintenance Only) */}
      {(currentRole === "admin" || currentRole === "maintenance") && (
        <Modal
          isOpen={isConfirmTankerOpen}
          onClose={() => setIsConfirmTankerOpen(false)}
          title="Confirm Tanker Gate Intake"
          subtitle="Verify flowmeter reading and credit water volume to society sump"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Verified Intake Volume (Litres)
              </label>
              <input
                type="number"
                value={actualLitersInput}
                onChange={(e) => setActualLitersInput(Number(e.target.value))}
                min={500}
                max={30000}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Checked at society gate flowmeter.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfirmTankerOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTankerSubmit}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
              >
                Confirm &amp; Update Sump Buffer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
