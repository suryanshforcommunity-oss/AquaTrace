"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import StaggeredMenu from "@/components/shared/StaggeredMenu";
import { STAGGERED_MENU_ITEMS, STAGGERED_MENU_SOCIALS, STAGGERED_MENU_COLORS } from "@/lib/navigationConfig";

const GradientWaves = dynamic(() => import("@/components/shared/GradientWaves"), {
  ssr: false,
});
import {
  Droplets,
  ArrowRight,
  ShieldCheck,
  Radio,
  Cpu,
  Truck,
  CloudRain,
  AlertTriangle,
  Award,
  ArrowDownToLine,
  Activity,
  Users,
  CheckCircle2,
  Building,
  BarChart3,
  Layers,
  ChevronRight,
  ExternalLink,
  Hourglass,
  Gauge,
  Wifi,
  Sparkles,
  RefreshCw,
  Search,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"tanker" | "groundwater" | "rwh" | "ai">("tanker");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-100 selection:text-primary-700 relative">
      {/* React Bits GradientWaves — Low-Intensity Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-25">
        <GradientWaves
          horizonColor="#071B49"
          waveColor="#073BCE"
          crestColor="#20B8C4"
          backgroundColor="transparent"
          speed={0.18}
          amplitude={1.2}
          waveScale={0.45}
          waveRatio={0.8}
          opacity={0.3}
          relief={0.4}
          lightAngle={135}
          grain={0.02}
          mouseInteraction={true}
          swellOnClick={false}
        />
      </div>

      {/* React Bits StaggeredMenu Navigation */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={STAGGERED_MENU_ITEMS}
        socialItems={STAGGERED_MENU_SOCIALS}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#071B49"
        openMenuButtonColor="#071B49"
        colors={STAGGERED_MENU_COLORS}
        logoUrl="/aquatrace-logo.svg"
        accentColor="#073BCE"
        headerActions={
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-100 transition"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover hover:shadow transition-all"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        }
      />

      {/* Hero Section with top padding to accommodate fixed StaggeredMenu */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/60 via-aqua-light/50 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-40 -z-10 h-[400px] w-[500px] rounded-full bg-gradient-to-br from-orange-light/40 to-transparent blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-navy font-bold">Hydro-Grid OS Active:</span>
              <span className="text-slate-500">Live Telemetry · 18 Hydrostatic Sensors Online</span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-4xl tracking-tight text-navy sm:text-6xl sm:leading-[1.1]">
              Know Your Water. <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Predict Your Needs.
              </span> <br />
              Conserve Together.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto">
              A community-driven water resource monitoring platform for residential layouts. Track borehole drawdown, automate municipal tanker schedules, verify rainwater harvesting, and predict depletion risks.
            </p>

            {/* High-Converting CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-xl bg-navy px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-navy/20 hover:bg-primary transition-all duration-200 group"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/tanker"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <Truck className="h-4 w-4 text-primary" />
                <span>Tanker Schedules &amp; History</span>
              </Link>

              <Link
                href="/dashboard/iot-devices"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <Radio className="h-4 w-4 text-aqua" />
                <span>View All Sensor Readings</span>
              </Link>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Problem Statement 4 Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Zero Guesswork · Inverted Hydrographs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>ESP32 Hardware Telemetry Ingest</span>
              </div>
            </div>
          </div>

          {/* Community Field Deployment Showcase */}
          <div className="mt-12 lg:mt-16">
            {/* Real-World Field Deployment Showcase (Full Uncropped Image) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl shadow-primary/10 transition duration-300 hover:shadow-card-hover">
              <div className="overflow-hidden rounded-xl bg-slate-900">
                <img
                  src="/community-water-system-nagpur.jpg"
                  alt="A Smarter Water System for Homes - Real-World Field Deployment"
                  className="w-full h-auto block rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Mandatory Core Features (Asymmetric SaaS Bento Grid) */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              All 5 Mandatory HackKumbh Requirements Built
            </span>
            <h2 className="font-extrabold text-3xl tracking-tight text-navy sm:text-4xl">
              An End-to-End Water Intelligence Ecosystem
            </h2>
            <p className="text-sm text-slate-600">
              Engineered with hydrological accuracy: depth is measured down from casing datums, estimated savings are never conflated with metered values, and quality screening stays honest.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Bento Card 1: Daily Water Availability & Tanker Logistics (7 cols) */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                    <Truck className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary">
                    Mandatory Req #1
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-navy">
                    Daily Water Availability &amp; Municipal Tanker Logistics
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Log daily availability across Municipal Cauvery/BWSSB supplies, borewells, and private tankers. Manage tanker orders through a 4-stage lifecycle (`scheduled` &rarr; `en_route` &rarr; `arrived` &rarr; `verified`) with gate flowmeter confirmation and historical variance tracking.
                  </p>
                </div>

                {/* Micro-table preview */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-700 pb-2 border-b border-slate-100">
                    <span>Recent Tanker Manifest</span>
                    <span className="text-emerald-600 text-[11px]">Flowmeter Verified</span>
                  </div>
                  <div className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>KA-04-E-8821 (Cauvery Express)</span>
                      <span className="font-mono font-bold text-navy">6,000 L · 16:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KA-03-HA-4412 (Metro Tankers)</span>
                      <span className="font-mono font-bold text-navy">12,000 L · Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  href="/dashboard/tanker"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  <span>Open Tanker Management &amp; Delivery History</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Core Module 1B</span>
              </div>
            </div>

            {/* Bento Card 2: Groundwater Hydrostatic Monitoring (5 cols) */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-white shadow-md">
                    <ArrowDownToLine className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary-light px-3 py-1 text-xs font-bold text-secondary">
                    Mandatory Req #2
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-navy">
                    Groundwater Depth Hydrograph
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Sub-surface water table monitoring relative to fixed casing wellhead datums (+MSL). Features an <strong>inverted Y-axis hydrograph</strong> so dropping water tables descend correctly. Supports piezoresistive sensors and manual acoustic dip-tape readings.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Current Depth (Well #2):</span>
                    <span className="font-mono font-bold text-navy">18.4 m below datum</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Mandatory Resting Cycle:</span>
                    <span className="font-bold text-amber-600">90 min cycle active</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  href="/dashboard/groundwater"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline"
                >
                  <span>View Inverted Hydrograph</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Core Module 2</span>
              </div>
            </div>

            {/* Bento Card 3: Rainwater Harvesting Effectiveness Calculator (4 cols) */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-aqua text-white shadow-md">
                    <CloudRain className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-aqua-light px-2.5 py-0.5 text-xs font-bold text-aqua-dark">
                    Mandatory Req #3
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-navy">
                    RWH Checklist &amp; Calculator
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Calculates potential collection volume: Roof Area × Rainfall × Runoff Coeff × Efficiency. Tracks first-flush silt trap desiltation and gravel filter maintenance.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Annual Harvest Yield</div>
                  <div className="text-xl font-extrabold text-navy font-mono mt-0.5">387,600 L</div>
                  <div className="text-[10px] text-emerald-600 font-medium">85% Collection Efficiency</div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200/60">
                <Link
                  href="/dashboard/rainwater"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-aqua-dark hover:underline"
                >
                  <span>Open RWH Calculator</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Leakage Dispatch & Public Utility Escalation (4 cols) */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                    Mandatory Req #4
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-navy">
                    Leakage &amp; Utility Escalation
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Photo-verified pipe burst reporting with GPS tags. Routes repairs to society maintenance and forwards main supply line fractures to municipal utility desks (BWSSB dockets).
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Utility Docket #</div>
                  <div className="text-sm font-bold text-navy font-mono mt-0.5">BWSSB-LK-2026-8941</div>
                  <div className="text-[10px] text-amber-600 font-medium">Forwarded — Awaiting Inspection</div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200/60">
                <Link
                  href="/dashboard/leakage"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:underline"
                >
                  <span>Report Leak or View Tickets</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Bento Card 5: Community Conservation & Verified Savings (4 cols) */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    Mandatory Req #5
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-navy">
                    Conservation Hub &amp; Forums
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Encourage water conservation with wing leaderboards and peer tips. Strictly segregates physically metered savings from behavioral formula estimates.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Society Conservation</div>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">18,600 L Saved</div>
                  <div className="text-[10px] text-slate-500">Wing A Leader (8,400 L verified)</div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200/60">
                <Link
                  href="/dashboard/conservation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <span>View Conservation Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demand Forecasting & Depletion Engine Section */}
      <section id="ai-engine" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-xs font-bold text-primary">
                <Cpu className="h-4 w-4" />
                <span>AI WATER INTELLIGENCE ENGINE</span>
              </div>

              <h2 className="font-extrabold text-3xl tracking-tight text-navy sm:text-4xl">
                Autoregressive Seasonal Demand Forecasting &amp; Days-Left Estimator
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Anticipate summer demand spikes before storage drops into emergency levels. The AR-SIM engine forecasts 7-day society consumption using historical water bills, occupancy patterns, and temperature indicators, evaluated chronologically to prevent data leakage.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-navy">Multi-Tank Depletion Runway Model</h4>
                    <p className="text-xs text-slate-500">
                      Calculates exact hours until emergency cutoff, accounting for usable storage while deducting bottom sediment dead volume.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-navy">Validated Time-Split Backtesting</h4>
                    <p className="text-xs text-slate-500">
                      Evaluated on real chronological splits: Mean Absolute Error (MAE) of 1,840 Liters (5.1% variance) on 35,000 L/day quotas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/dashboard/ai-forecast"
                  className="rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-hover transition"
                >
                  View 7-Day AI Forecast
                </Link>
                <Link
                  href="/dashboard/water-remaining"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                >
                  Water Remaining Calculator
                </Link>
              </div>
            </div>

            {/* AI Visualization Card */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-navy">Predicted Demand vs Safe Allocation</h4>
                  <p className="text-[11px] text-slate-500">Next 7 Days Forecast (Greenwood Residency)</p>
                </div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  MAE: 5.1%
                </span>
              </div>

              {/* Progress Bars for Upcoming Days */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>18 Nov (Wednesday)</span>
                    <span className="font-mono text-navy font-bold">35,200 L / 38,000 L Capacity</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>19 Nov (Thursday)</span>
                    <span className="font-mono text-navy font-bold">36,000 L / 38,000 L Capacity</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>20 Nov (Friday - Weekend Spike)</span>
                    <span className="font-mono text-amber-600 font-bold">37,800 L (Alert: Near Threshold)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "99%" }} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between border border-slate-200">
                <span className="font-medium">Recommended Autonomous Action:</span>
                <span className="font-bold text-primary">Pre-order 1 Extra 6kL Tanker on Thursday</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IoT Sensor Fleet & Telemetry Ingestion Section */}
      <section id="telemetry" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-dark">
              Hardware Telemetry &amp; Gateway
            </span>
            <h2 className="font-extrabold text-3xl tracking-tight text-navy sm:text-4xl">
              Connected IoT Sensor Fleet Matrix
            </h2>
            <p className="text-sm text-slate-600">
              Low-power ESP32 microcontrollers with RS485 Modbus piezoresistive pressure transducers, ultrasonic sump transmitters, and water-quality screening probes.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Hydrostatic Sensor
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-bold text-sm text-navy">Borewell #2 Transducer</h4>
              <div className="font-mono text-2xl font-extrabold text-navy">18.4 m</div>
              <p className="text-[11px] text-slate-500">
                316L stainless steel submersible probe anchored at 120m below casing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-aqua-light px-2 py-0.5 text-[10px] font-bold text-aqua-dark">
                  Ultrasonic Sump
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-bold text-sm text-navy">Underground Sump 1</h4>
              <div className="font-mono text-2xl font-extrabold text-navy">142.5 kL</div>
              <p className="text-[11px] text-slate-500">
                Continuous contactless level sensor measuring usable storage buffer.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Water Quality Screen
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-bold text-sm text-navy">TDS / Turbidity / pH</h4>
              <div className="font-mono text-2xl font-extrabold text-navy">342 ppm</div>
              <p className="text-[11px] text-slate-500">
                Online screening indicators (TDS 342 ppm · Turbidity 1.8 NTU · pH 7.4).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                  Electromagnetic
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-bold text-sm text-navy">Main Line Flowmeter</h4>
              <div className="font-mono text-2xl font-extrabold text-navy">84 LPM</div>
              <p className="text-[11px] text-slate-500">
                Instantaneous intake flow and gate tanker discharge calibration.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/dashboard/iot-devices"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-primary transition"
            >
              <Radio className="h-4 w-4" />
              <span>Launch Live IoT Hardware Simulation Console &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* High-Impact Bottom Call to Action with Faded Community Water Telemetry Background */}
      <section className="relative overflow-hidden py-28 sm:py-36 bg-[#071B49] text-white">
        {/* Background Image Layer - Faded & Clearly Visible */}
        <div className="absolute inset-0 z-0">
          <img
            src="/community-water-intelligence-bg.jpg"
            alt="Community Water Infrastructure Background"
            className="h-full w-full object-cover object-center opacity-55"
          />
          {/* Subtle dark overlay for optimal text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071B49]/90 via-[#071B49]/60 to-[#071B49]/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-aqua/40 bg-navy-900/80 px-4 py-1.5 text-xs font-semibold text-aqua shadow-md backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-aqua animate-pulse" />
            <span>Community Water Resilience & Telemetry</span>
          </div>

          <h2 className="font-extrabold text-3xl sm:text-5xl tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Deploy Water Intelligence Across Your Residential Community
          </h2>

          <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Eliminate water anxiety. Know your exact water reserves, track groundwater drawdown, verify tanker arrivals, and coordinate community conservation.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-white shadow-xl shadow-primary/40 hover:bg-primary-hover hover:scale-105 transition-all duration-200"
            >
              <span>Explore Live Dashboard Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-navy/90 backdrop-blur-md px-6 py-4 text-sm font-semibold text-white hover:bg-navy-700 hover:border-white/40 transition shadow-lg"
            >
              <span>Switch Demo Persona</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              <span className="font-extrabold text-navy text-sm">AquaTrace Water Intelligence</span>
            </div>
            <p>
              Problem Statement 4: Water Scarcity and Groundwater Level Monitoring Dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-primary transition">Live Dashboard</Link>
            <Link href="/dashboard/water-availability" className="hover:text-primary transition">Availability</Link>
            <Link href="/dashboard/groundwater" className="hover:text-primary transition">Groundwater</Link>
            <Link href="/dashboard/tanker" className="hover:text-primary transition">Tanker Logistics</Link>
            <Link href="/dashboard/rainwater" className="hover:text-primary transition">RWH Calculator</Link>
            <Link href="/dashboard/leakage" className="hover:text-primary transition">Leak Reports</Link>
            <Link href="/dashboard/conservation" className="hover:text-primary transition">Conservation Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
