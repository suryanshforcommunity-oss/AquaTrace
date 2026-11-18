"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { IoTDevice } from "@/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import {
  Radio,
  Cpu,
  Wifi,
  Battery,
  Activity,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function IoTDevicesPage() {
  const { iotDevices, ingestDeviceTelemetry, selectedSociety, currentRole } = useAppStore();

  // Ingestion Simulator State
  const [selectedDevice, setSelectedDevice] = useState<string>("esp32_gw_02");
  const [simMeasurementType, setSimMeasurementType] = useState<string>("groundwater_depth");
  const [simValue, setSimValue] = useState<number>(18.52);
  const [simUnit, setSimUnit] = useState<string>("m");
  const [lastIngestedPayload, setLastIngestedPayload] = useState<string | null>(null);
  const [ingestSuccess, setIngestSuccess] = useState<boolean>(false);

  const handleSimulateIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      societyId: selectedSociety.id,
      deviceId: selectedDevice,
      measurementPointId: selectedDevice === "esp32_gw_02" ? "bw_02" : "sump_01",
      measurementType: simMeasurementType,
      value: simValue,
      unit: simUnit,
      timestamp: new Date().toISOString(),
      source: "iot",
    };

    // Client store ingestion
    ingestDeviceTelemetry({
      deviceId: selectedDevice,
      measurementPointId: payload.measurementPointId,
      measurementType: simMeasurementType,
      value: simValue,
      unit: simUnit,
    });

    setLastIngestedPayload(JSON.stringify(payload, null, 2));
    setIngestSuccess(true);
    setTimeout(() => setIngestSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              IoT Sensor Grid &amp; Hardware Telemetry Nodes
            </h1>
            <span className="rounded-full bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 text-xs font-bold text-cyan-700 flex items-center gap-1">
              <Radio className="h-3 w-3 text-cyan-600 animate-pulse" />
              <span>ESP32 Wi-Fi / LoRaWAN Mesh</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Real-time status of submersible hydrostatic depth transducers, ultrasonic tank sensors, and gate flow transmitters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>4 Devices Active &amp; Polling</span>
          </span>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {iotDevices.map((dev) => {
          const statusStyle = getStatusColor(dev.status);
          return (
            <div
              key={dev.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                    <Radio className="h-5 w-5 animate-pulse" />
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}
                  >
                    {dev.status}
                  </span>
                </div>

                <h3 className="mt-3 font-bold text-sm text-content-primary line-clamp-1">{dev.name}</h3>
                <p className="text-xs text-content-secondary mt-0.5">{dev.location}</p>

                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Latest Transmitted Telemetry:</span>
                  <div className="mt-1 font-extrabold text-xl text-primary">
                    {dev.currentReading.value} {dev.currentReading.unit}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block capitalize">
                    {dev.currentReading.type.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 text-xs space-y-1.5 text-content-secondary">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Battery className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Battery</span>
                  </span>
                  <strong className="text-content-primary">{dev.batteryLevelPercent}%</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wifi className="h-3.5 w-3.5 text-primary" />
                    <span>Signal</span>
                  </span>
                  <span className="text-slate-600">{dev.signalStrengthDbm} dBm (RSSI)</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Firmware: {dev.firmwareVersion}</span>
                  <span>{dev.lastPing}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive ESP32 Ingestion Simulator & API Documentation (Admin & Tech Only) */}
      {currentRole === "admin" || currentRole === "maintenance" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Simulator Form (6 cols) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-content-primary">
                  Live Sensor Ingestion Simulator Console
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                Interactive Hardware Demo
              </span>
            </div>

            <p className="mt-2 text-xs text-content-secondary">
              Simulate an ESP32 HTTPS POST payload reaching the backend. The dashboard and hydrograph will immediately reflect the incoming reading.
            </p>

            <form onSubmit={handleSimulateIngest} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">Target Hardware Node</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none"
                >
                  {iotDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.macAddress})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Measurement Type</label>
                  <select
                    value={simMeasurementType}
                    onChange={(e) => setSimMeasurementType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-semibold"
                  >
                    <option value="groundwater_depth">groundwater_depth (m)</option>
                    <option value="tank_volume">tank_volume (L)</option>
                    <option value="flow_rate">flow_rate (LPM)</option>
                    <option value="tds">tds (ppm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-content-primary mb-1">Sensor Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={simValue}
                    onChange={(e) => setSimValue(Number(e.target.value))}
                    required
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-primary focus:outline-none font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition"
              >
                <Send className="h-4 w-4" />
                <span>Simulate ESP32 Ingestion Packet</span>
              </button>
            </form>

            {ingestSuccess && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Packet successfully validated &amp; ingested into Hydrograph!</span>
              </div>
            )}
          </div>

          {/* REST API Payload Schema (6 cols) */}
          <div className="rounded-2xl border border-slate-200 bg-navy p-5 shadow-card lg:col-span-6 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-700 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-aqua" />
                  <h3 className="font-bold text-sm text-white">REST Ingestion Endpoint Schema</h3>
                </div>
                <span className="text-[10px] text-aqua font-mono">POST /api/iot/ingest</span>
              </div>

              <div className="mt-3">
                <p className="text-xs text-slate-300 mb-2">
                  Suggested ESP32 payload structure authenticated via device token:
                </p>
                <pre className="rounded-xl bg-navy-900 p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-navy-700">
                  {lastIngestedPayload ||
                    `{
  "societyId": "soc_greenwood_01",
  "deviceId": "esp32_gw_02",
  "measurementPointId": "bw_02",
  "measurementType": "groundwater_depth",
  "value": 18.52,
  "unit": "m",
  "timestamp": "${new Date().toISOString()}",
  "source": "iot"
}`}
                </pre>
              </div>
            </div>

            <div className="mt-4 border-t border-navy-700 pt-3 text-[11px] text-slate-400">
              <strong>Security:</strong> All devices use pre-shared API keys or MQTT mTLS certificates. Device secrets are strictly decoupled from client-side bundles.
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span>Automated Society Telemetry Network</span>
          </div>
          <p className="leading-relaxed">
            All 6 telemetry nodes across Greenwood Heights (borewells, underground sumps, overhead tanks, and gate meters) transmit automated telemetry readings to calculate real-time water availability and warn of anomalies. Hardware engineering controls, calibration parameters, and packet injection tools are restricted to estate technicians.
          </p>
        </div>
      )}
    </div>
  );
}

