"use client";

import React from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/shared/StaggeredMenu";
import { STAGGERED_MENU_ITEMS, STAGGERED_MENU_SOCIALS, STAGGERED_MENU_COLORS } from "@/lib/navigationConfig";
import { Droplets, ArrowRight, ShieldCheck, Users, Target, HeartHandshake, Building2 } from "lucide-react";

export default function AboutPage() {
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

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-8 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">About The Platform</span>
          <h1 className="mt-1 font-extrabold text-3xl text-navy sm:text-4xl">
            Community-Driven Water Resilience for Urban Residential Layouts
          </h1>
          <p className="mt-3 text-sm text-content-secondary leading-relaxed">
            AquaTrace addresses <strong>Problem Statement 4: Water Scarcity and Groundwater Level Monitoring Dashboard</strong>. Seasonal water shortages, declining groundwater tables, and irregular tanker distributions cause severe daily hardships and public-health risks across drought-prone and rapidly expanding residential societies.
          </p>
        </div>

        {/* 3 Core Mission Pillars */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-2">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-base text-content-primary">1. Monitor</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Log daily water availability, track borehole drawdown relative to reference datums, and screen water quality indicators.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <h3 className="font-bold text-base text-content-primary">2. Manage</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Verify municipal tanker schedules, inspect rainwater harvesting units, and route leakage reports to public utility departments.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-2">
            <HeartHandshake className="h-6 w-6 text-orange" />
            <h3 className="font-bold text-base text-content-primary">3. Conserve</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Log verified household water-saving actions, share peer conservation advice, and forecast seasonal demand.
            </p>
          </div>
        </div>

        {/* Stakeholder Ecosystem */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="font-bold text-lg text-content-primary">Multi-Stakeholder Collaboration</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <strong className="text-content-primary block mb-1">Residents</strong>
              <p className="text-content-secondary">
                View real-time water availability, receive arrival alerts for tankers, submit leak reports with photos, and log conservation activities.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <strong className="text-content-primary block mb-1">Society Management (RWA)</strong>
              <p className="text-content-secondary">
                Audit sump buffers, procure tankers with verified flowmeter manifests, monitor borewell resting cycles, and verify water savings.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <strong className="text-content-primary block mb-1">Maintenance &amp; Facility Technicians</strong>
              <p className="text-content-secondary">
                Receive leak dispatch tickets, inspect RWH first-flush diverters, and clear sand-gravel filters before monsoon downpours.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <strong className="text-content-primary block mb-1">Public Utility Boards (BWSSB)</strong>
              <p className="text-content-secondary">
                Receive escalated municipal line leak dockets, cross-reference bulk intake reconciliation, and coordinate emergency tanker convoys.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-card hover:bg-primary-hover"
          >
            <span>Explore Working Prototype</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

