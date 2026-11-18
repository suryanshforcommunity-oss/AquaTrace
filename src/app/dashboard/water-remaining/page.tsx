"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { calculateDaysRemaining } from "@/lib/daysRemaining";
import { formatNumber, formatLiters, getStatusColor } from "@/lib/utils";
import {
  Hourglass,
  Droplets,
  TrendingDown,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Info,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WaterRemainingPage() {
  const { selectedSociety, currentRole } = useAppStore();

  const [activeStorageLiters, setActiveStorageLiters] = useState<number>(142500);
  const [dailyBurnLiters, setDailyBurnLiters] = useState<number>(34000);
  const [incomingTankerLiters, setIncomingTankerLiters] = useState<number>(6000);
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.0);

  const calcResult = calculateDaysRemaining({
    usableStoredWaterLiters: activeStorageLiters,
    averageDailyConsumptionLiters: dailyBurnLiters,
    scheduledIncomingSupplyLiters: incomingTankerLiters,
    forecastedDemandMultiplier: demandMultiplier,
  });

  const statusStyle = getStatusColor(calcResult.shortageRisk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              Estimated Days of Water Remaining Engine
            </h1>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800 flex items-center gap-1">
              <Hourglass className="h-3 w-3" />
              <span>Depletion Runaway Projection</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Formula: Projected Stock(t+1) = Previous Stock + Incoming Tanker/Grid − Forecast Consumption.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Demand Stress Test:</span>
          {[
            { label: "Normal (1.0x)", val: 1.0 },
            { label: "Weekend (+10%)", val: 1.1 },
            { label: "Summer (+25%)", val: 1.25 },
          ].map((sc) => (
            <button
              key={sc.label}
              onClick={() => setDemandMultiplier(sc.val)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                demandMultiplier === sc.val ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resident Guidance Banner */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Apartment Water Runway (Block A - 402):</span>{" "}
              <span>
                Our society holds <strong>4.4 Days</strong> of uninterrupted water buffer. Recommended daily household consumption ceiling is <strong>350 Litres</strong> to prevent early emergency rationing.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
            Household Standing: In Normal Buffer
          </span>
        </div>
      )}

      {/* Hero Days Remaining Result Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-center">
          <div className="space-y-2 md:col-span-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
            <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">
              Current Autonomy Projection
            </span>
            <div className="font-extrabold text-4xl text-content-primary tracking-tight">
              {calcResult.formattedDays}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${statusStyle.bg}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                <span>{calcResult.shortageRisk} SHORTAGE RISK</span>
              </span>
            </div>
            <p className="text-[11px] text-content-secondary mt-1">
              Based on {formatNumber(calcResult.usableStoredWaterLiters)} L usable buffer and{" "}
              {formatNumber(calcResult.averageDailyConsumptionLiters)} L/day burn rate.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:col-span-8 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500">Active Usable Storage</span>
              <div className="mt-1 font-extrabold text-xl text-primary">
                {formatNumber(calcResult.usableStoredWaterLiters)} L
              </div>
              <span className="text-[10px] text-slate-400">Excludes bottom 10% sediment</span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500">Effective Daily Burn</span>
              <div className="mt-1 font-extrabold text-xl text-orange">
                {formatNumber(calcResult.averageDailyConsumptionLiters)} L
              </div>
              <span className="text-[10px] text-slate-400">Adjusted for {demandMultiplier}x multiplier</span>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <span className="text-[10px] font-bold uppercase text-slate-500">Scheduled Inflow (24h)</span>
              <div className="mt-1 font-extrabold text-xl text-emerald-700">
                + {formatNumber(calcResult.scheduledIncomingSupplyLiters)} L
              </div>
              <span className="text-[10px] text-slate-400">1 Tanker Delivery en route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Depletion Curve Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-content-primary">
              Projected Reserve Depletion Curve (Without Further Supply)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Day-by-day storage depletion trajectory based on active burn rate.
            </p>
          </div>
          <span className="text-xs text-slate-400">14-Day Simulation Window</span>
        </div>

        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={calcResult.depletionProjections}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="depletionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#073BCE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#073BCE" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: "#667085" }} />
              <YAxis tick={{ fontSize: 11, fill: "#667085" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`${formatNumber(Number(val))} L`, "Projected Reserve"]}
                contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="closingStockLiters"
                stroke="#073BCE"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#depletionGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Storage Tank Assets & Assumptions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Storage Sumps (7 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-7">
          <h3 className="font-bold text-sm text-content-primary mb-3">
            Society Storage Buffer Allocation (No Double-Counting)
          </h3>

          <div className="space-y-3">
            {[
              {
                name: "Underground Sump 1 (Potable Municipal)",
                capacity: 120000,
                current: 85000,
                pct: 70.8,
                status: "Optimal",
              },
              {
                name: "Underground Sump 2 (Auxiliary Tanker)",
                capacity: 80000,
                current: 43000,
                pct: 53.7,
                status: "Adequate",
              },
              {
                name: "RWH Retention Tank 1 (Treated Rainwater)",
                capacity: 40000,
                current: 14500,
                pct: 36.2,
                status: "Low",
              },
            ].map((tank) => (
              <div key={tank.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                <div className="flex items-center justify-between font-bold text-content-primary">
                  <span>{tank.name}</span>
                  <span>{tank.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${tank.pct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
                  <span>Current: {formatNumber(tank.current)} L</span>
                  <span>Capacity: {formatNumber(tank.capacity)} L</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions & Integrity Principles (5 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-content-primary mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Calculation Assumptions</span>
            </div>
            <ul className="space-y-2 text-xs text-content-secondary">
              {calcResult.assumptions.map((asm, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-primary font-bold">·</span>
                  <span>{asm}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
            Sensor telemetry refreshed every 5 minutes from ultrasonic tank transducers.
          </div>
        </div>
      </div>
    </div>
  );
}

