"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { WaterQualityReading } from "@/types";
import { formatDateTime, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  FlaskConical,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Thermometer,
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
} from "recharts";

export default function WaterQualityPage() {
  const { waterQualityReadings, addWaterQualityReading, selectedSociety, currentRole } =
    useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<string>("Underground Sump 1 (Potable Municipal Blend)");
  const [tds, setTds] = useState<number>(185);
  const [turbidity, setTurbidity] = useState<number>(1.2);
  const [ph, setPh] = useState<number>(7.4);

  const latestReading = waterQualityReadings[0];

  const qualityTrendData = [
    { date: "11 Nov", tds: 195, turbidity: 1.4, ph: 7.2 },
    { date: "12 Nov", tds: 190, turbidity: 1.3, ph: 7.3 },
    { date: "13 Nov", tds: 188, turbidity: 1.1, ph: 7.4 },
    { date: "14 Nov", tds: 192, turbidity: 1.5, ph: 7.3 },
    { date: "15 Nov", tds: 180, turbidity: 1.2, ph: 7.5 },
    { date: "16 Nov", tds: 182, turbidity: 1.1, ph: 7.3 },
    { date: "17 Nov", tds: latestReading ? latestReading.tdsPpm : 184, turbidity: latestReading ? latestReading.turbidityNtu : 1.2, ph: latestReading ? latestReading.ph : 7.3 },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAbnormal = tds > 500 || turbidity > 5.0 || ph < 6.5 || ph > 8.5;
    addWaterQualityReading({
      societyId: selectedSociety.id,
      measurementPoint: selectedPoint,
      tdsPpm: tds,
      turbidityNtu: turbidity,
      ph: ph,
      status: isAbnormal ? "abnormal_range" : "normal_range",
      screeningDisclaimer:
        "Screening indicator only. Basic sensor parameters (TDS, Turbidity, pH) do not test for bacterial contamination or heavy metals. Laboratory testing recommended for potability certification.",
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header: Role Differentiated */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-slate-900 md:text-2xl font-sans tracking-tight">
              {currentRole === "resident"
                ? "Society Tap Water Quality & Screening Status"
                : "Water Quality Screening Telemetry & Samples"}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Online Telemetry
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Live sensor screening for tap water delivered to apartments. Continuous tracking of Total Dissolved Solids (TDS), clarity, and pH."
              : "Continuous screening indicators for TDS, optical turbidity, and potential hydrogen (pH) across central sumps and overhead distribution headers."}
          </p>
        </div>

        {currentRole === "admin" || currentRole === "maintenance" ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Record Quality Sample</span>
          </button>
        ) : (
          <Link
            href="/dashboard/leakage"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shrink-0"
          >
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Report Water Discoloration / Odor</span>
          </Link>
        )}
      </div>

      {/* Mandatory Regulatory Potability Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-xs text-amber-900">
            Screening Telemetry Notice: Continuous Screening vs Certified Potability
          </h4>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            These automated sensors provide continuous operational screening (TDS, Turbidity, pH). They <strong>do not replace periodic certified NABL microbiological testing</strong>. Common tap water in Bangalore requires standard point-of-use reverse osmosis (RO) or UV filtration for direct consumption.
          </p>
        </div>
      </div>

      {/* Resident Guidance Card */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-700 space-y-1.5">
          <div className="font-semibold text-slate-900 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span>Domestic Usage Assessment for Greenwood Heights Tap Water</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-semibold text-slate-900 block text-[11px]">Bathing &amp; Washing:</span>
              <span className="text-[11px] text-emerald-700 font-medium">✓ Optimal (Soft blend, TDS 342 ppm)</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-semibold text-slate-900 block text-[11px]">Cooking &amp; Boiled Food:</span>
              <span className="text-[11px] text-emerald-700 font-medium">✓ Safe after normal boiling</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-semibold text-slate-900 block text-[11px]">Direct Drinking:</span>
              <span className="text-[11px] text-primary font-medium">Use domestic RO or UV filter</span>
            </div>
          </div>
        </div>
      )}

      {/* 3 Core Screening Parameters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TDS */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Total Dissolved Solids (TDS)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Desirable Range
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-bold font-mono text-3xl text-slate-900">
              {latestReading?.tdsPpm || 184}
            </span>
            <span className="text-xs font-semibold text-slate-500">ppm (mg/L)</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            BIS 10500 standard: &lt;500 ppm desirable. Source: Municipal treated blend.
          </p>
        </div>

        {/* Turbidity */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Optical Turbidity
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Clear Clarity
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-bold font-mono text-3xl text-slate-900">
              {latestReading?.turbidityNtu || 1.2}
            </span>
            <span className="text-xs font-semibold text-slate-500">NTU</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            BIS 10500 standard: &lt;5.0 NTU limit. Dual media filter active.
          </p>
        </div>

        {/* pH */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Potential Hydrogen (pH)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Neutral Balanced
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-bold font-mono text-3xl text-slate-900">
              {latestReading?.ph || 7.4}
            </span>
            <span className="text-xs font-semibold text-slate-500">pH scale</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Permissible range: 6.5 – 8.5. Optimal non-corrosive balance.
          </p>
        </div>
      </div>

      {/* Quality Trend Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-content-primary">
              7-Day Water Quality Screening Parameter Trend
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Continuously monitored via submerged analog conductivity and optical scatter probes.
            </p>
          </div>
          <span className="text-xs text-slate-400">Monitoring Point: Sump 1</span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#667085" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#667085" }} domain={[150, 220]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#667085" }} domain={[0, 10]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="tds" stroke="#073BCE" name="TDS (ppm)" strokeWidth={2.5} />
              <Line yAxisId="right" type="monotone" dataKey="turbidity" stroke="#20B8C4" name="Turbidity (NTU)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="ph" stroke="#FF6900" name="pH" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal: Record Sample (Admin & Maintenance Only) */}
      {(currentRole === "admin" || currentRole === "maintenance") && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Water Quality Test Sample"
          subtitle="Log benchtop probe reading or manual test strip measurement"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Sampling Point</label>
              <select
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="Underground Sump 1 (Potable Municipal Blend)">
                  Underground Sump 1 (Potable Municipal Blend)
                </option>
                <option value="Borewell #2 Raw Feed">Borewell #2 Raw Feed</option>
                <option value="RWH Retention Tank 1 (Post-Filter)">
                  RWH Retention Tank 1 (Post-Filter)
                </option>
                <option value="Clubhouse Overhead Sump">Clubhouse Overhead Sump</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">TDS (ppm)</label>
                <input
                  type="number"
                  value={tds}
                  onChange={(e) => setTds(Number(e.target.value))}
                  min={10}
                  max={2000}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Turbidity (NTU)</label>
                <input
                  type="number"
                  step="0.1"
                  value={turbidity}
                  onChange={(e) => setTurbidity(Number(e.target.value))}
                  min={0}
                  max={50}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  min={1}
                  max={14}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold font-mono"
                />
              </div>
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
                Record Screening Result
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

