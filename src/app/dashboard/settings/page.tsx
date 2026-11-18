"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Sliders,
  CheckCircle2,
  RefreshCw,
  Building2,
  Layers,
  Save,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function SettingsPage() {
  const { config, updateConfig, selectedSociety, setSelectedSociety, resetToSeedData, currentRole, setCurrentRole } =
    useAppStore();

  const [appName, setAppName] = useState(config.appName);
  const [appShortName, setAppShortName] = useState(config.appShortName);
  const [tagline, setTagline] = useState(config.tagline);
  const [safeMax, setSafeMax] = useState(config.thresholds.groundwaterSafeMaxMeters);
  const [warningMax, setWarningMax] = useState(config.thresholds.groundwaterWarningMaxMeters);
  const [criticalMax, setCriticalMax] = useState(config.thresholds.groundwaterCriticalMeters);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (currentRole !== "admin") {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Society system settings, hydrological threshold calibration, and platform branding are restricted to the <strong>Society Administrator</strong> role.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentRole("admin")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
          >
            Switch to Administrator Persona &rarr;
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      appName,
      appShortName,
      tagline,
      thresholds: {
        ...config.thresholds,
        groundwaterSafeMaxMeters: safeMax,
        groundwaterWarningMaxMeters: warningMax,
        groundwaterCriticalMeters: criticalMax,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all logs, tanker deliveries, and settings back to default hackathon demo seed state?")) {
      resetToSeedData();
      alert("Platform restored to default seed state!");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              Platform &amp; Society Configuration
            </h1>
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary">
              Administrator Settings
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Customize platform branding, telemetry alert thresholds, and operational parameters.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Configuration and brand parameters successfully saved!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Configurable Branding (Master prompt requirement) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-base text-content-primary">Configurable Platform Branding</h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Keep platform identity adaptable for municipal white-labeling or RWA branding.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">Full Platform Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-content-primary mb-1">Short Brand Name</label>
              <input
                type="text"
                value={appShortName}
                onChange={(e) => setAppShortName(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">Tagline &amp; Mission</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Card 2: Groundwater Alert Thresholds */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-base text-content-primary">Aquifer Threshold Boundaries (m below datum)</h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Configurable cutoffs that trigger in-app warnings and automated rest cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-1">Safe Max Depth (&lt; m)</label>
              <input
                type="number"
                step="0.5"
                value={safeMax}
                onChange={(e) => setSafeMax(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1">Warning Threshold (m)</label>
              <input
                type="number"
                step="0.5"
                value={warningMax}
                onChange={(e) => setWarningMax(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">Critical Stress Cutoff (&gt; m)</label>
              <input
                type="number"
                step="0.5"
                value={criticalMax}
                onChange={(e) => setCriticalMax(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

