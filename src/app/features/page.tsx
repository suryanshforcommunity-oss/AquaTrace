"use client";

import React from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/shared/StaggeredMenu";
import { STAGGERED_MENU_ITEMS, STAGGERED_MENU_SOCIALS, STAGGERED_MENU_COLORS } from "@/lib/navigationConfig";
import {
  Droplets,
  ArrowRight,
  ArrowDownToLine,
  Truck,
  CloudRain,
  AlertTriangle,
  Award,
  Cpu,
  Hourglass,
  FlaskConical,
  Radio,
  Radar,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "1. Daily Water Availability & Tanker Log",
      badge: "Mandatory Feature 1",
      desc: "Log daily municipal supply, tanker volume, and borewell runtimes. Compares planned vs actual tanker arrivals with flowmeter verification at the society intake gate.",
      icon: Droplets,
      color: "text-primary bg-primary-light",
      href: "/dashboard/water-availability",
    },
    {
      title: "2. Groundwater Depth Visualization",
      badge: "Mandatory Feature 2",
      desc: "Inverted hydrographs plotted relative to documented casing datums (+MSL). Distinguishes automated 316L hydrostatic transducer pings from community acoustic dip-tape verifications.",
      icon: ArrowDownToLine,
      color: "text-cyan-700 bg-cyan-50",
      href: "/dashboard/groundwater",
    },
    {
      title: "3. Rainwater Harvesting & Calculator",
      badge: "Mandatory Feature 3",
      desc: "Complete asset registry with maintenance checklists for first-flush diverters, and the official formula calculator: Potential = Catchment Area × Rainfall × Runoff × Efficiency.",
      icon: CloudRain,
      color: "text-emerald-700 bg-emerald-50",
      href: "/dashboard/rainwater",
    },
    {
      title: "4. Leakage & Wastage Reporting Pipeline",
      badge: "Mandatory Feature 4",
      desc: "Resident photo-reporting flow linked to facility technicians and official public utility dockets (BWSSB) with genuine docket reference tracking.",
      icon: AlertTriangle,
      color: "text-rose-700 bg-rose-50",
      href: "/dashboard/leakage",
    },
    {
      title: "5. Conservation Hub & Best-Practice Forum",
      badge: "Mandatory Feature 5",
      desc: "Community action logs separating estimated from metered savings, building-wing leaderboards, and peer-to-peer advisory discussions with upvoting.",
      icon: Award,
      color: "text-amber-700 bg-amber-50",
      href: "/dashboard/conservation",
    },
    {
      title: "6. AI Seasonal Demand Forecasting",
      badge: "AI Differentiator",
      desc: "Autoregressive regression model with chronological train/validation splits, predicting 7-to-14 day demand curves with weather and weekend occupancy elasticity.",
      icon: Cpu,
      color: "text-purple-700 bg-purple-50",
      href: "/dashboard/ai-forecast",
    },
    {
      title: "7. Days of Water Remaining Engine",
      badge: "Predictive Analytics",
      desc: "Calculates usable stored water burn rate and incoming supply to project exact hours/days until depletion while avoiding double-counting across sumps and overhead tanks.",
      icon: Hourglass,
      color: "text-amber-800 bg-amber-100",
      href: "/dashboard/water-remaining",
    },
    {
      title: "8. IoT Hardware Node Matrix & Live Ingest",
      badge: "Hardware & IoT",
      desc: "Submersible depth probes, ultrasonic level transmitters, and an interactive simulation console allowing test payloads over authenticated REST endpoints.",
      icon: Radio,
      color: "text-cyan-800 bg-cyan-100",
      href: "/dashboard/iot-devices",
    },
    {
      title: "9. Water Quality Parameter Screening",
      badge: "Water Quality",
      desc: "Continuous analog screening for TDS, Turbidity, and pH with clear scientific disclaimers regarding drinking-water potability.",
      icon: FlaskConical,
      color: "text-blue-700 bg-blue-100",
      href: "/dashboard/water-quality",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-content-primary">
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
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm"
            >
              Dashboard
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Full Feature Matrix</span>
          <h1 className="font-extrabold text-3xl text-navy sm:text-4xl">
            Complete Problem Statement Coverage
          </h1>
          <p className="text-sm text-content-secondary">
            All five mandatory requirements, expected prototype outputs, and differentiating AI &amp; IoT modules.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-base text-content-primary">{feat.title}</h3>
                  <p className="mt-2 text-xs text-content-secondary leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <Link
                    href={feat.href}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Open Module Interface</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

