"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { LeakageReport, LeakageStatus, LeakageUrgency } from "@/types";
import { formatDateTime, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import {
  AlertTriangle,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  Building2,
  Wrench,
  Camera,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  User,
  Info,
} from "lucide-react";

export default function LeakagePage() {
  const {
    leakageReports,
    addLeakageReport,
    updateLeakageStatus,
    forwardLeakageToUtility,
    selectedSociety,
    currentRole,
  } = useAppStore();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LeakageReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<LeakageReport["category"]>("pipe_burst");
  const [urgency, setUrgency] = useState<LeakageUrgency>("high");
  const [locationDetails, setLocationDetails] = useState("");
  const [buildingBlock, setBuildingBlock] = useState("Block B");
  const [description, setDescription] = useState("");
  const [submitterContact, setSubmitterContact] = useState("+91 97110 54321");
  const [technicianAssignee, setTechnicianAssignee] = useState("Ramesh Kumar (Plumber)");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const filteredReports = leakageReports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    addLeakageReport({
      societyId: selectedSociety.id,
      title,
      category,
      urgency,
      locationDetails,
      buildingBlock,
      description,
      submittedBy: currentRole === "admin" ? "Vikram Sethi (Admin)" : "Aarav Patel (Resident - A-402)",
      submitterContact,
      resolutionNotes: "Submitted via Resident Leakage Portal.",
    });
    setIsSubmitModalOpen(false);
    setTitle("");
    setLocationDetails("");
    setDescription("");
  };

  const handleForwardUtility = (reportId: string) => {
    if (currentRole !== "admin") return;
    forwardLeakageToUtility(reportId, "BWSSB Official Portal");
  };

  const handleResolve = (reportId: string) => {
    if (currentRole !== "admin" && currentRole !== "maintenance") return;
    updateLeakageStatus(reportId, "resolved", technicianAssignee, resolutionNotes || "Repaired and pressure tested.");
    setIsDetailModalOpen(false);
  };

  const statusProgressions: Record<LeakageStatus, number> = {
    submitted: 1,
    under_review: 2,
    forwarded: 3,
    in_progress: 4,
    resolved: 5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl text-slate-900 md:text-2xl font-sans tracking-tight">
              {currentRole === "resident"
                ? "Report Water Leakage & Wastage"
                : "Leakage Surveillance & Work Order Dispatch"}
            </h1>
            <span className="rounded bg-rose-50 border border-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
              Core Module 4
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {currentRole === "resident"
              ? "Notice a pipe leak, dripping tap in common areas, or tank overflow? Report it immediately to dispatch our society maintenance technician."
              : "Review community-submitted leakage complaints, dispatch on-site plumbers, and escalate municipal mainline fractures to the public water authority."}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Report New Leak / Wastage</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Total Reports Logged
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-slate-900">{leakageReports.length}</div>
          <span className="text-[11px] text-slate-500">Across all wings and common areas</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Active / In Progress
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-amber-600">
            {leakageReports.filter((r) => r.status !== "resolved").length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Technicians on-site</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Escalated to Utility
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-primary">
            {leakageReports.filter((r) => r.forwardedUtilityChannel).length}
          </div>
          <span className="text-[11px] text-slate-500">BWSSB municipal tracking IDs active</span>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Resolved Leaks
          </span>
          <div className="mt-1 font-bold font-mono text-2xl text-emerald-700">
            {leakageReports.filter((r) => r.status === "resolved").length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Avg repair time: 4.2 hours</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter Status:</span>
          {["all", "submitted", "in_progress", "forwarded", "resolved"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
                filterStatus === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{filteredReports.length} tickets</span>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => {
          const statusStyle = getStatusColor(report.status);
          const currentStep = statusProgressions[report.status];

          return (
            <div
              key={report.id}
              className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        report.urgency === "critical"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : report.urgency === "high"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {report.urgency} Urgency
                    </span>
                    <span className="text-slate-500 text-[11px] capitalize">
                      · {report.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{report.locationDetails || report.buildingBlock}</span>
                    </span>
                    <span>·</span>
                    <span>Reported by {report.submittedBy} ({formatDateTime(report.timestamp)})</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusStyle.bg}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                    <span>{report.status.replace("_", " ")}</span>
                  </span>

                  {(currentRole === "maintenance" || currentRole === "admin") && report.status !== "resolved" && (
                    <button
                      onClick={() => {
                        updateLeakageStatus(
                          report.id,
                          "resolved",
                          currentRole === "admin" ? "Vikram Sethi (Admin)" : "Ramesh Kumar (Plumber)",
                          "Repaired and verified on-site by maintenance."
                        );
                      }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                      title="Quick mark as resolved"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsDetailModalOpen(true);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    {currentRole === "resident" ? "View Progress" : "Manage / Details"}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {report.description}
              </p>

              {/* Status Stepper Progression */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-5 gap-1 text-center">
                  {[
                    { label: "1. Submitted", step: 1 },
                    { label: "2. Under Review", step: 2 },
                    { label: "3. Forwarded", step: 3 },
                    { label: "4. In Progress", step: 4 },
                    { label: "5. Resolved", step: 5 },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center">
                      <div
                        className={`h-1.5 w-full rounded-full transition-all ${
                          currentStep >= s.step ? "bg-primary" : "bg-slate-100"
                        }`}
                      />
                      <span
                        className={`mt-1.5 text-[9px] sm:text-[10px] font-medium truncate w-full ${
                          currentStep >= s.step ? "text-primary font-semibold" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer info: Public utility reference docket */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                {report.utilityReferenceNumber ? (
                  <span className="font-semibold text-primary flex items-center gap-1 text-[11px]">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Official Docket: {report.utilityReferenceNumber} ({report.forwardedUtilityChannel})</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">
                    Assigned: {report.assignedTechnician || "Awaiting Technician Assignment"}
                  </span>
                )}

                {/* Quick actions for admin/maintenance */}
                {currentRole === "admin" && !report.utilityReferenceNumber && report.status !== "resolved" && (
                  <button
                    onClick={() => handleForwardUtility(report.id)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>Forward to BWSSB Portal</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Report Leakage Form */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Report a Water Leak or Wastage"
        subtitle="Submit photographic evidence and location for maintenance dispatch"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Issue Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ruptured 50mm riser pipe dripping near basement meter"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="pipe_burst">Pipe Burst / High Pressure Rupture</option>
                <option value="tank_overflow">Overhead Tank Float Overflow</option>
                <option value="ground_seepage">Underground Seepage / Pooling</option>
                <option value="valve_fault">Motorized Valve Failure</option>
                <option value="tap_leak">Continuous Tap / Fixture Leak</option>
                <option value="wastage">Avoidable Commercial Wastage</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e: any) => setUrgency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="critical">Critical (Flooding / Severe Loss)</option>
                <option value="high">High (Active Steady Stream)</option>
                <option value="medium">Medium (Continuous Drip)</option>
                <option value="low">Low (Minor Seepage / Gasket Wear)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Building / Wing</label>
              <input
                type="text"
                value={buildingBlock}
                onChange={(e) => setBuildingBlock(e.target.value)}
                placeholder="e.g. Block A, Basement -1"
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Contact Phone</label>
              <input
                type="text"
                value={submitterContact}
                onChange={(e) => setSubmitterContact(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Specific Location Details</label>
            <input
              type="text"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="e.g. Behind Clubhouse filtration unit, column C-14"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Description &amp; Observed Wastage</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the leak rate, when you noticed it, and any immediate precautions taken..."
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 hover:border-slate-400 transition cursor-pointer">
            <Camera className="h-5 w-5 mx-auto text-slate-400 mb-1" />
            <span className="font-semibold text-primary">Simulate Photograph Upload</span>
            <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB (Stored in Firebase Storage)</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
            >
              Submit Leak Report
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Incident Management & Resolution (Role-Differentiated) */}
      {selectedReport && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Ticket #${selectedReport.id}: ${selectedReport.title}`}
          subtitle={`Location: ${selectedReport.locationDetails} · Reported by ${selectedReport.submittedBy}`}
        >
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-slate-900 uppercase">{selectedReport.status.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency:</span>
                <span className="font-bold text-rose-600 uppercase">{selectedReport.urgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Technician:</span>
                <span className="font-medium text-slate-800">{selectedReport.assignedTechnician || "Pending Assignment"}</span>
              </div>
              {selectedReport.utilityReferenceNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Utility Reference:</span>
                  <span className="font-bold text-primary">{selectedReport.utilityReferenceNumber}</span>
                </div>
              )}
            </div>

            {/* Resident View: Read-Only Progress Details */}
            {currentRole === "resident" ? (
              <div className="space-y-3 text-xs">
                <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-3 text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-1">Estate Team Status:</span>
                  {selectedReport.status === "resolved" ? (
                    <span className="text-emerald-700 font-medium">
                      ✓ This issue has been fully repaired and pressure-tested by the estate maintenance team.
                    </span>
                  ) : selectedReport.status === "in_progress" ? (
                    <span className="text-amber-800">
                      Plumber Ramesh Kumar is currently on-site working on this repair.
                    </span>
                  ) : (
                    <span>
                      Ticket has been logged and assigned to the estate maintenance desk for inspection.
                    </span>
                  )}
                </div>

                {selectedReport.resolutionNotes && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
                    <span className="font-semibold text-slate-800 block text-[11px] mb-0.5">Technician Notes:</span>
                    {selectedReport.resolutionNotes}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Close Ticket View
                  </button>
                </div>
              </div>
            ) : (
              /* Admin & Maintenance Controls */
              <div className="space-y-4">
                {currentRole === "admin" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Assign Maintenance Technician
                    </label>
                    <select
                      value={technicianAssignee}
                      onChange={(e) => setTechnicianAssignee(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                    >
                      <option value="Ramesh Kumar (Chief Plumber)">Ramesh Kumar (Chief Plumber)</option>
                      <option value="Suresh P. (Pump & Valve Tech)">Suresh P. (Pump &amp; Valve Tech)</option>
                      <option value="External BWSSB Line Contractor">External BWSSB Line Contractor</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Resolution / Action Evidence Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Detail the repair: replaced gasket, fitted slip-coupling, re-pressurized to 3.0 bar..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap justify-between gap-2 pt-2 border-t border-slate-100">
                  {currentRole === "admin" && !selectedReport.utilityReferenceNumber && (
                    <button
                      type="button"
                      onClick={() => {
                        handleForwardUtility(selectedReport.id);
                        setIsDetailModalOpen(false);
                      }}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Forward to BWSSB Portal
                    </button>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsDetailModalOpen(false)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    {selectedReport.status !== "in_progress" && selectedReport.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => {
                          updateLeakageStatus(
                            selectedReport.id,
                            "in_progress",
                            technicianAssignee,
                            resolutionNotes || "Technician deployed on-site."
                          );
                          setIsDetailModalOpen(false);
                        }}
                        className="rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm"
                      >
                        Start Work (In Progress)
                      </button>
                    )}
                    {selectedReport.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => handleResolve(selectedReport.id)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
