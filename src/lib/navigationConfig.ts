import { StaggeredMenuItem, StaggeredMenuSocialItem } from "@/components/shared/StaggeredMenu";

export const STAGGERED_MENU_ITEMS: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "AquaTrace Home Overview", link: "/" },
  { label: "Dashboard", ariaLabel: "Real-time Society Water Grid", link: "/dashboard" },
  { label: "Water Availability", ariaLabel: "Daily Supply and Sump Capacity", link: "/dashboard/water-availability" },
  { label: "Groundwater", ariaLabel: "Aquifer Piezometer Telemetry", link: "/dashboard/groundwater" },
  { label: "Water Quality", ariaLabel: "TDS and Potability Screening", link: "/dashboard/water-quality" },
  { label: "Tanker Logistics", ariaLabel: "Schedules and Gate Verification", link: "/dashboard/tanker" },
  { label: "Rainwater RWH", ariaLabel: "RWH Units and Rooftop Calculator", link: "/dashboard/rainwater" },
  { label: "Report Leakage", ariaLabel: "Utility Escalation and Leak Reports", link: "/dashboard/leakage" },
  { label: "Conservation Hub", ariaLabel: "Community Savings and Tips", link: "/dashboard/conservation" },
  { label: "AI Forecast", ariaLabel: "Machine Learning Demand Forecasting", link: "/dashboard/ai-forecast" },
];

export const STAGGERED_MENU_SOCIALS: StaggeredMenuSocialItem[] = [
  { label: "5 Core Modules", link: "/features" },
  { label: "How It Works", link: "/how-it-works" },
  { label: "Mission & RWA", link: "/about" },
  { label: "Contact Utility", link: "/contact" },
  { label: "IoT Sensor Grid", link: "/dashboard/iot-devices" },
];

export const STAGGERED_MENU_COLORS = ["#071B49", "#073BCE", "#20B8C4"];
