"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Menu, PanelLeftOpen, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex shrink-0 transition-all duration-300 ${
          desktopCollapsed ? "w-0 overflow-hidden" : "w-64"
        }`}
      >
        <Sidebar
          collapsed={desktopCollapsed}
          onToggleCollapse={() => setDesktopCollapsed(!desktopCollapsed)}
        />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#071B49]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            className="relative z-50 flex w-72 max-w-[85vw] flex-col bg-[#071B49] text-white shadow-2xl h-full animate-in slide-in-from-left duration-200"
            style={{ backgroundColor: "#071B49", color: "#ffffff" }}
          >
            <Sidebar
              isMobile={true}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar Header with Mobile / Desktop Expand Trigger */}
        <div className="flex items-center w-full min-w-0 bg-white border-b border-slate-200">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-1.5 p-3 text-slate-700 hover:text-primary hover:bg-slate-50 md:hidden focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-bold text-slate-800">Menu</span>
          </button>

          {/* Desktop Restore Sidebar Button (Shown when collapsed) */}
          {desktopCollapsed && (
            <button
              onClick={() => setDesktopCollapsed(false)}
              className="hidden md:flex items-center gap-1.5 ml-3 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary transition shadow-sm"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="h-4 w-4 text-primary" />
              <span>Show Sidebar</span>
            </button>
          )}

          <div className="flex-1 min-w-0">
            <Navbar />
          </div>
        </div>

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-6 pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
