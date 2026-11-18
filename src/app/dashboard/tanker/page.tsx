"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { TankerSchedule, TankerStatus } from "@/types";
import { formatNumber, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  History,
  Info,
  ShieldAlert,
} from "lucide-react";

export default function TankerPage() {
  const { tankerSchedules, addTankerSchedule, confirmTankerArrival, selectedSociety, currentRole } =
    useAppStore();

  const [activeTab, setActiveTab] = useState<"active" | "history" | "vendors">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTanker, setSelectedTanker] = useState<TankerSchedule | null>(null);
  const [actualVolume, setActualVolume] = useState<number>(6000);
  const [confirmNotes, setConfirmNotes] = useState<string>("");

  // Create form state
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [timeWindow, setTimeWindow] = useState<string>("16:00 - 17:00");
  const [vendorName, setVendorName] = useState<string>("Cauvery Express Logistics");
  const [tankerNumber, setTankerNumber] = useState<string>("KA-04-E-8821");
  const [driverName, setDriverName] = useState<string>("Ramesh Nayak");
  const [driverPhone, setDriverPhone] = useState<string>("+91 98450 77123");
  const [sourceType, setSourceType] = useState<TankerSchedule["sourceType"]>("municipal_potable");
  const [plannedQuantity, setPlannedQuantity] = useState<number>(6000);
  const [costInINR, setCostInINR] = useState<number>(1250);
  const [orderNotes, setOrderNotes] = useState<string>("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTankerSchedule({
      societyId: selectedSociety.id,
      scheduledDate,
      scheduledTimeWindow: timeWindow,
      vendorName,
      tankerNumber,
      driverName,
      driverPhone,
      sourceType,
      plannedQuantityLiters: plannedQuantity,
      status: "scheduled",
      costInINR,
      notes: orderNotes || `Booked through society water procurement desk (${currentRole}).`,
    });
    setIsCreateModalOpen(false);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTanker) {
      confirmTankerArrival(selectedTanker.id, actualVolume, confirmNotes);
      setIsConfirmModalOpen(false);
    }
  };

  const totalDeliveredMonth = tankerSchedules
    .filter((t) => t.status === "completed")
    .reduce((acc, curr) => acc + (curr.actualQuantityLiters || curr.plannedQuantityLiters), 0);

  const totalPlannedMonth = tankerSchedules.reduce(
    (acc, curr) => acc + curr.plannedQuantityLiters,
    0
  );

  const totalSpendMonth = tankerSchedules
    .filter((t) => t.status === "completed")
    .reduce((acc, curr) => acc + curr.costInINR, 0);

  // Filtered lists
  const activeSchedules = tankerSchedules.filter(
    (t) => t.status === "scheduled" || t.status === "en_route" || t.status === "arrived"
  );

  const completedHistory = tankerSchedules.filter((t) => {
    const matchesSearch =
      t.tankerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-slate-900 md:text-2xl font-sans tracking-tight">
              {currentRole === "resident"
                ? "Society Water Tanker Arrival Schedule"
                : "Municipal & Private Tanker Logistics"}
            </h1>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              Core Module 1B
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Track verified arrival timings and incoming water supply slots for your residential layout. Tanker procurement is managed centrally by the RWA Estate Committee."
              : "Schedule deliveries, track transit status, verify gate intake volumes via ultrasonic meters, and inspect historical procurement receipts."}
          </p>
        </div>

        {/* Action Button: Restricted to Administrator */}
        {currentRole === "admin" ? (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Book New Tanker Supply</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/leakage"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shrink-0"
            >
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>Report Leakage / Wastage</span>
            </Link>
          </div>
        )}
      </div>

      {/* Resident Role Context Banner */}
      {currentRole === "resident" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Resident Information:</span>{" "}
              <span>
                Individual residents cannot book commercial tankers directly. Sump replenishment is automatically triggered by the society estate management committee when reserves cross 30%.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-medium text-primary shrink-0">
            Next Sump Top-up: 18:00 IST Today
          </span>
        </div>
      )}

      {/* KPI Stats Strip: Adapted for Resident vs Admin */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Water Delivered This Month
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-slate-900">
            {formatNumber(totalDeliveredMonth)} L
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">100% flowmeter verified at gate</span>
        </div>

        {currentRole === "admin" ? (
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Total Procurement Spend
            </span>
            <div className="mt-1 font-bold font-mono text-2xl text-primary">
              ₹{formatNumber(totalSpendMonth)}
            </div>
            <span className="text-[11px] text-slate-500">Blended municipal + private rate</span>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Next Scheduled Delivery
            </span>
            <div className="mt-1 font-bold font-mono text-2xl text-primary">
              18:00 IST
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Cauvery Express · 6,000 L</span>
          </div>
        )}

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            On-Time Arrival Rate
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-emerald-700">94.8%</div>
          <span className="text-[11px] text-slate-500">Avg arrival variance: +14 mins</span>
        </div>

        {currentRole === "admin" ? (
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Average Unit Cost
            </span>
            <div className="mt-1 font-bold font-mono text-2xl text-slate-900">₹0.21 / Litre</div>
            <span className="text-[11px] text-slate-500">Competitive regional index</span>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Sump Buffer Status
            </span>
            <div className="mt-1 font-bold font-mono text-2xl text-slate-900">4.4 Days</div>
            <span className="text-[11px] text-slate-500">Normal domestic supply pressure</span>
          </div>
        )}
      </div>

      {/* Tabs: Active Schedules vs History */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1 w-fit">
        <button
          onClick={() => setActiveTab("active")}
          className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === "active"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {currentRole === "resident" ? "Upcoming Deliveries" : "Active Schedules"} ({activeSchedules.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
            activeTab === "history"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {currentRole === "resident" ? "Delivery Log" : "Procurement Ledger"} ({tankerSchedules.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE SCHEDULES */}
      {activeTab === "active" && (
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {currentRole === "resident" ? "Expected Tanker Deliveries" : "Active Schedules & Gate Manifests"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentRole === "resident"
                  ? "Upcoming water tanker arrivals with vehicle plate numbers and expected arrival slots."
                  : "Live transit tracker with driver credentials and intake verification workflows."}
              </p>
            </div>
            <span className="text-xs text-slate-400">{activeSchedules.length} pending intake</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Schedule Slot</th>
                  <th className="py-2.5">Tanker &amp; Driver</th>
                  <th className="py-2.5">Water Grade</th>
                  <th className="py-2.5">Planned Volume</th>
                  {currentRole === "admin" && <th className="py-2.5">Cost (INR)</th>}
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">{currentRole === "resident" ? "Intake Status" : "Gate Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeSchedules.map((t) => {
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{t.scheduledTimeWindow}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{t.scheduledDate}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{t.tankerNumber}</div>
                        <div className="text-[11px] text-slate-500">{t.vendorName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-2.5 w-2.5" />
                          <span>
                            {t.driverName} ({t.driverPhone})
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-slate-600 capitalize text-[11px]">
                          {t.sourceType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-semibold text-slate-900">
                        {formatNumber(t.plannedQuantityLiters)} L
                      </td>
                      {currentRole === "admin" && (
                        <td className="py-3 font-mono text-slate-700">₹{formatNumber(t.costInINR)}</td>
                      )}
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 capitalize">
                          <span className={`h-1.5 w-1.5 rounded-full ${t.status === 'completed' ? 'bg-emerald-500' : t.status === 'en_route' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                          {t.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {currentRole === "admin" || currentRole === "maintenance" ? (
                          <button
                            onClick={() => {
                              setSelectedTanker(t);
                              setActualVolume(t.plannedQuantityLiters);
                              setIsConfirmModalOpen(true);
                            }}
                            className="rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                          >
                            Verify Gate Intake &rarr;
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            {t.status === "en_route"
                              ? "En Route (24 mins)"
                              : t.status === "arrived"
                              ? "At Society Gate"
                              : "Scheduled by Estate Desk"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE DELIVERY HISTORY & RECEIPTS */}
      {activeTab === "history" && (
        <div className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {currentRole === "resident" ? "Delivered Water History" : "Procurement History & Audit Ledger"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Archived logs of all delivered water tankers and verified gate intake volumes.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search plate, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none text-slate-600 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed &amp; Verified</option>
                <option value="scheduled">Scheduled</option>
                <option value="en_route">En Route</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Date / Slot</th>
                  <th className="py-2.5">Tanker &amp; Vendor</th>
                  <th className="py-2.5">Water Grade</th>
                  <th className="py-2.5">Delivered Volume</th>
                  {currentRole === "admin" && <th className="py-2.5">Variance</th>}
                  {currentRole === "admin" && <th className="py-2.5">Invoice Total</th>}
                  <th className="py-2.5">Verification</th>
                  {currentRole === "admin" && <th className="py-2.5 text-right">Receipt</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedHistory.map((t) => {
                  const varianceLiters = t.actualQuantityLiters
                    ? t.actualQuantityLiters - t.plannedQuantityLiters
                    : 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{t.scheduledDate}</div>
                        <div className="text-[10px] text-slate-400">{t.scheduledTimeWindow}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{t.tankerNumber}</div>
                        <div className="text-[11px] text-slate-500">{t.vendorName}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="text-slate-600 capitalize text-[11px]">
                          {t.sourceType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono font-semibold text-slate-900">
                        {t.actualQuantityLiters ? `${formatNumber(t.actualQuantityLiters)} L` : "Pending Intake"}
                      </td>
                      {currentRole === "admin" && (
                        <td className="py-2.5 font-mono text-[11px]">
                          {t.actualQuantityLiters ? (
                            varianceLiters === 0 ? (
                              <span className="text-slate-500">0 L</span>
                            ) : varianceLiters < 0 ? (
                              <span className="text-rose-600 font-semibold">{varianceLiters} L</span>
                            ) : (
                              <span className="text-emerald-600 font-semibold">+{varianceLiters} L</span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      )}
                      {currentRole === "admin" && (
                        <td className="py-2.5 font-mono text-slate-700">₹{formatNumber(t.costInINR)}</td>
                      )}
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{t.confirmedBy || "Verified by Admin"}</span>
                        </span>
                      </td>
                      {currentRole === "admin" && (
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedTanker(t);
                              setIsReceiptModalOpen(true);
                            }}
                            className="rounded border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                          >
                            View Slip
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Book Tanker Supply (Admin Only) */}
      {currentRole === "admin" && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Schedule Water Tanker Delivery"
          subtitle="Create a verified procurement schedule with driver manifest"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Time Window</label>
                <input
                  type="text"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  placeholder="e.g. 15:30 - 16:30"
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Tanker Plate Number</label>
                <input
                  type="text"
                  value={tankerNumber}
                  onChange={(e) => setTankerNumber(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Driver Contact</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Water Type</label>
                <select
                  value={sourceType}
                  onChange={(e: any) => setSourceType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                >
                  <option value="municipal_potable">Municipal Potable</option>
                  <option value="treated_secondary">Treated Secondary</option>
                  <option value="private_sweet">Private Sweet Water</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Planned Qty (L)</label>
                <input
                  type="number"
                  value={plannedQuantity}
                  onChange={(e) => setPlannedQuantity(Number(e.target.value))}
                  min={1000}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Cost (₹ INR)</label>
                <input
                  type="number"
                  value={costInINR}
                  onChange={(e) => setCostInINR(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Procurement Instructions</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Discharge directly into Auxiliary Sump Gate 2."
                rows={2}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
              >
                Publish Tanker Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Confirm Intake */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Tanker Intake &amp; Gate Verification"
        subtitle={`Verifying Tanker #${selectedTanker?.tankerNumber} from ${selectedTanker?.vendorName}`}
      >
        <form onSubmit={handleConfirmSubmit} className="space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Volume:</span>
              <span className="font-mono font-bold text-slate-900">{selectedTanker?.plannedQuantityLiters} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Driver Phone:</span>
              <span className="font-medium text-slate-700">{selectedTanker?.driverPhone}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Actual Verified Volume (Litres)
            </label>
            <input
              type="number"
              value={actualVolume}
              onChange={(e) => setActualVolume(Number(e.target.value))}
              min={500}
              max={30000}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold font-mono"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Checked via physical acoustic dip tape or gate electromagnetic meter.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Gate Verification Notes</label>
            <textarea
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
              placeholder="e.g. Tanker dip reading verified; suction connected to Auxiliary Sump 2."
              rows={2}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
            >
              Verify &amp; Credit Sump Reserve
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Receipt Manifest */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Procurement Delivery Slip &amp; Audit Manifest"
        subtitle={`Receipt #TK-${selectedTanker?.id.substring(selectedTanker.id.length - 6).toUpperCase()}`}
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Society</span>
              <span className="font-semibold text-slate-900">{selectedSociety.name}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Tanker Plate</span>
              <span className="font-mono font-bold text-slate-900">{selectedTanker?.tankerNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Vendor</span>
              <span className="font-medium text-slate-800">{selectedTanker?.vendorName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Driver</span>
              <span className="text-slate-700">{selectedTanker?.driverName} ({selectedTanker?.driverPhone})</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Delivered Volume</span>
              <span className="font-mono font-bold text-emerald-700">
                {formatNumber(selectedTanker?.actualQuantityLiters || selectedTanker?.plannedQuantityLiters || 0)} L
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Invoice Total</span>
              <span className="font-mono font-bold text-slate-900">₹{formatNumber(selectedTanker?.costInINR || 0)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Verified by: {selectedTanker?.confirmedBy || "Vikram Sethi (Admin)"}</span>
            <button
              onClick={() => alert("Printing verified gate manifest receipt...")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
