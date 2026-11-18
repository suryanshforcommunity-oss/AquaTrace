"use client";

import React, { useState } from "react";
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

export function Sidebar() {
  const pathname = usePathname();
  const { config, currentRole, leakageReports, alerts, isEmergencyCutoffActive, toggleEmergencyCutoff } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const unresolvedLeaksCount = leakageReports.filter(
    (l) => l.status === "submitted" || l.status === "under_review" || l.status === "in_progress"
  ).length;

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  // Group items by category
  const categories = ["OVERVIEW", "MONITOR", "MANAGE", "INTELLIGENCE", "COMMUNITY", "SYSTEM"];

  return (
    <aside
      style={{ backgroundColor: "#071B49", color: "#ffffff" }}
      className={`relative flex flex-col border-r border-slate-800 bg-[#071B49] text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#0C2869] px-4" style={{ borderColor: "#0C2869" }}>
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden" style={{ textDecoration: "none" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-aqua text-white shadow-md">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
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
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#0C2869] hover:text-white transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((cat) => {
          const items = NAVIGATION_ITEMS.filter(
            (item) => item.category === cat && item.roles.includes(currentRole)
          );

          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!collapsed && (
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
                    style={{ textDecoration: "none" }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:bg-[#0C2869] hover:text-white"
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`h-4 w-4 shrink-0 transition ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-aqua"
                        }`}
                      />
                      {!collapsed && <span>{item.name}</span>}
                    </div>

                    {!collapsed && badgeValue > 0 && (
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
      <div className="border-t border-[#0C2869] p-3" style={{ borderColor: "#0C2869" }}>
        {!collapsed ? (
          <div className="space-y-2">
            <button
              onClick={toggleEmergencyCutoff}
              style={{ backgroundColor: isEmergencyCutoffActive ? "#e11d48" : "#071B49" }}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-bold transition shadow-sm ${
                isEmergencyCutoffActive
                  ? "border-rose-400 bg-rose-600 text-white animate-pulse"
                  : "border-navy-600 bg-navy-800 text-rose-300 hover:bg-rose-900/40 hover:border-rose-500 hover:text-white"
              }`}
            >
              <Flame className="h-4 w-4 text-rose-400" />
              <span>{isEmergencyCutoffActive ? "VALVE ISOLATED (RESET)" : "Emergency Valve Cutoff"}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LoRaWAN Mesh Sync</span>
              </span>
              <span className="text-[10px] text-aqua">100% OK</span>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleEmergencyCutoff}
            className={`flex w-full justify-center rounded-xl p-2.5 transition ${
              isEmergencyCutoffActive ? "bg-rose-600 text-white" : "bg-navy-800 text-rose-400 hover:bg-rose-900/50"
            }`}
            title="Emergency Valve Cutoff"
          >
            <Flame className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
}

