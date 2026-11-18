"use client";

import React, { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trendText?: string;
  trendDirection?: "up" | "down" | "neutral";
  sourceLabel?: string;
  sourceType?: "iot" | "manual" | "ai" | "calculated";
  statusBadge?: {
    label: string;
    variant: "success" | "warning" | "danger" | "info" | "neutral";
  };
  icon?: any;
  children?: ReactNode;
  subtitle?: string;
}

export function KPICard({
  title,
  value,
  unit,
  trendText,
  trendDirection,
  sourceLabel,
  statusBadge,
  icon: Icon,
  children,
  subtitle,
}: KPICardProps) {
  const statusDotColors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
  };

  const statusTextColors = {
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
    info: "text-blue-700",
    neutral: "text-slate-600",
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-slate-300">
      {/* Top Header: Title and quiet status indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {statusBadge && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[statusBadge.variant]}`} />
            <span className={statusTextColors[statusBadge.variant]}>{statusBadge.label}</span>
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-500 -mt-1 mb-2">{subtitle}</p>}

      {/* Optional Child Chart / Bar */}
      {children && <div className="my-1.5">{children}</div>}

      {/* Bottom Footer: Minimalist Trend and Data Source */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        {trendText && (
          <div className="flex items-center gap-1">
            {trendDirection === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-600" />}
            {trendDirection === "down" && <ArrowDownRight className="h-3 w-3 text-rose-600" />}
            <span
              className={
                trendDirection === "up"
                  ? "text-emerald-700 font-medium"
                  : trendDirection === "down"
                  ? "text-rose-700 font-medium"
                  : "text-slate-500"
              }
            >
              {trendText}
            </span>
          </div>
        )}

        {sourceLabel && (
          <span className="text-[10px] text-slate-400 font-normal">
            {sourceLabel}
          </span>
        )}
      </div>
    </div>
  );
}
