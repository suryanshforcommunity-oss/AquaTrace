"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { formatNumber, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  ArrowDownToLine,
  Plus,
  Radio,
  Clock,
  Layers,
  AlertTriangle,
  Download,
  CheckCircle2,
  Activity,
  Zap,
  Info,
  Calendar,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

export default function GroundwaterPage() {
  const {
    borewellPoints,
    groundwaterReadings,
    addGroundwaterReading,
    selectedSociety,
    currentRole,
  } = useAppStore();

  const [selectedBorewellId, setSelectedBorewellId] = useState<string>("bw_02");
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y">("30D");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Form states
  const [manualDepth, setManualDepth] = useState<number>(18.45);
  const [casingMark, setCasingMark] = useState<string>("Collar Notch A");
  const [submitterName, setSubmitterName] = useState<string>(
    currentRole === "admin" ? "Vikram Sethi (Admin)" : "Ramesh Kumar (Plumber)"
  );
  const [readingNotes, setReadingNotes] = useState<string>("");

  const currentSocietyBorewells = borewellPoints.filter((b) => b.id.includes(selectedSociety.id)).length > 0
    ? borewellPoints.filter((b) => b.id.includes(selectedSociety.id))
    : borewellPoints;

  const currentBorewell =
    currentSocietyBorewells.find((b) => b.id === selectedBorewellId) || currentSocietyBorewells[0];

  const readingsForWell = groundwaterReadings.filter(
    (r) => r.borewellId === selectedBorewellId
  );

  // Formatted chart data
  const chartData = [
    { date: "15 Oct", depth: 16.9, historicalAvg: 16.5, pwlDepth: 22.1 },
    { date: "25 Oct", depth: 17.3, historicalAvg: 16.8, pwlDepth: 22.6 },
    { date: "05 Nov", depth: 17.65, historicalAvg: 17.1, pwlDepth: 23.2 },
    { date: "10 Nov", depth: 17.8, historicalAvg: 17.3, pwlDepth: 23.5 },
    { date: "12 Nov", depth: 17.92, historicalAvg: 17.4, pwlDepth: 23.6 },
    { date: "14 Nov", depth: 18.15, historicalAvg: 17.5, pwlDepth: 23.9 },
    { date: "16 Nov", depth: 18.35, historicalAvg: 17.7, pwlDepth: 24.0 },
    { date: "17 Nov", depth: currentBorewell.currentDepthMeters, historicalAvg: 17.8, pwlDepth: currentBorewell.pwlMeters },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== "admin" && currentRole !== "maintenance") {
      alert("Permission Denied: Only Administrators or Maintenance Technicians can submit manual dip-tape readings.");
      return;
    }

    const calculatedElevation = +(currentBorewell.referenceDatumMsl - manualDepth).toFixed(2);
    const isStaff = currentRole === "admin" || currentRole === "maintenance";
    addGroundwaterReading({
      societyId: selectedSociety.id,
      borewellId: selectedBorewellId,
      depthMeters: manualDepth,
      waterElevationMsl: calculatedElevation,
      source: "manual_dip_tape",
      reportedBy: submitterName || (isStaff ? "Vikram Sethi (Admin)" : "Resident Community Log"),
      status: isStaff ? "verified" : "flagged",
      notes: `Manual reading recorded at ${casingMark}. ${readingNotes}`,
    });
    setIsManualModalOpen(false);
  };

  const handleExportData = () => {
    const headers = "ReadingID,Borewell,DepthBelowDatumMeters,WaterElevationMsl,Source,ReportedBy,Timestamp,Status\n";
    const rows = readingsForWell
      .map(
        (r) =>
          `"${r.id}","${currentBorewell.name}",${r.depthMeters},${r.waterElevationMsl},"${r.source}","${r.reportedBy}","${r.timestamp}","${r.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groundwater-telemetry-${selectedBorewellId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header: Role Differentiated */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-slate-900 md:text-2xl font-sans tracking-tight">
              {currentRole === "resident"
                ? "Society Groundwater & Aquifer Table Status"
                : "Groundwater Depth & Aquifer Telemetry"}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Radio className="h-3 w-3 text-primary animate-pulse" />
              <span>Core Module 2</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Live depth of the water table beneath our society. Inverted chart shows how conservation habits help maintain the groundwater reserves."
              : "Sub-surface piezoresistive transducer feeds and ground-truth dip-tape verification relative to MSL casing datums."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export Hydrograph</span>
          </button>

          {currentRole === "admin" || currentRole === "maintenance" ? (
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Dip-Tape Reading</span>
            </button>
          ) : (
            <Link
              href="/dashboard/conservation"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Award className="h-4 w-4" />
              <span>Log Water Saving Action</span>
            </Link>
          )}
        </div>
      </div>

      {/* Resident Educational Advisory Banner */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Resident Aquifer Advisory:</span>{" "}
              <span>
                Deep borewell PBW-02 is currently at <strong>18.4m</strong> (Caution range: 15–20m). To protect the aquifer and avoid pump burnout, society motors rest daily from <strong>2:00 PM to 5:00 PM</strong>.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 shrink-0">
            Next Rest Cycle: 14:00 – 17:00 IST
          </span>
        </div>
      )}

      {/* Borewell Selector Bar & Reference Datum Details */}
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-slate-700">Select Monitoring Borewell:</span>
          <select
            value={selectedBorewellId}
            onChange={(e) => setSelectedBorewellId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-primary focus:outline-none"
          >
            {currentSocietyBorewells.map((bw) => (
              <option key={bw.id} value={bw.id}>
                {bw.name} ({bw.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>
            Casing Datum: <strong className="text-slate-900">+{currentBorewell.referenceDatumMsl}m MSL</strong>
          </span>
          <span>·</span>
          <span>
            Total Depth: <strong className="text-slate-900">{currentBorewell.totalDepthMeters}m</strong>
          </span>
          <span>·</span>
          <span>
            Motor Yield: <strong className="text-primary font-semibold">{currentBorewell.yieldLpm} LPM</strong>
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Telemetry Synced
          </span>
        </div>
      </div>

      {/* Engineering KPI Strip (4 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Current Groundwater Depth */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Current Groundwater Depth
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-extrabold text-2xl text-content-primary">
              {currentBorewell.currentDepthMeters.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">m below datum</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium flex items-center justify-between">
            <span>Warning threshold: {currentBorewell.warningThresholdMeters}m</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold">Caution Zone</span>
          </div>
        </div>

        {/* Card 2: SWL vs PWL Dynamic Drawdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            SWL / PWL Drawdown Cone
          </span>
          <div className="mt-1 font-extrabold text-2xl text-content-primary">
            {currentBorewell.swlMeters}m / {currentBorewell.pwlMeters}m
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Cone of depression:{" "}
            <strong className="text-content-primary">
              {(currentBorewell.pwlMeters - currentBorewell.swlMeters).toFixed(1)}m
            </strong>{" "}
            during pumping
          </div>
        </div>

        {/* Card 3: 30-Day Recharge Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            30-Day Aquifer Recharge Rate
          </span>
          <div className="mt-1 font-extrabold text-2xl text-emerald-700">+0.12 m/week</div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            Post-Monsoon Infiltration Phase
          </div>
        </div>

        {/* Card 4: Motor & Electrical Telemetry */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Submersible Motor Status
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-extrabold text-2xl text-primary">{currentBorewell.yieldLpm} LPM</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {currentBorewell.status.toUpperCase()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Current: 4.8 A · Dry-run trip: <strong className="text-emerald-600">ARMED</strong>
          </div>
        </div>
      </div>

      {/* Inverted Sub-Surface Depth Hydrograph */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-content-primary">
                Aquifer Depth Hydrograph (Physical Inverted Scale)
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                0m Surface → 30m Depleted
              </span>
            </div>
            <p className="text-xs text-content-secondary mt-0.5">
              Notice: The Y-axis is inverted (0m at the top down to 26m). A downward curve directly mirrors the physical depletion of the water table.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" /> Static Water Level (SWL)
            </span>
            <span className="flex items-center gap-1 font-semibold text-orange">
              <span className="h-2 w-2 rounded-full bg-orange" /> Pumping Drawdown (PWL)
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Historical Avg
            </span>
          </div>
        </div>

        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#667085" }} />
              <YAxis
                domain={[14, 26]}
                reversed={true}
                tick={{ fontSize: 11, fill: "#667085" }}
                tickFormatter={(v) => `${v}m`}
              />
              <Tooltip
                formatter={(val: any, name: string) => [
                  `${val} metres below reference`,
                  name === "depth"
                    ? "Static Water Level"
                    : name === "pwlDepth"
                    ? "Pumping Water Level"
                    : "Historical Baseline",
                ]}
                contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
              />
              <ReferenceLine y={15} stroke="#159B68" strokeDasharray="3 3" label={{ value: "Safe (<15m)", fill: "#159B68", fontSize: 10 }} />
              <ReferenceLine y={20} stroke="#E8A317" strokeDasharray="3 3" label={{ value: "Warning Threshold (20m)", fill: "#E8A317", fontSize: 10 }} />
              <ReferenceLine y={24} stroke="#DC4545" strokeDasharray="3 3" label={{ value: "Critical Stress (24m)", fill: "#DC4545", fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="depth"
                stroke="#073BCE"
                strokeWidth={3}
                dot={{ r: 5, fill: "#073BCE" }}
              />
              <Line
                type="monotone"
                dataKey="pwlDepth"
                stroke="#FF6900"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#FF6900" }}
              />
              <Line
                type="monotone"
                dataKey="historicalAvg"
                stroke="#94A3B8"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Verification Table + Aquifer Resting Advisory */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Readings Audit Table (8 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-content-primary">
                Groundwater Telemetry &amp; Manual Verification Log
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Audit trail separating IoT piezoresistive pings from community acoustic dip-tape ground truths.
              </p>
            </div>
            <span className="text-xs text-slate-400">{readingsForWell.length} total entries</span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Date &amp; Time</th>
                  <th className="py-2.5">Data Source</th>
                  <th className="py-2.5">Depth Below Datum</th>
                  <th className="py-2.5">Water Elevation</th>
                  <th className="py-2.5">Reported By</th>
                  <th className="py-2.5">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readingsForWell.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 whitespace-nowrap text-content-primary font-medium">
                      {formatDate(r.timestamp)}
                    </td>
                    <td className="py-2.5">
                      {r.source === "iot_transducer" ? (
                        <span className="rounded-md bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-bold text-cyan-700 flex items-center gap-1 w-fit">
                          <Radio className="h-2.5 w-2.5 text-cyan-600 animate-pulse" />
                          <span>IoT Transducer</span>
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700 w-fit">
                          Manual Dip-Tape
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-bold text-content-primary">
                      {r.depthMeters.toFixed(2)} m
                    </td>
                    <td className="py-2.5 text-slate-600">
                      +{r.waterElevationMsl.toFixed(2)} m MSL
                    </td>
                    <td className="py-2.5 text-slate-700">{r.reportedBy}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 capitalize">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aquifer Health Advisory Card (4 cols) */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-card">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Aquifer Resting Cycle Advisory</span>
            </div>
            <p className="mt-2 text-xs text-amber-900 leading-relaxed">
              Localized cone of depression has deepened to <strong>5.7 metres</strong> during active motor cycles. To prevent motor cavitation, silt ingress, and drawdown runaway:
            </p>
            <div className="mt-3 rounded-xl bg-white p-3 border border-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Recommended Run Window:</span>
                <strong className="text-content-primary">45 mins max</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Mandatory Resting Window:</span>
                <strong className="text-content-primary">90 mins recharge</strong>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => alert("Smart rest cycle timer configured on ESP32 motor relay!")}
                className="w-full rounded-lg bg-amber-600 py-2 text-center text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
              >
                Apply Automated Rest Schedule
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-2">
            <div className="flex items-center gap-2 text-content-primary font-bold text-sm">
              <Activity className="h-4 w-4 text-primary" />
              <span>Hydrostatic Transducer Specs</span>
            </div>
            <div className="text-xs text-content-secondary space-y-1">
              <div className="flex justify-between">
                <span>Sensor Type:</span>
                <span className="font-medium text-content-primary">316L Piezoresistive</span>
              </div>
              <div className="flex justify-between">
                <span>Zero Drift Offset:</span>
                <span className="font-medium text-emerald-600">±0.02 m (Calibrated)</span>
              </div>
              <div className="flex justify-between">
                <span>Telemetry Node:</span>
                <span className="font-medium text-content-primary">ESP32 LoRaWAN #GW-02</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Manual Dip-Tape Submission (Admin & Maintenance Only) */}
      {(currentRole === "admin" || currentRole === "maintenance") && (
        <Modal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          title="Submit Manual Dip-Tape Groundwater Reading"
          subtitle="Verify aquifer depth using an acoustic dip tape or plunker"
        >
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Select Borewell
              </label>
              <select
                value={selectedBorewellId}
                onChange={(e) => setSelectedBorewellId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                {currentSocietyBorewells.map((bw) => (
                  <option key={bw.id} value={bw.id}>
                    {bw.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Measured Depth (Metres below casing)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={manualDepth}
                  onChange={(e) => setManualDepth(Number(e.target.value))}
                  min={1}
                  max={300}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Casing Reference Mark
                </label>
                <input
                  type="text"
                  value={casingMark}
                  onChange={(e) => setCasingMark(e.target.value)}
                  placeholder="e.g. Collar Notch A"
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Recorded By (Technician / Operator)
              </label>
              <input
                type="text"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Field Observations
              </label>
              <textarea
                value={readingNotes}
                onChange={(e) => setReadingNotes(e.target.value)}
                placeholder="e.g. Acoustic sounder ping sharp at 18.45m; motor was off for 2 hours prior."
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
              >
                Save Ground Truth Reading
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

