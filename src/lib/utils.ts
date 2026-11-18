import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(val);
}

export function formatLiters(liters: number): string {
  if (liters >= 1000000) {
    return `${(liters / 1000000).toFixed(2)} ML`;
  }
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)} kL`;
  }
  return `${formatNumber(liters)} L`;
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateTimeStr: string): string {
  try {
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateTimeStr;
  }
}

export function getStatusColor(status: string): { bg: string; text: string; dot: string } {
  switch (status.toLowerCase()) {
    case "optimal":
    case "adequate":
    case "surplus":
    case "passed":
    case "completed":
    case "resolved":
    case "normal_range":
    case "verified":
    case "calibrated":
    case "online":
    case "low": // for shortage risk
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "warning":
    case "caution":
    case "moderate":
    case "maintenance_due":
    case "repairs_needed":
    case "under_review":
    case "in_progress":
    case "en_route":
    case "scheduled":
    case "high":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        text: "text-amber-700",
        dot: "bg-amber-500",
      };
    case "critical":
    case "severe":
    case "danger":
    case "offline":
    case "missed":
    case "clogged":
    case "requires_lab_test":
    case "abnormal_range":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        text: "text-rose-700",
        dot: "bg-rose-500",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-700 border-slate-200",
        text: "text-slate-700",
        dot: "bg-slate-400",
      };
  }
}

