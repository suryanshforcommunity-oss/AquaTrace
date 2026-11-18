# AquaTrace — Community Water Intelligence & Conservation Platform

[![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **AquaTrace** is a production-grade, community-driven water resource monitoring and conservation portal developed for residential layouts, gated communities, housing societies (RWAs), and semi-urban clusters facing severe groundwater depletion, irregular municipal supply, and tanker reliance.

---

## 📌 Problem Statement & Context

### Official Challenge (Problem Statement 4)
> **"Water Scarcity and Groundwater Level Monitoring Dashboard: Develop a community-driven water resource monitoring and conservation portal that tracks local groundwater levels, tanker supply schedules, and rainwater-harvesting unit functionality across drought-prone or rapidly urbanizing residential layouts."**

### Real-Life Motivation
In rapid urbanization hubs and drought-prone regions (such as Bangalore's Sarjapur, Bellandur, and Whitefield corridors), residential societies experience extreme water vulnerabilities:
- Erratic municipal pipeline pressures leading to sudden cutoffs.
- Depleting groundwater aquifers with borewell depths plunging beyond 18–22 meters, causing motor burnouts and aquifer cavitation.
- Opaque private water tanker cartels, price gouging, and unverified arrival volumes.
- Poorly maintained rainwater harvesting (RWH) filtration units that overflow into storm drains rather than recharging local aquifers.
- Slow utility response to underground pipe bursts, leading to thousands of liters lost before valve isolation.

**AquaTrace** solves these interconnected challenges through a unified telemetry, scheduling, and community intelligence dashboard.

---

## 🚀 Key Modules & Capabilities

### 1. Multi-Sump Water Availability & Inflow Ledger
* **Real-time Storage Reservoir Telemetry**: Tracks live water reserves across Potable Underground Sumps, Auxiliary Tanks, and Overhead Reservoirs with capacity utilization bars.
* **Intake Logging Engine**: Logs incoming water from Municipal pipelines, Borewells, Private Tankers, and Rainwater Harvesting units.
* **Burn Rate & Runway Countdown**: Computes dynamic consumption burn rate (`L/day`) and displays exact **Days / Hours of Water Remaining** before reservoir exhaustion.

### 2. Groundwater Depth Visualization & Hydrographs
* **Inverted Depth Hydrograph**: Renders true-to-physics hydrographs where deeper water tables plot downward (e.g., from safe $<15\text{ m}$ to critical $>20\text{ m}$).
* **Cone of Depression Tracking**: Visualizes static water levels (SWL) versus dynamic pumping water levels (DWL).
* **Dual Ingestion**: Real-time RS485 Modbus / IoT hydrostatic pressure transducers alongside citizen dip-tape manual verification.

### 3. Tanker Supply Scheduling & Logistics
* **Schedule & Arrival Board**: Real-time board tracking upcoming municipal and private tankers with vendor tags, driver contact, vehicle registration numbers, and time windows.
* **Delivery Verification**: Automated volume reconciliation via ultrasonic gate dips and flowmeters before intake valves open.
* **Role-Gated Ordering**: Role-based access ensures only authorized facility administrators book tankers, preventing duplicate contractor calls.

### 4. Rainwater Harvesting (RWH) Maintenance & Effectiveness Calculator
* **Runoff Yield Calculator**: Calculates harvestable volume using the standard hydrological formula:
  $$Y = P \times A \times C \times \eta$$
  *(Precipitation $\times$ Catchment Area $\times$ Runoff Coefficient $\times$ Filter Efficiency)*.
* **Maintenance Checklist**: Tracks desilting, leaf-trap cleaning, first-flush diverters, and sand-gravel filter mesh backwashing.
* **Recharge Well Surveillance**: Monitors percolation rate and aquifer recharge efficiency.

### 5. Leakage & Wastage Reporting with Utility Escalation
* **Citizen Reporting Workflow**: Residents report pipe bursts, dripping mains, and overflow tanks with photo evidence, urgency rating, and geo-location.
* **Public Utility Integration (BWSSB / Municipal)**: Generates official escalation dockets (e.g., `BWSSB-ESC-2026-XXXX`) with automated escalation if internal resolution exceeds SLA limits.
* **Internal Work Orders**: Maintenance technicians update status (`submitted` $\rightarrow$ `under_review` $\rightarrow$ `in_progress` $\rightarrow$ `resolved`).

### 6. Water Quality Screening Module
* **Multi-Parameter Sensor Node**: Tracks Total Dissolved Solids (TDS in ppm), Turbidity (NTU), and pH levels.
* **Safety Disclaimers**: Clarifies baseline screening parameters versus microbiological / heavy metal laboratory testing standards.

### 7. Community Conservation Hub & Forum
* **Verified Savings Ledger**: Residents log home water-saving actions (aerator installations, greywater reuse, drip irrigation) verified by peers.
* **Best-Practice Forum**: Threaded discussions, upvoting, and RWA advisories for seasonal rationing protocols.

### 8. Role-Based Access Control (RBAC)
Dedicated role views tailored to distinct stakeholders:
* 🛡️ **Society Administrator**: Full control (tanker procurement, manual intakes, config thresholds, valve cutoff).
* 👤 **Resident**: Read-only telemetry, personal water saving logs, leakage reporting, community forum participation.
* 🔧 **Maintenance Technician**: Work order assignment, RWH maintenance checklist updates, pump resting cycles.
* 🏛️ **Public Utility Engineer (BWSSB)**: Escalated leakage docket monitoring and municipal feeder pressure sync.
* 📡 **IoT Telemetry Node**: Automated webhook sensor ingestion.

### 9. Emergency Main Valve Cutoff
* Interactive master valve isolation simulation to immediately arrest catastrophic pipe bursts and backflow events.

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AquaTrace Client UI                           │
│  (Next.js 14 App Router, React 18, Tailwind CSS, Lucide, Recharts)     │
└───────────────────▲────────────────────────────────────▲───────────────┘
                    │                                    │
                    ▼                                    ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│       App Store & React Context      │   │     SaaS Navigation &       │
│      (Optimistic Client State)       │   │    StaggeredMenu Engine     │
└───────────────────▲──────────────────┘   └─────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js Serverless API Route Handlers                │
│    /api/data  │  /api/tankers  │  /api/groundwater  │  /api/leakage    │
│    /api/alerts │  /api/conservation  │  /api/water-availability       │
└───────────────────▲────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            Dual-Tier Serverless Persistence Engine (Vercel-Ready)       │
│    Primary File DB (data/db.json)  ◄──►  /tmp Fallback + Memory Cache  │
└────────────────────────────────────────────────────────────────────────┘
```

| Layer | Technologies Used |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing, interface schemas) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) (Custom Aqua & Navy enterprise palette) |
| **Charts & Data Viz** | [Recharts 2.13](https://recharts.org/) (Inverted hydrographs, multi-bar sumps) |
| **Icons & UI Micro-interactions** | [Lucide React](https://lucide.dev/), [GSAP](https://greensock.com/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **State Management** | React Context (`useAppStore`) with optimistic UI dispatch & LocalStorage backup |
| **Persistence Engine** | Serverless-safe JSON file engine with `/tmp` fallback and memory caching for Vercel |

---

## 📦 Project Structure

```
aquaTrace/
├── data/
│   └── db.json                   # Local persistent database file
├── public/
│   └── aquatrace-logo.svg        # Platform vector brand identity
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # RESTful Route Handlers
│   │   │   ├── alerts/
│   │   │   ├── conservation/
│   │   │   ├── data/             # Universal mutation & fetch endpoint
│   │   │   ├── groundwater/
│   │   │   ├── iot/ingest/       # IoT webhook sensor ingestion
│   │   │   ├── leakage/
│   │   │   ├── tankers/
│   │   │   └── water-availability/
│   │   ├── dashboard/            # Core Platform Modules
│   │   │   ├── ai-forecast/      # Depletion & predictive analytics
│   │   │   ├── alerts/           # Notification & threshold center
│   │   │   ├── conservation/     # Hub, savings logs, & community forum
│   │   │   ├── groundwater/      # Hydrograph & borewell telemetry
│   │   │   ├── iot-devices/      # Sensor device health & diagnostics
│   │   │   ├── leakage/          # Incident reporting & BWSSB docketing
│   │   │   ├── rainwater/        # Maintenance checklist & yield calculator
│   │   │   ├── scarcity-radar/   # Neighborhood aquifer vulnerability
│   │   │   ├── settings/         # Thresholds & society parameters
│   │   │   ├── tanker/           # Tanker schedules, dispatch & tracking
│   │   │   ├── water-availability/# Inflow logging & daily water ledgers
│   │   │   ├── water-quality/    # TDS, Turbidity, pH monitoring
│   │   │   ├── water-remaining/  # Burn rate & runtime calculations
│   │   │   ├── layout.tsx        # Dashboard shell with responsive sidebar & navbar
│   │   │   └── page.tsx          # Master executive overview dashboard
│   │   ├── about/                # Problem statement & platform mission
│   │   ├── contact/              # Support & utility contacts
│   │   ├── features/             # Feature breakdown
│   │   ├── how-it-works/         # Technical walkthrough
│   │   ├── login/                # Role-switcher & auth demo
│   │   ├── globals.css           # Tailwind base styles & keyframes
│   │   ├── layout.tsx            # Global HTML wrapper
│   │   └── page.tsx              # Public SaaS landing page
│   ├── components/
│   │   ├── layout/               # Sidebar, Navbar, StaggeredMenu
│   │   └── shared/               # KPICard, Modal, Recharts wrappers
│   ├── lib/
│   │   ├── server/
│   │   │   └── db.ts             # Serverless-resilient persistence layer
│   │   ├── config.ts             # System thresholds & default society config
│   │   ├── mockData.ts           # Realistic seed dataset (Greenwood Heights RWA)
│   │   ├── navigationConfig.ts   # Navigation paths & metadata
│   │   └── store.tsx             # Universal React Context store & sync engine
│   └── types/
│       └── index.ts              # Domain interfaces & TypeScript types
├── .gitignore                    # Production git ignore configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.js             # PostCSS Tailwind config
├── tailwind.config.ts            # Enterprise color theme & fonts
├── tsconfig.json                 # TypeScript compiler configuration
└── vercel.json                   # Vercel deployment configuration
```

---

## 🛠️ Local Development Setup

### Prerequisites
* **Node.js**: v18.17.0 or higher
* **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/suryanshforcommunity-oss/AquaTrace.git
cd AquaTrace
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run the Development Server
```bash
pnpm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

### 4. Build for Production
```bash
pnpm run build
pnpm start
```

---

## ☁️ Deploying to Vercel (One-Click Ready)

AquaTrace is built from the ground up to be **100% Vercel-ready**:

1. **Fork or Push** this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the `AquaTrace` repository.
4. **Build and Output Settings**:
   * **Framework Preset**: Next.js
   * **Build Command**: `pnpm run build` (or `npm run build`)
   * **Output Directory**: `.next`
   * **Install Command**: `pnpm install` (or `npm install`)
5. Click **"Deploy"**.

> [!NOTE]
> AquaTrace includes an adaptive persistence engine in `src/lib/server/db.ts`. On Vercel serverless functions, state mutations are stored in `/tmp/aquatrace_db.json` and in-memory cache, ensuring smooth execution without read-only filesystem errors.

---

## 📡 IoT Ingestion Webhook Specification

External sensor hardware (ESP32, LoRaWAN gateways, Raspberry Pi) can ingest real-time telemetry by issuing `POST` requests to `/api/iot/ingest`:

### Example Request
```http
POST /api/iot/ingest HTTP/1.1
Host: your-domain.vercel.app
Content-Type: application/json

{
  "apiKey": "aq_telemetry_live_mesh_token_2026",
  "societyId": "soc_greenwood_01",
  "deviceId": "esp32_gw_02",
  "sensorType": "groundwater_depth",
  "reading": 18.4,
  "unit": "meters",
  "status": "online",
  "batteryPercent": 94
}
```

### Response
```json
{
  "success": true,
  "message": "Telemetry reading ingested successfully",
  "readingId": "gwr_1795011326453",
  "updatedDepth": 18.4,
  "thresholdTriggered": "warning",
  "alertGenerated": true
}
```

---

## 👥 Roles & Demonstration Credentials

AquaTrace allows instant role simulation directly from the top navigation bar dropdown:

| Role | Badge | Permissions |
|---|---|---|
| **Society Administrator** | `admin` | Full system access: add inflow logs, dispatch tankers, adjust thresholds, trigger emergency cutoff |
| **Society Resident** | `resident` | View-only dashboard, report leaks, log water savings, contribute to forum |
| **Maintenance Staff** | `maintenance` | Assign & resolve leak tickets, update RWH maintenance checklists, verify sensors |
| **Public Utility (BWSSB)** | `utility` | Access escalated leakage dockets, review municipal feeder pressure, update bulk grid status |
| **IoT Telemetry Node** | `iot` | Hardware probe feed simulation and LoRaWAN gateway monitor |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to modify, extend, and deploy for community conservation initiatives.

---

### Developed for Community Water Resilience & Aquifer Stewardship 💧
AquaTrace — Empowering housing societies with real-time groundwater intelligence, transparent tanker distribution, and verified water conservation.
