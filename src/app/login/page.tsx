"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { UserRole } from "@/types";
import { Droplets, Shield, User, Wrench, Building2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useAppStore();

  const [activeTab, setActiveTab] = useState<"quick_persona" | "credentials">("quick_persona");
  const [email, setEmail] = useState("admin@greenwoodrwa.org");
  const [password, setPassword] = useState("••••••••");

  const handlePersonaLogin = (role: UserRole) => {
    setCurrentRole(role);
    router.push("/dashboard");
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole("admin");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
            <Droplets className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl text-navy">AquaTrace</span>
        </Link>
        <h2 className="mt-3 font-extrabold text-xl text-content-primary">
          Sign In to Your Water Grid Portal
        </h2>
        <p className="mt-1 text-xs text-content-secondary">
          Access role-based permissions for residents, society administrators, and municipal utility desks.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
          {/* Persona selector vs Credentials tab */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("quick_persona")}
              className={`rounded-lg py-1.5 transition ${
                activeTab === "quick_persona" ? "bg-white text-content-primary shadow-sm" : "hover:text-slate-900"
              }`}
            >
              1-Click Demo Persona
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`rounded-lg py-1.5 transition ${
                activeTab === "credentials" ? "bg-white text-content-primary shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Email &amp; Password
            </button>
          </div>

          {activeTab === "quick_persona" ? (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Select Persona to Test Role-Based UI:
              </span>

              {[
                {
                  role: "admin" as UserRole,
                  title: "Society Administrator",
                  name: "Vikram Sethi (Estate Manager)",
                  desc: "Full permissions: Tanker booking, AI forecast, threshold alerts, settings",
                  icon: Shield,
                  color: "border-blue-200 hover:bg-blue-50/50 text-primary",
                },
                {
                  role: "resident" as UserRole,
                  title: "Resident User",
                  name: "Aarav Patel (Block A - 402)",
                  desc: "Log water availability, submit leak reports, view schedules & conservation",
                  icon: User,
                  color: "border-emerald-200 hover:bg-emerald-50/50 text-emerald-700",
                },
                {
                  role: "maintenance" as UserRole,
                  title: "Maintenance Technician",
                  name: "Ramesh Kumar (Lead Plumber)",
                  desc: "View assigned complaints, update repair evidence, complete RWH checklist",
                  icon: Wrench,
                  color: "border-amber-200 hover:bg-amber-50/50 text-amber-700",
                },
                {
                  role: "utility" as UserRole,
                  title: "Public Utility Authority",
                  name: "K. Narayanaswamy (BWSSB AEE)",
                  desc: "View forwarded municipal leak dockets, verify bulk water feed schedules",
                  icon: Building2,
                  color: "border-purple-200 hover:bg-purple-50/50 text-purple-700",
                },
              ].map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.role}
                    onClick={() => handlePersonaLogin(persona.role)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${persona.color}`}
                  >
                    <div className="mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-content-primary">{persona.title}</div>
                      <div className="text-[11px] font-medium text-slate-600">{persona.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{persona.desc}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 self-center" />
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-content-primary mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-content-primary mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400">
            Open-source hackathon prototype. Role permissions update dynamically in runtime.
          </div>
        </div>
      </div>
    </div>
  );
}

