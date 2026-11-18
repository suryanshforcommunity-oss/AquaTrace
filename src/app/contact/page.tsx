"use client";

import React, { useState } from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/shared/StaggeredMenu";
import { STAGGERED_MENU_ITEMS, STAGGERED_MENU_SOCIALS, STAGGERED_MENU_COLORS } from "@/lib/navigationConfig";
import { Droplets, Send, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [societyName, setSocietyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [flatCount, setFlatCount] = useState(300);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Left Info */}
          <div className="space-y-6 md:col-span-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Get In Touch</span>
              <h1 className="mt-1 font-extrabold text-2xl text-navy sm:text-3xl">
                Onboard Your Residential Community
              </h1>
              <p className="mt-2 text-xs text-content-secondary leading-relaxed">
                Connect your RWA management, deploy submersible borewell telemetry, and begin automated water tracking.
              </p>
            </div>

            <div className="space-y-3 text-xs text-content-secondary">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Sarjapur - Bellandur Water Resilience Corridor, Bangalore</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@aquatrace-platform.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 80 4492 1000 (RWA Hotline)</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:col-span-7">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base text-content-primary">Audit Request Submitted</h3>
                <p className="text-xs text-content-secondary max-w-xs mx-auto">
                  Our water engineer will contact you to schedule an on-site borewell and storage audit.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-hover"
                >
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">
                    Apartment / Society Name
                  </label>
                  <input
                    type="text"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    placeholder="e.g. Greenwood Heights RWA"
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1">Your Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-content-primary mb-1">
                      Total Units / Flats
                    </label>
                    <input
                      type="number"
                      value={flatCount}
                      onChange={(e) => setFlatCount(Number(e.target.value))}
                      min={10}
                      required
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">
                    Specific Water Challenges
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Borewell drawdown rapid during peak hours; irregular tanker arrivals..."
                    rows={4}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition"
                >
                  Submit Onboarding Request
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

