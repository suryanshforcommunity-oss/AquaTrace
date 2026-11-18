"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { RainwaterHarvestingUnit, MaintenanceChecklistLog } from "@/types";
import { formatNumber, formatDate, getStatusColor } from "@/lib/utils";
import { calculateRWHPotential } from "@/lib/rwhCalculator";
import { Modal } from "@/components/shared/Modal";
import {
  CloudRain,
  Plus,
  Calculator,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  Clock,
  Sparkles,
  Info,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RainwaterPage() {
  const { rwhUnits, maintenanceLogs, addRwhUnit, addMaintenanceLog, selectedSociety, currentRole } =
    useAppStore();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(rwhUnits[0]?.id || "rwh_001");
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Calculator interactive state
  const currentUnit = rwhUnits.find((u) => u.id === selectedUnitId) || rwhUnits[0];

  const [calcRoofArea, setCalcRoofArea] = useState<number>(currentUnit?.roofAreaSqM || 650);
  const [calcRainfall, setCalcRainfall] = useState<number>(currentUnit?.annualAvgRainfallMm || 850);
  const [calcRunoffCoeff, setCalcRunoffCoeff] = useState<number>(currentUnit?.runoffCoefficient || 0.85);
  const [calcEfficiency, setCalcEfficiency] = useState<number>(currentUnit?.collectionEfficiency || 0.90);
  const [calcActualCollected, setCalcActualCollected] = useState<number>(currentUnit?.actualCollectedLiters || 345000);

  const calcResult = calculateRWHPotential({
    roofAreaSqM: calcRoofArea,
    rainfallMm: calcRainfall,
    runoffCoefficient: calcRunoffCoeff,
    collectionEfficiency: calcEfficiency,
    actualCollectedLiters: calcActualCollected,
  });

  // Maintenance form state
  const [guttersCleared, setGuttersCleared] = useState<boolean>(true);
  const [firstFlushDiverted, setFirstFlushDiverted] = useState<boolean>(true);
  const [filterMeshCleaned, setFilterMeshCleaned] = useState<boolean>(true);
  const [pipeJointsInspected, setPipeJointsInspected] = useState<boolean>(true);
  const [sedimentFlushed, setSedimentFlushed] = useState<boolean>(true);
  const [checklistNotes, setChecklistNotes] = useState<string>("");
  const [inspectorName, setInspectorName] = useState<string>(
    currentRole === "admin" ? "Vikram Sethi (Admin)" : "Ramesh Kumar (Plumber)"
  );

  // Unit registration state
  const [newUnitName, setNewUnitName] = useState("");
  const [newBuildingBlock, setNewBuildingBlock] = useState("Block C Rooftop");
  const [newRoofArea, setNewRoofArea] = useState(800);
  const [newFilterType, setNewFilterType] = useState("Rainy Dual-Vortex Silt Mesh");
  const [newTankCapacity, setNewTankCapacity] = useState(50000);

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allPassed =
      guttersCleared && firstFlushDiverted && filterMeshCleaned && pipeJointsInspected && sedimentFlushed;
    addMaintenanceLog({
      unitId: selectedUnitId,
      societyId: selectedSociety.id,
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectorName: inspectorName || (currentRole === "admin" ? "Vikram Sethi (Admin)" : "Ramesh Kumar (Plumber)"),
      guttersCleared,
      firstFlushDiverted,
      filterMeshCleaned,
      pipeJointsInspected,
      storageTankSedimentFlushed: sedimentFlushed,
      overallStatus: allPassed ? "passed" : "repairs_needed",
      notes: checklistNotes || "Comprehensive maintenance inspection completed.",
    });
    setIsChecklistModalOpen(false);
  };

  const handleRegisterUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const potential = Math.round(newRoofArea * 850 * 0.85 * 0.9);
    addRwhUnit({
      societyId: selectedSociety.id,
      name: newUnitName,
      buildingBlock: newBuildingBlock,
      roofAreaSqM: newRoofArea,
      annualAvgRainfallMm: 850,
      runoffCoefficient: 0.85,
      collectionEfficiency: 0.9,
      potentialVolumeLiters: potential,
      actualCollectedLiters: 0,
      effectivenessPercent: 0,
      filterType: newFilterType,
      storageTankCapacityLiters: newTankCapacity,
      lastInspectionDate: new Date().toISOString().split("T")[0],
      nextMaintenanceDue: "2026-12-15",
      status: "optimal",
      inspectorName: inspectorName || "Maintenance Engineer",
    });
    setIsRegisterModalOpen(false);
  };

  const unitComparisonData = rwhUnits.map((u) => ({
    name: u.buildingBlock,
    potential: Math.round(u.potentialVolumeLiters / 1000),
    actual: Math.round(u.actualCollectedLiters / 1000),
  }));

  return (
    <div className="space-y-6">
      {/* Header: Role Differentiated */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-slate-900 md:text-2xl font-sans tracking-tight">
              {currentRole === "resident"
                ? "Society Rainwater Harvesting & Yield Calculator"
                : "Rainwater Harvesting & Maintenance Inspection Desk"}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Core Module 3
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Track how Greenwood Heights collects monsoon precipitation to refill storage sumps. Calculate potential yield for your terrace or balcony."
              : "Register rooftop catchments, calculate runoff yield efficiency, log pre-monsoon maintenance, and inspect dual-vortex filters."}
          </p>
        </div>

        {currentRole === "admin" || currentRole === "maintenance" ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <CheckSquare className="h-4 w-4 text-emerald-600" />
              <span>Log Maintenance Checklist</span>
            </button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Register Catchment Unit</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/conservation"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Award className="h-4 w-4" />
              <span>Log Water Saving Action</span>
            </Link>
          </div>
        )}
      </div>

      {/* Resident Info Banner */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Society RWH Impact:</span>{" "}
              <span>
                Our 3 rooftop catchments have harvested <strong>845,000 Litres</strong> this season, reducing private tanker dependency by ~18% and recharging shallow borewells.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
            All 3 Rooftop Filters: Verified Clean &amp; Active
          </span>
        </div>
      )}

      {/* RWH Units Selector & Status Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {rwhUnits.map((unit) => {
          const isSelected = unit.id === selectedUnitId;
          const statusStyle = getStatusColor(unit.status);
          return (
            <div
              key={unit.id}
              onClick={() => {
                setSelectedUnitId(unit.id);
                setCalcRoofArea(unit.roofAreaSqM);
                setCalcActualCollected(unit.actualCollectedLiters);
              }}
              className={`cursor-pointer rounded-2xl border p-4 transition shadow-card ${
                isSelected
                  ? "border-primary bg-primary-light/30 shadow-card-hover"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-content-primary">{unit.name}</h4>
                  <p className="text-xs text-content-secondary mt-0.5">{unit.buildingBlock}</p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}
                >
                  {unit.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2.5">
                <div>
                  <span className="text-[10px] text-slate-400">Catchment Area:</span>
                  <div className="font-bold text-content-primary">{unit.roofAreaSqM} m²</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Yield Efficiency:</span>
                  <div className="font-bold text-emerald-700">{unit.effectivenessPercent}%</div>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Filter: {unit.filterType.split(" ")[0]}</span>
                <span>Next due: {unit.nextMaintenanceDue}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Effectiveness Calculator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-base text-content-primary">
                Official RWH Effectiveness &amp; Yield Calculator
              </h3>
            </div>
            <p className="text-xs text-content-secondary mt-0.5">
              Formula: Potential Collection = Catchment Area (m²) × Rainfall (mm) × Runoff Coeff × Collection Efficiency (1 mm/m² = 1 Litre)
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Active Unit: {currentUnit.name}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Form (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Catchment Roof Area (A) [m²]
                </label>
                <input
                  type="number"
                  value={calcRoofArea}
                  onChange={(e) => setCalcRoofArea(Number(e.target.value))}
                  min={10}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Terrace slab or shed roof</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Annual / Event Rainfall (R) [mm]
                </label>
                <input
                  type="number"
                  value={calcRainfall}
                  onChange={(e) => setCalcRainfall(Number(e.target.value))}
                  min={1}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Bangalore historical avg: 850 mm</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Runoff Coefficient (C) [0.80 - 0.95]
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcRunoffCoeff}
                  onChange={(e) => setCalcRunoffCoeff(Number(e.target.value))}
                  min={0.5}
                  max={1.0}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">0.85 typical for concrete roof</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Collection Efficiency (E) [0.80 - 0.95]
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={calcEfficiency}
                  onChange={(e) => setCalcEfficiency(Number(e.target.value))}
                  min={0.5}
                  max={1.0}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Accounts for first-flush diversion</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">
                Actual Measured Collection (Litres) [Metered]
              </label>
              <input
                type="number"
                value={calcActualCollected}
                onChange={(e) => setCalcActualCollected(Number(e.target.value))}
                min={0}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Logged from tank level or flow transmitter
              </span>
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="flex flex-col justify-between rounded-xl bg-primary-light/40 border border-primary-dim p-4 lg:col-span-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Calculated Potential vs Actual
              </span>

              <div className="mt-3 space-y-3">
                <div>
                  <span className="text-xs text-content-secondary">Estimated Potential Volume:</span>
                  <div className="font-extrabold text-2xl text-primary">
                    {formatNumber(calcResult.potentialVolumeLiters)} Litres
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ({calcResult.potentialVolumeKl} kL potential harvest)
                  </span>
                </div>

                <div>
                  <span className="text-xs text-content-secondary">Actual Recorded Yield:</span>
                  <div className="font-extrabold text-xl text-content-primary">
                    {formatNumber(calcResult.actualCollectedLiters)} Litres
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Calculated Effectiveness:</span>
                    <span className="font-extrabold text-base text-emerald-700">
                      {calcResult.effectivenessPercent}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min(100, calcResult.effectivenessPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-primary-dim/40 pt-3 text-[10px] text-content-secondary">
              <strong>Equivalence:</strong> Enough to fulfill ~{formatNumber(calcResult.perCapitaDaysWaterEquivalence)} resident-days of domestic water at 135 L/person/day.
            </div>
          </div>
        </div>
      </div>

      {/* Chart: Potential vs Actual Collection Across Society Units */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-content-primary">
              RWH Potential vs Actual Yield by Building Block
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Comparison in kL (1,000 Litres) across all registered community units.
            </p>
          </div>
          <span className="text-xs text-slate-400">Labels distinguish estimated vs measured</span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#667085" }} />
              <YAxis tick={{ fontSize: 11, fill: "#667085" }} tickFormatter={(v) => `${v}kL`} />
              <Tooltip
                formatter={(val: any, name: string) => [
                  `${val} kL (${formatNumber(val * 1000)} Litres)`,
                  name === "potential" ? "Estimated Potential" : "Actual Measured Catch",
                ]}
                contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
              />
              <Legend />
              <Bar dataKey="potential" fill="#073BCE" name="Estimated Potential (kL)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" fill="#20B8C4" name="Actual Measured (kL)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Maintenance Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-content-primary">
              RWH Inspection &amp; Maintenance Checklist Log
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Mandatory preventive checklists for gutters, first-flush diverters, and filter media.
            </p>
          </div>
          <button
            onClick={() => setIsChecklistModalOpen(true)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            + Add Inspection
          </button>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Unit Name</th>
                <th className="py-2.5">Inspector</th>
                <th className="py-2.5">Checklist Items Verified</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maintenanceLogs.map((log) => {
                const statusStyle = getStatusColor(log.overallStatus);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-semibold text-content-primary">{log.inspectionDate}</td>
                    <td className="py-2.5 text-slate-700">{log.unitId}</td>
                    <td className="py-2.5 text-slate-600">{log.inspectorName}</td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            log.guttersCleared ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          Gutters
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            log.firstFlushDiverted ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          1st Flush
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            log.filterMeshCleaned ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          Filter
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            log.storageTankSedimentFlushed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          Sediment
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{log.overallStatus.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals: Admin & Maintenance Only */}
      {(currentRole === "admin" || currentRole === "maintenance") && (
        <>
          {/* Modal: Complete Maintenance Inspection */}
          <Modal
            isOpen={isChecklistModalOpen}
            onClose={() => setIsChecklistModalOpen(false)}
            title="Complete Rainwater Harvesting Inspection"
            subtitle="Verify all 5 components of the RWH system before signing off"
          >
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">RWH System</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                >
                  {rwhUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.buildingBlock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <span className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Physical Inspection Items
                </span>

                <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={guttersCleared}
                    onChange={(e) => setGuttersCleared(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-0"
                  />
                  <span>Rooftop gutters &amp; drop pipes cleared of leaves/debris</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={firstFlushDiverted}
                    onChange={(e) => setFirstFlushDiverted(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-0"
                  />
                  <span>First-flush diverter ball/valve inspected &amp; flushed</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterMeshCleaned}
                    onChange={(e) => setFilterMeshCleaned(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-0"
                  />
                  <span>Filter sand-gravel cartridge backwashed / cleaned</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pipeJointsInspected}
                    onChange={(e) => setPipeJointsInspected(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-0"
                  />
                  <span>Conveyance pipe joints leak-free and secure</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-content-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sedimentFlushed}
                    onChange={(e) => setSedimentFlushed(e.target.checked)}
                    className="h-4 w-4 rounded text-primary focus:ring-0"
                  />
                  <span>Storage sump / recharge pit bottom sediment drained</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">Inspector Name</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">Inspection Notes</label>
                <textarea
                  value={checklistNotes}
                  onChange={(e) => setChecklistNotes(e.target.value)}
                  placeholder="e.g. Cleared 4kg silt from filter chamber 2. Reset diverter flapper."
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Sign Off Checklist
                </button>
              </div>
            </form>
          </Modal>

          {/* Modal: Register RWH Unit */}
          <Modal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            title="Register New Rainwater Harvesting Unit"
            subtitle="Add a new building rooftop catchment and storage or recharge asset"
          >
            <form onSubmit={handleRegisterUnit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Unit Display Name</label>
                  <input
                    type="text"
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                    placeholder="e.g. Block C Rooftop Catchment"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Building Block / Location</label>
                  <input
                    type="text"
                    value={newBuildingBlock}
                    onChange={(e) => setNewBuildingBlock(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Catchment Area (m²)</label>
                  <input
                    type="number"
                    value={newRoofArea}
                    onChange={(e) => setNewRoofArea(Number(e.target.value))}
                    min={20}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Storage Sump Size (L)</label>
                  <input
                    type="number"
                    value={newTankCapacity}
                    onChange={(e) => setNewTankCapacity(Number(e.target.value))}
                    min={500}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">Filter Media Type</label>
                <input
                  type="text"
                  value={newFilterType}
                  onChange={(e) => setNewFilterType(e.target.value)}
                  placeholder="e.g. Rainy FL-500 Dual Vortex / Sand-Gravel"
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
                >
                  Register Unit
                </button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
}

