"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/types";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronDown,
  User,
  Shield,
  Wrench,
  Building2,
  Plus,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";

export function Navbar() {
  const {
    config,
    currentRole,
    setCurrentRole,
    selectedSociety,
    setSelectedSociety,
    allSocieties,
    alerts,
    markAlertRead,
    isEmergencyCutoffActive,
    toggleEmergencyCutoff,
  } = useAppStore();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSocietyDropdownOpen, setIsSocietyDropdownOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const roleMeta: Record<UserRole, { label: string; icon: any; color: string }> = {
    admin: { label: "Society Administrator", icon: Shield, color: "bg-blue-100 text-blue-800 border-blue-300" },
    resident: { label: "Resident (Block A-402)", icon: User, color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    maintenance: { label: "Maintenance Technician", icon: Wrench, color: "bg-amber-100 text-amber-800 border-amber-300" },
    utility: { label: "Public Utility (BWSSB AEE)", icon: Building2, color: "bg-purple-100 text-purple-800 border-purple-300" },
    iot: { label: "IoT Telemetry Node", icon: RefreshCw, color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  };

  return (
    <header className="flex h-16 w-full items-center justify-between px-3 md:px-6 bg-white/95 backdrop-blur">
      {/* Left: Society Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative min-w-0">
          <button
            onClick={() => setIsSocietyDropdownOpen(!isSocietyDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 sm:px-3 text-left text-xs font-medium text-slate-800 transition hover:bg-slate-100 max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm"
          >
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-content-primary truncate">{selectedSociety.name}</div>
              <div className="text-[10px] text-content-secondary hidden sm:block truncate">
                {selectedSociety.totalApartments} Units · {selectedSociety.totalResidents} Residents
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          </button>

          {isSocietyDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Residential Layout
              </div>
              {allSocieties.map((soc) => (
                <button
                  key={soc.id}
                  onClick={() => {
                    setSelectedSociety(soc);
                    setIsSocietyDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                    selectedSociety.id === soc.id ? "bg-primary-light font-semibold text-primary" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="truncate">{soc.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{soc.location}</div>
                  </div>
                  {selectedSociety.id === soc.id && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live IoT Status Badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 lg:flex shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>IoT Telemetry: 24 Sensors Online</span>
        </div>
      </div>

      {/* Center: Emergency Cutoff Banner if Active (Visible on Mobile & Desktop) */}
      {isEmergencyCutoffActive && (
        <div className="flex animate-pulse items-center gap-1.5 rounded-lg bg-rose-600 px-2 py-1 text-[11px] sm:text-xs font-bold text-white shadow-sm shrink-0">
          <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="hidden sm:inline">MAIN VALVE ISOLATED</span>
          <span className="sm:hidden">ISOLATED</span>
          {currentRole === "admin" ? (
            <button
              onClick={toggleEmergencyCutoff}
              className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] hover:bg-white/30"
            >
              Reset
            </button>
          ) : (
            <span className="text-[10px] text-white/80">(Admin)</span>
          )}
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium transition ${roleMeta[currentRole].color}`}
            title="Switch demo persona to test role-based UI"
          >
            {React.createElement(roleMeta[currentRole].icon, { className: "h-3.5 w-3.5 shrink-0" })}
            <span className="hidden md:inline">{roleMeta[currentRole].label}</span>
            <ChevronDown className="h-3 w-3 opacity-70 shrink-0" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Role Persona
              </div>
              {(["admin", "resident", "maintenance", "utility"] as UserRole[]).map((r) => {
                const meta = roleMeta[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      currentRole === r ? "bg-slate-100 font-semibold text-content-primary" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {React.createElement(meta.icon, { className: "h-4 w-4 text-primary shrink-0" })}
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{meta.label}</div>
                    </div>
                    {currentRole === r && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Action Link Differentiated by Role */}
        {currentRole === "resident" ? (
          <Link
            href="/dashboard/leakage"
            className="hidden items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 sm:flex"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Report Leak</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/water-availability"
            className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Supply</span>
          </Link>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="relative rounded-lg p-1.5 sm:p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white shadow-sm">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-content-primary text-sm">System Alerts</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {alerts.length} total
                  </span>
                </div>
                <button
                  onClick={() => setIsAlertsOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No active alerts. All systems normal.</div>
                ) : (
                  alerts.slice(0, 6).map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => markAlertRead(alt.id)}
                      className={`cursor-pointer rounded-xl border p-2.5 transition ${
                        alt.isRead ? "border-slate-100 bg-slate-50/50" : "border-amber-200 bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-xs text-content-primary">{alt.title}</div>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            alt.severity === "danger"
                              ? "bg-rose-100 text-rose-700"
                              : alt.severity === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-content-secondary line-clamp-2">{alt.message}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Source: {alt.source}</span>
                        {alt.actionUrl && (
                          <Link href={alt.actionUrl} className="flex items-center gap-0.5 text-primary hover:underline">
                            <span>Open</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2 text-center">
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setIsAlertsOpen(false)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All Intelligent Alerts
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

