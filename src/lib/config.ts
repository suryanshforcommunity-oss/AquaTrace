export interface PlatformConfig {
  appName: string;
  appShortName: string;
  tagline: string;
  description: string;
  version: string;
  defaultSocietyId: string;
  allowSelfRegistration: boolean;
  units: {
    volume: string;
    depth: string;
    flow: string;
    tds: string;
    turbidity: string;
    ph: string;
  };
  thresholds: {
    groundwaterSafeMaxMeters: number;
    groundwaterWarningMaxMeters: number;
    groundwaterCriticalMeters: number;
    tankLevelLowPercent: number;
    tankLevelCriticalPercent: number;
  };
}

export const defaultPlatformConfig: PlatformConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "AquaTrace Intelligence",
  appShortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME || "AquaTrace",
  tagline: "Community Water Intelligence & Conservation Platform",
  description: "A community-driven water resource monitoring, groundwater tracking, tanker logistics, and rainwater conservation ecosystem.",
  version: "2.4.0-prod",
  defaultSocietyId: "soc_greenwood_01",
  allowSelfRegistration: true,
  units: {
    volume: "Litres",
    depth: "Metres below reference",
    flow: "Litres / Minute (LPM)",
    tds: "ppm",
    turbidity: "NTU",
    ph: "pH Units",
  },
  thresholds: {
    groundwaterSafeMaxMeters: 15.0,
    groundwaterWarningMaxMeters: 20.0,
    groundwaterCriticalMeters: 24.0,
    tankLevelLowPercent: 30,
    tankLevelCriticalPercent: 15,
  },
};

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    category: "OVERVIEW",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Water Availability",
    href: "/dashboard/water-availability",
    icon: "Droplets",
    category: "MONITOR",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Groundwater",
    href: "/dashboard/groundwater",
    icon: "ArrowDownToLine",
    category: "MONITOR",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Water Quality",
    href: "/dashboard/water-quality",
    icon: "FlaskConical",
    category: "MONITOR",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Tanker Logistics",
    href: "/dashboard/tanker",
    icon: "Truck",
    category: "MANAGE",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Rainwater Harvesting",
    href: "/dashboard/rainwater",
    icon: "CloudRain",
    category: "MANAGE",
    roles: ["resident", "admin", "maintenance"],
  },
  {
    name: "Leakage Reports",
    href: "/dashboard/leakage",
    icon: "AlertTriangle",
    category: "MANAGE",
    badgeKey: "unresolvedLeaks",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "AI Forecast",
    href: "/dashboard/ai-forecast",
    icon: "Cpu",
    category: "INTELLIGENCE",
    roles: ["resident", "admin", "utility"],
  },
  {
    name: "Water Remaining",
    href: "/dashboard/water-remaining",
    icon: "Hourglass",
    category: "INTELLIGENCE",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Scarcity Radar",
    href: "/dashboard/scarcity-radar",
    icon: "Radar",
    category: "INTELLIGENCE",
    roles: ["admin", "utility"],
  },
  {
    name: "Conservation Hub",
    href: "/dashboard/conservation",
    icon: "Award",
    category: "COMMUNITY",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "IoT Devices",
    href: "/dashboard/iot-devices",
    icon: "Radio",
    category: "SYSTEM",
    roles: ["admin", "maintenance"],
  },
  {
    name: "Alerts & Events",
    href: "/dashboard/alerts",
    icon: "Bell",
    category: "SYSTEM",
    badgeKey: "activeAlerts",
    roles: ["resident", "admin", "maintenance", "utility"],
  },
  {
    name: "Society Settings",
    href: "/dashboard/settings",
    icon: "Sliders",
    category: "SYSTEM",
    roles: ["admin"],
  },
];

