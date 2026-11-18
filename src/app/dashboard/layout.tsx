"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#071B49]/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="relative z-50 flex w-72 flex-col bg-[#071B49] text-white shadow-2xl"
            style={{ backgroundColor: "#071B49", color: "#ffffff" }}
          >
            <div className="absolute right-3 top-3.5 z-10">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-[#0C2869] transition"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="flex items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-3 text-slate-600 hover:text-navy md:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <Navbar />
          </div>
        </div>

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-6 pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}

