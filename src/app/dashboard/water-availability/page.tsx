"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { WaterAvailabilityLog, WaterSourceType } from "@/types";
import { formatNumber, formatLiters, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  Droplets,
  Plus,
  Filter,
  Download,
  Calendar,
  Clock,
  Radio,
  User,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Building,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function WaterAvailabilityPage() {
  const { availabilityLogs, addAvailabilityLog, selectedSociety, currentRole } = useAppStore();

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [source, setSource] = useState<WaterSourceType>("municipal");
  const [quantityLiters, setQuantityLiters] = useState<number>(60000);
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [storageTankName, setStorageTankName] = useState<string>("Underground Sump 1 (Potable)");
  const [shortageStatus, setShortageStatus] = useState<"surplus" | "adequate" | "low" | "critical">("adequate");
  const [notes, setNotes] = useState<string>("");

  const filteredLogs = availabilityLogs.filter((log) => {
    if (selectedSourceFilter === "all") return true;
    return log.source === selectedSourceFilter;
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const totalLoggedToday = availabilityLogs
    .filter((l) => l.date === todayStr || l.date === availabilityLogs[0]?.date)
    .reduce((acc, curr) => acc + (Number(curr.quantityLiters) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== "admin" && currentRole !== "maintenance") {
      alert("Permission Denied: Only Society Administrators or Maintenance Staff can log bulk water intake.");
      return;
    }

    addAvailabilityLog({
      societyId: selectedSociety.id,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      source,
      quantityLiters,
      durationMinutes,
      storageTankName,
      shortageStatus,
      notes: notes || "Recorded via Community Water Availability Portal",
      submittedBy:
        currentRole === "admin"
          ? "Vikram Sethi (Admin)"
          : currentRole === "maintenance"
          ? "Ramesh Kumar (Maintenance)"
          : "Resident Community Log (A-402)",
      submitterRole: currentRole,
      isSensorVerified: false,
    });
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = "ID,Date,Time,Source,QuantityLiters,DurationMinutes,StorageTank,ShortageStatus,SubmittedBy,SensorVerified\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.date}","${l.time}","${l.source}",${l.quantityLiters},${l.durationMinutes},"${l.storageTankName}","${l.shortageStatus}","${l.submittedBy}",${l.isSensorVerified}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water-availability-logs-${selectedSociety.id}.csv`;
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
                ? "Society Water Availability & Inflow Ledger"
                : "Daily Water Availability & Intake Desk"}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Core Module 1
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Transparent log of daily municipal supply, borewell cycles, and verified tanker replenishment for Greenwood Heights."
              : "Record and audit intake from municipal feeder lines, registered tankers, and deep borewells into society storage sumps."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>

          {currentRole === "admin" || currentRole === "maintenance" ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Record Water Intake</span>
            </button>
          ) : (
            <Link
              href="/dashboard/leakage"
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Supply Issue / Outage</span>
            </Link>
          )}
        </div>
      </div>

      {/* Resident Context Banner */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Resident Information:</span>{" "}
              <span>
                Daily water availability logs are managed by the society pump operator and cross-verified by electromagnetic flowmeters. Residents can monitor inflow timing and report pressure drops.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
            Current Sump Status: 78% Full (Supply Normal)
          </span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Inflow Today
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-slate-900">
            {formatNumber(totalLoggedToday)} L
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">3 Recorded batches</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Municipal Grid Flow
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-primary">65,000 L</div>
          <span className="text-[11px] text-slate-500">Duration: 3 hours steady flow</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Borewell Pumping Total
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-slate-900">32,000 L</div>
          <span className="text-[11px] text-slate-500">Pumping cycle: 240 mins</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Tanker Inflow (Gate Verified)
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-orange">12,000 L</div>
          <span className="text-[11px] text-slate-500">Cauvery Express #8821</span>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Filter by Source:</span>
            <div className="flex flex-wrap gap-1">
              {["all", "municipal", "tanker", "borewell", "rainwater"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedSourceFilter(f)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                    selectedSourceFilter === f
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-slate-400">{filteredLogs.length} verified records</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Date &amp; Time</th>
                <th className="py-2.5">Source</th>
                <th className="py-2.5">Volume Received</th>
                <th className="py-2.5">Duration</th>
                <th className="py-2.5">Storage Destination</th>
                <th className="py-2.5">Shortage Condition</th>
                <th className="py-2.5">Logging Credential</th>
                <th className="py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const statusStyle = getStatusColor(log.shortageStatus);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.date}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{log.time}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 capitalize">
                        {log.source}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-sm text-slate-900">
                      {formatNumber(log.quantityLiters)} L
                    </td>
                    <td className="py-3 text-slate-600">{log.durationMinutes} mins</td>
                    <td className="py-3 text-slate-600">{log.storageTankName}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{log.shortageStatus}</span>
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{log.submittedBy}</div>
                      <div className="text-[10px] flex items-center gap-1">
                        {log.isSensorVerified ? (
                          <span className="text-cyan-700 flex items-center gap-0.5">
                            <Radio className="h-2.5 w-2.5" />
                            <span>IoT Transducer Verified</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">Pump Operator Verified</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 max-w-xs truncate" title={log.notes}>
                      {log.notes || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Availability Log (Admin & Maintenance Only) */}
      {(currentRole === "admin" || currentRole === "maintenance") && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Water Availability Update"
          subtitle="Record intake from municipal feed, tanker delivery, or borewell cycle"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Water Source</label>
                <select
                  value={source}
                  onChange={(e: any) => setSource(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="municipal">Municipal Piped Feed (BWSSB)</option>
                  <option value="tanker">Commercial / Private Tanker</option>
                  <option value="borewell">Deep Aquifer Borewell</option>
                  <option value="rainwater">Rainwater Harvesting Sump</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Storage Sump</label>
                <select
                  value={storageTankName}
                  onChange={(e) => setStorageTankName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="Underground Sump 1 (Potable)">Underground Sump 1 (Potable)</option>
                  <option value="Underground Sump 2 (Auxiliary)">Underground Sump 2 (Auxiliary)</option>
                  <option value="Raw Water Sump (Block B)">Raw Water Sump (Block B)</option>
                  <option value="RWH Retention Tank 1">RWH Retention Tank 1</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Volume Received (Litres)</label>
                <input
                  type="number"
                  value={quantityLiters}
                  onChange={(e) => setQuantityLiters(Number(e.target.value))}
                  min={100}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Duration of Supply (Minutes)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  min={5}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Shortage Condition</label>
              <select
                value={shortageStatus}
                onChange={(e: any) => setShortageStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="surplus">Surplus (Sumps at capacity)</option>
                <option value="adequate">Adequate (Regular operational buffer)</option>
                <option value="low">Low (Requires rationing or tanker backup)</option>
                <option value="critical">Critical (&lt;24 hours water remaining)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Notes &amp; Observations</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Line pressure nominal at 2.8 bar. Water clarity clean."
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
              >
                Save Availability Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

