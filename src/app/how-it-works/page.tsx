"use client";

import React from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/shared/StaggeredMenu";
import { STAGGERED_MENU_ITEMS, STAGGERED_MENU_SOCIALS, STAGGERED_MENU_COLORS } from "@/lib/navigationConfig";
import { Droplets, ArrowRight, Radio, Cpu, Bell, Award, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Data Collection & Telemetry Ingestion",
      desc: "Submersible hydrostatic transducers send depth readings from borewells, ultrasonic transmitters measure usable sump buffers, and residents record daily availability logs and acoustic dip-tape ground truths.",
      icon: Radio,
    },
    {
      step: "02",
      title: "Validation & Engineering Calibration",
      desc: "Measurements are anchored to geodetic casing datums (+MSL). Stored water excludes bottom sediment dead volume to prevent double-counting between underground and overhead tanks.",
      icon: CheckCircle2,
    },
    {
      step: "03",
      title: "Predictive Analytics & AI Intelligence",
      desc: "Autoregressive forecasting models project 7-day demand spikes based on weather and weekend occupancy. The Days-of-Water-Remaining engine calculates hours before crisis triggers.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Coordinated Community Action",
      desc: "Automated alerts enforce borewell resting cycles to prevent motor burnout, tanker gate arrivals are flowmeter-verified, leak reports route to public utilities, and residents log verified water savings.",
      icon: Award,
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

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">System Architecture</span>
          <h1 className="font-extrabold text-3xl text-navy sm:text-4xl">
            How The Platform Operates
          </h1>
          <p className="text-sm text-content-secondary">
            From physical sensors in the ground to coordinated community action.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-extrabold text-lg shadow-md">
                  {st.step}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-base text-content-primary">{st.title}</h3>
                  <p className="text-xs text-content-secondary leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-card hover:bg-primary-hover"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

