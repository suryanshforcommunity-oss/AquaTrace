# Seed Data & Demonstration Persona Guide
## Community Water Intelligence & Conservation Platform

This guide outlines the built-in demonstration seed dataset, role personas, and guided hackathon jury testing flows.

---

### 1. Pre-Loaded Society & Assets

- **Default Layout:** `Greenwood Heights RWA (Block A, B & C)`
  - Location: Sarjapur - Bellandur Corridor, Bangalore
  - Total Units: 420 Apartments | 1,650 Residents
  - Daily Quota: 175,000 Litres
  - Sump Storage: 240,000 Litres (UGT 1 Potable: 120k L, UGT 2 Tanker Buffer: 80k L, RWH Retention: 40k L)
  - Borewells: 3 Deep Boreholes (Well #1 North, Well #2 Clubhouse Primary, Well #3 East Auxiliary)
  - Rainwater Harvesting: 3 Systems (Clubhouse Terrace, Block A Rooftop, Blocks B & C Recharge Pit)

---

### 2. Available User Role Personas

Switch between personas with 1-click in the top navigation bar or from the `/login` page:

| Persona | Name & Unit | Primary Privileges |
|---|---|---|
| **Society Administrator** | Vikram Sethi (Admin Office) | Full control: Tanker booking & gate signoff, AI forecast inspection, alert broadcasting, RWH registration, settings |
| **Resident User** | Aarav Patel (Block A - 402) | View society availability, check tanker ETA, submit leak reports with photos, log water-saving actions, post in forum |
| **Maintenance Technician** | Ramesh Kumar (Chief Plumber) | Receive dispatched pipe leaks, sign off RWH 5-step maintenance checklist, log dip-tape calibration |
| **Public Utility Authority** | K. Narayanaswamy (BWSSB AEE) | View forwarded municipal leaks with docket numbers, monitor regional water stress radar |

---

### 3. Step-by-Step 3-Minute Demonstration Script

1. **Dashboard Overview:** Open `/dashboard`. Point out the 6 real-time KPI tiles (Total available water: 142,500 L, Groundwater depth: 18.4m, Days remaining: 4.2d, Today's burn rate: 28,400 L).
2. **Confirm Tanker Gate Intake:** Under the *Tanker Supply Schedules* table, click **Confirm Intake** on tanker `#KA-04-E-8821`. Enter 6,000L verified volume. Notice that the delivery immediately registers in *Daily Water Availability*!
3. **Inspect Groundwater Hydrograph:** Open `/dashboard/groundwater`. Show the inverted Y-axis where water level dropping looks physically like sub-surface depletion. Click **+ Submit Manual Dip-Tape Reading** and record a calibration point at 18.45m.
4. **Rainwater Effectiveness Calculator:** Open `/dashboard/rainwater`. Adjust the catchment area (650 m²) and rainfall (850 mm) in the calculator to demonstrate the live formula:
   $$\text{Potential} = \text{Area} \times \text{Rainfall} \times C \times E$$
   Point out that calculated potential is explicitly distinguished from metered yield.
5. **Leakage Reporting & Utility Docket:** Open `/dashboard/leakage`. Show the high-urgency pipe burst in Block B Basement. Click **Forward to Utility Department** and observe the generation of official tracking docket `BWSSB-ESC-2026-9041`.
6. **Community Water-Saving Hub:** Open `/dashboard/conservation`. Show how estimated savings and metered savings are strictly isolated. Click **Verify Action** as Admin.
7. **AI Seasonal Demand Forecast:** Open `/dashboard/ai-forecast`. Explain the chronological 80/20 train-split and the weekend demand surge (+12%).
8. **IoT Telemetry Live Ingest:** Open `/dashboard/iot-devices`. In the simulator console, submit an ESP32 payload and observe the real-time ping update.

