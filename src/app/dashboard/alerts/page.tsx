"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AlertNotification } from "@/types";
import { formatDateTime, formatDate, getStatusColor } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Info,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Radio,
  CheckCheck,
} from "lucide-react";

export default function AlertsPage() {
  const { alerts, markAlertRead, dismissAlert, triggerAlert, selectedSociety, currentRole } = useAppStore();

  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Test trigger form state
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertNotification["severity"]>("warning");
  const [recommendedAction, setRecommendedAction] = useState("");

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === "all") return true;
    return a.severity === severityFilter;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: Only administrators can manually issue or broadcast society alerts
    if (currentRole !== "admin") {
      alert("Permission Denied: Only Society Administrators can broadcast official alerts.");
      return;
    }

    triggerAlert({
      societyId: selectedSociety.id,
      title: alertTitle,
      message: alertMessage,
      severity: alertSeverity,
      source: "Society Admin Broadcast Console",
      recommendedAction: recommendedAction || "Review telemetry thresholds and follow advisory instructions.",
    });
    setIsTestModalOpen(false);
    setAlertTitle("");
    setAlertMessage("");
    setRecommendedAction("");
  };

  const markAllAsRead = () => {
    alerts.forEach((a) => markAlertRead(a.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              Intelligent Alerts &amp; Event Notification Engine
            </h1>
            <span className="rounded-full bg-orange-light px-2.5 py-0.5 text-xs font-bold text-orange">
              Automated Dispatch
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            {currentRole === "admin"
              ? "Surveillance dashboard & broadcast console. Issue emergency water advisories or manage threshold triggers."
              : "Official residential community noticeboard. Real-time advisories for low storage, maintenance outages, and emergency alerts."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-content-secondary hover:bg-slate-50 transition"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>

          {/* Role Gate: Only Admin Can Issue Manual Alerts */}
          {currentRole === "admin" ? (
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition"
            >
              <Plus className="h-4 w-4" />
              <span>Broadcast Community Alert</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              <ShieldAlert className="h-4 w-4 text-slate-400" />
              <span>Broadcasts Managed by Estate Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-content-primary">Filter Severity:</span>
          {["all", "danger", "warning", "info", "success"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition ${
                severityFilter === sev
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{filteredAlerts.length} total events</span>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-card">
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
            <h3 className="font-bold text-base text-content-primary">No Active Alerts</h3>
            <p className="text-xs text-content-secondary mt-1">
              All sensors and storage systems are operating within configured safe thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const statusStyle = getStatusColor(alert.severity);
            return (
              <div
                key={alert.id}
                className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 shadow-card transition sm:flex-row sm:items-start ${
                  alert.isRead ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      alert.severity === "danger"
                        ? "bg-rose-100 text-rose-700"
                        : alert.severity === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {alert.severity === "danger" ? (
                      <AlertOctagon className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-content-primary">{alert.title}</h4>
                      <span
                        className={`rounded-full border px-2 py-0.2 text-[9px] font-bold uppercase ${statusStyle.bg}`}
                      >
                        {alert.severity}
                      </span>
                      {!alert.isRead && (
                        <span className="rounded bg-orange-light px-1.5 py-0.2 text-[9px] font-bold text-orange">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-content-secondary leading-relaxed">{alert.message}</p>

                    <div className="rounded-lg bg-slate-50 p-2 text-xs border border-slate-100 mt-2">
                      <strong className="text-content-primary">Recommended Action:</strong>{" "}
                      <span className="text-content-secondary">{alert.recommendedAction}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Source: {alert.source}</span>
                      <span>·</span>
                      <span>{formatDateTime(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className="rounded-lg bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  {currentRole === "admin" && (
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                      title="Dismiss alert (Admin only)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Broadcast Community Alert (Restricted to Admin) */}
      {currentRole === "admin" && (
        <Modal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          title="Broadcast Official Community Water Alert"
          subtitle="Issue an official notice to all residents and facility staff across Greenwood Heights"
        >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Alert Headline</label>
            <input
              type="text"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="e.g. Sump 1 Storage Fallen Below 15% Safe Threshold"
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Severity</label>
            <select
              value={alertSeverity}
              onChange={(e: any) => setAlertSeverity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold"
            >
              <option value="danger">DANGER (Critical Outage / Burst / &lt;12h Water)</option>
              <option value="warning">WARNING (Threshold Approaching / Tanker Delayed)</option>
              <option value="info">INFO (Operational Dispatch / Scheduled Intake)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Event Message</label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Describe the condition in detail..."
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Recommended Action</label>
            <input
              type="text"
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              placeholder="e.g. Dispatch tanker immediately and restrict garden irrigation."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTestModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm"
            >
              Broadcast Alert
            </button>
          </div>
        </form>
      </Modal>
      )}
    </div>
  );
}

