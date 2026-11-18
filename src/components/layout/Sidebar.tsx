"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { NAVIGATION_ITEMS } from "@/lib/config";
import {
  LayoutDashboard,
  Droplets,
  ArrowDownToLine,
  Truck,
  CloudRain,
  AlertTriangle,
  Cpu,
  Hourglass,
  Award,
  Radio,
  Bell,
  Sliders,
  FlaskConical,
  Radar,
  Flame,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  X,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Droplets,
  ArrowDownToLine,
  FlaskConical,
  Truck,
  CloudRain,
  AlertTriangle,
  Cpu,
  Hourglass,
  Radar,
  Award,
  Radio,
  Bell,
  Sliders,
};

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onClose,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { config, currentRole, leakageReports, alerts, isEmergencyCutoffActive, toggleEmergencyCutoff } = useAppStore();

  const unresolvedLeaksCount = leakageReports.filter(
    (l) => l.status === "submitted" || l.status === "under_review" || l.status === "in_progress"
  ).length;

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  // Group items by category
  const categories = ["OVERVIEW", "MONITOR", "MANAGE", "INTELLIGENCE", "COMMUNITY", "SYSTEM"];

  return (
    <aside
      style={{ backgroundColor: "#071B49", color: "#ffffff" }}
      className={`relative flex h-full flex-col border-r border-slate-800 bg-[#071B49] text-white transition-all duration-300 ${
        isMobile ? "w-full" : collapsed ? "w-0 overflow-hidden border-r-0 opacity-0 pointer-events-none" : "w-64 opacity-100"
      }`}
    >
      {/* Brand Header */}
      <div
        className="flex h-16 shrink-0 items-center justify-between border-b border-[#0C2869] px-4"
        style={{ borderColor: "#0C2869" }}
      >
        <Link
          href="/"
          onClick={() => {
            if (isMobile && onClose) onClose();
          }}
          className="flex items-center gap-2.5 overflow-hidden group"
          style={{ textDecoration: "none" }}
          title="Return to AquaTrace Public Homepage"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-aqua text-white shadow-md group-hover:scale-105 transition-transform">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-tight">
                {config.appShortName}
              </span>
              <span className="text-[10px] font-medium text-aqua tracking-wider uppercase">
                Grid Intelligence
              </span>
            </div>
          )}
        </Link>

        {/* Back / Collapse Toggle Button */}
        {isMobile ? (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
            title="Close Menu & Go Back to Dashboard"
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-4 w-4 text-aqua" />
            <span>Back</span>
          </button>
        ) : (
          onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-[#0C2869] hover:text-white transition flex items-center gap-1"
              title="Fully Retract Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Exit to Main Public Website Button */}
      <div className="px-3 pt-3 shrink-0">
        <Link
          href="/"
          onClick={() => {
            if (isMobile && onClose) onClose();
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition group"
          title="Exit Dashboard and Return to Public Website"
        >
          <ArrowLeft className="h-4 w-4 text-aqua group-hover:-translate-x-1 transition-transform shrink-0" />
          <span>Exit to Main Website</span>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {categories.map((cat) => {
          const items = NAVIGATION_ITEMS.filter(
            (item) => item.category === cat && item.roles.includes(currentRole)
          );

          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {(!collapsed || isMobile) && (
                <div className="px-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {cat}
                </div>
              )}
              {items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || Droplets;
                const isActive = pathname === item.href;

                let badgeValue = 0;
                if (item.badgeKey === "unresolvedLeaks") badgeValue = unresolvedLeaksCount;
                if (item.badgeKey === "activeAlerts") badgeValue = unreadAlertsCount;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (isMobile && onClose) onClose();
                    }}
                    style={{ textDecoration: "none" }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:bg-[#0C2869] hover:text-white"
                    }`}
                    title={item.name}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`h-4 w-4 shrink-0 transition ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-aqua"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {badgeValue > 0 && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          item.badgeKey === "unresolvedLeaks"
                            ? "bg-rose-500 text-white"
                            : "bg-orange text-white"
                        }`}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Emergency Cutoff & Telemetry Status Card */}
      <div className="border-t border-[#0C2869] p-3 shrink-0" style={{ borderColor: "#0C2869" }}>
        <div className="space-y-2">
          <button
            onClick={toggleEmergencyCutoff}
            style={{ backgroundColor: isEmergencyCutoffActive ? "#e11d48" : "#071B49" }}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2 px-3 text-xs font-bold transition shadow-sm ${
              isEmergencyCutoffActive
                ? "border-rose-400 bg-rose-600 text-white animate-pulse"
                : "border-navy-600 bg-navy-800 text-rose-300 hover:bg-rose-900/40 hover:border-rose-500 hover:text-white"
            }`}
          >
            <Flame className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="truncate">
              {isEmergencyCutoffActive ? "VALVE ISOLATED (RESET)" : "Emergency Valve Cutoff"}
            </span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LoRaWAN Mesh Sync</span>
            </span>
            <span className="text-[10px] text-aqua">100% OK</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
