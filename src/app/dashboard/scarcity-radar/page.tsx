"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatNumber, getStatusColor } from "@/lib/utils";
import {
  Radar,
  MapPin,
  Truck,
  Building,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Droplets,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ScarcityRadarPage() {
  const { allSocieties } = useAppStore();

  const [selectedMapSociety, setSelectedMapSociety] = useState(allSocieties[0]);

  // Comparative regional dataset
  const regionalSocieties = [
    {
      ...allSocieties[0],
      currentReserveLiters: 142500,
      daysRemaining: 4.2,
      groundwaterDepthM: 18.4,
      shortageSeverity: "medium",
      priorityScore: 68,
      tankerDemandRank: 2,
    },
    {
      ...allSocieties[1],
      currentReserveLiters: 48000,
      daysRemaining: 1.8,
      groundwaterDepthM: 22.8,
      shortageSeverity: "critical",
      priorityScore: 92,
      tankerDemandRank: 1,
    },
    {
      ...allSocieties[2],
      currentReserveLiters: 110000,
      daysRemaining: 5.6,
      groundwaterDepthM: 16.2,
      shortageSeverity: "low",
      priorityScore: 35,
      tankerDemandRank: 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              Regional Water Scarcity Radar &amp; Smart Tanker Dispatch
            </h1>
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
              <Radar className="h-3 w-3" />
              <span>Multi-Society Telemetry</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Correlates groundwater drawdowns and days-remaining reserves across neighboring layouts to allocate municipal tanker convoys fairly.
          </p>
        </div>
      </div>

      {/* Regional Radar Map & Comparison Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Radar Map Canvas Simulation (7 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-navy p-5 shadow-card lg:col-span-7 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <div className="flex items-center gap-2">
                <Radar className="h-5 w-5 text-aqua animate-spin" style={{ animationDuration: "12s" }} />
                <h3 className="font-bold text-base text-white">East Bangalore Aquifer Grid Radar</h3>
              </div>
              <span className="text-xs text-slate-400">Bellandur - Sarjapur Corridor</span>
            </div>

            {/* Radar UI Canvas */}
            <div className="relative my-6 h-72 w-full rounded-2xl bg-navy-900 border border-navy-700 overflow-hidden flex items-center justify-center">
              {/* Concentric radar rings */}
              <div className="absolute h-64 w-64 rounded-full border border-cyan-500/20" />
              <div className="absolute h-48 w-48 rounded-full border border-cyan-500/25" />
              <div className="absolute h-32 w-32 rounded-full border border-cyan-500/30" />
              <div className="absolute h-16 w-16 rounded-full border border-cyan-500/40" />

              {/* Crosshairs */}
              <div className="absolute h-full w-[1px] bg-cyan-500/20" />
              <div className="absolute w-full h-[1px] bg-cyan-500/20" />

              {/* Society Map Markers */}
              {regionalSocieties.map((soc) => (
                <div
                  key={soc.id}
                  onClick={() => setSelectedMapSociety(soc)}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition group ${
                    soc.id === "soc_greenwood_01"
                      ? "top-[40%] left-[55%]"
                      : soc.id === "soc_palm_meadows"
                      ? "top-[25%] left-[75%]"
                      : "top-[70%] left-[30%]"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute h-8 w-8 rounded-full animate-ping opacity-60 ${
                        soc.shortageSeverity === "critical"
                          ? "bg-rose-500"
                          : soc.shortageSeverity === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-white shadow-lg ${
                        soc.shortageSeverity === "critical"
                          ? "bg-rose-600"
                          : soc.shortageSeverity === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>

                  <div className="absolute left-6 top-0 hidden group-hover:block whitespace-nowrap rounded-lg bg-navy-800 p-2 text-[11px] shadow-xl border border-navy-600 z-10">
                    <div className="font-bold text-white">{soc.name}</div>
                    <div className="text-cyan-300">Days Left: {soc.daysRemaining}d</div>
                    <div className="text-slate-400">GW Depth: {soc.groundwaterDepthM}m</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-navy-700 pt-3">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical Shortage (&lt;2d)
              <span className="h-2 w-2 rounded-full bg-amber-500 ml-2" /> Moderate (2-4d)
              <span className="h-2 w-2 rounded-full bg-emerald-500 ml-2" /> Secure (&gt;5d)
            </span>
          </div>
        </div>

        {/* Smart Tanker Allocation Ranking (5 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold text-base text-content-primary">
                  Smart Municipal Tanker Allocation
                </h3>
                <p className="text-xs text-content-secondary">
                  Automated priority ranking based on shortage risk and population density.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {regionalSocieties
                .sort((a, b) => b.priorityScore - a.priorityScore)
                .map((soc, rank) => (
                  <div
                    key={soc.id}
                    className={`rounded-xl border p-3.5 transition ${
                      rank === 0
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              rank === 0
                                ? "bg-rose-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            Priority #{rank + 1}
                          </span>
                          <h4 className="font-bold text-xs text-content-primary">{soc.name}</h4>
                        </div>
                        <div className="text-[11px] text-content-secondary mt-1">
                          {soc.totalResidents} residents · {soc.totalApartments} flats
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-content-primary">
                          Score: {soc.priorityScore}/100
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            soc.shortageSeverity === "critical"
                              ? "text-rose-600"
                              : soc.shortageSeverity === "medium"
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {soc.daysRemaining} Days Left
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] border-t border-slate-200/60 pt-2">
                      <span className="text-slate-500">
                        Recommended Convoy: <strong>{rank === 0 ? "3x 12,000L" : "1x 6,000L"}</strong>
                      </span>
                      <button
                        onClick={() =>
                          alert(`Municipal tanker convoy assigned to ${soc.name} via BWSSB dispatcher.`)
                        }
                        className="font-bold text-primary hover:underline text-[11px]"
                      >
                        Dispatch Tanker →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            Algorithm weights: Reserve Depletion (45%), Population Density (30%), Groundwater Stress (25%).
          </div>
        </div>
      </div>
    </div>
  );
}

