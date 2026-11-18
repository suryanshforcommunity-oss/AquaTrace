"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { generateSeasonalDemandForecast } from "@/lib/aiForecasting";
import { formatNumber, formatDate, getStatusColor } from "@/lib/utils";
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  CloudRain,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AIForecastPage() {
  const { selectedSociety } = useAppStore();

  const [forecastHorizon, setForecastHorizon] = useState<number>(7);
  const [temperatureAdjustment, setTemperatureAdjustment] = useState<number>(0);

  const forecastData = generateSeasonalDemandForecast(
    [165000, 168000, 166500, 172000, 175000, 189000, 194000],
    selectedSociety.totalResidents,
    forecastHorizon
  );

  const totalPredictedWeekly = forecastData.forecasts.reduce((a, b) => a + b.predictedDemandLiters, 0);
  const totalExpectedSupplyWeekly = forecastData.forecasts.reduce((a, b) => a + b.expectedSupplyLiters, 0);
  const netWeeklyDeficit = totalExpectedSupplyWeekly - totalPredictedWeekly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl text-content-primary md:text-2xl">
              AI Seasonal Water Demand Prediction
            </h1>
            <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700 flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>AR-SIM v2.1 Model</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-content-secondary max-w-2xl">
            Forecasts community water demand curves based on historical draw patterns, weekend elasticity, and weather telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Forecast Horizon:</span>
          {[7, 14].map((d) => (
            <button
              key={d}
              onClick={() => setForecastHorizon(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                forecastHorizon === d ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Authenticity Notice */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 text-xs text-purple-900 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-xs text-purple-900">
            Chronological Validation Standard (Demonstration Dataset Transparency)
          </h4>
          <p className="mt-0.5 text-purple-800 leading-relaxed">
            Trained on an 80/20 chronological time-split (zero future-leakage). Evaluated against Mean Absolute Error (MAE: {forecastData.metrics.meanAbsoluteErrorLiters} L) and R² ({forecastData.metrics.r2Score}). Dataset is clearly designated as synthetic demonstration baseline until consecutive seasonal telemetry accumulates.
          </p>
        </div>
      </div>

      {/* Predictive KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            7-Day Forecast Demand
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-content-primary">
            {formatNumber(totalPredictedWeekly)} L
          </div>
          <span className="text-[11px] text-slate-500">
            Avg: {formatNumber(Math.round(totalPredictedWeekly / forecastHorizon))} L/day
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Scheduled Supply
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-primary">
            {formatNumber(totalExpectedSupplyWeekly)} L
          </div>
          <span className="text-[11px] text-primary font-medium">Grid + Borewell + Tankers</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Net Projected Deficit / Surplus
          </span>
          <div
            className={`mt-1.5 font-extrabold text-2xl ${
              netWeeklyDeficit < 0 ? "text-rose-600" : "text-emerald-700"
            }`}
          >
            {netWeeklyDeficit < 0 ? `- ${formatNumber(Math.abs(netWeeklyDeficit))} L` : `+ ${formatNumber(netWeeklyDeficit)} L`}
          </div>
          <span className="text-[11px] text-slate-500">
            {netWeeklyDeficit < 0 ? "Weekend shortfall anticipated" : "Adequate buffer"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-content-secondary">
            Model Confidence Interval
          </span>
          <div className="mt-1.5 font-extrabold text-2xl text-purple-700">95.0%</div>
          <span className="text-[11px] text-slate-500">
            MAPE: {forecastData.metrics.meanAbsolutePercentageError}% error
          </span>
        </div>
      </div>

      {/* Main Composed Chart: Predicted Demand vs Supply vs Temperature */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-base text-content-primary">
              Multi-Day Forecast: Demand Curves vs Scheduled Supply
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Notice the demand surge on Saturday &amp; Sunday driven by higher weekend residential occupancy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" /> Scheduled Supply
            </span>
            <span className="flex items-center gap-1 font-semibold text-orange">
              <span className="h-2 w-2 rounded-full bg-orange" /> Predicted Demand
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Historical Baseline
            </span>
          </div>
        </div>

        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData.forecasts} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#667085" }} />
              <YAxis tick={{ fontSize: 11, fill: "#667085" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                formatter={(val: any, name: string) => [
                  `${formatNumber(Number(val))} L`,
                  name === "predictedDemandLiters"
                    ? "Predicted Demand"
                    : name === "expectedSupplyLiters"
                    ? "Expected Supply"
                    : "Historical Baseline",
                ]}
                contentStyle={{ backgroundColor: "#071B49", color: "#FFF", borderRadius: 8, fontSize: 12 }}
              />
              <Legend />
              <Bar
                dataKey="expectedSupplyLiters"
                name="Expected Supply (L)"
                fill="#073BCE"
                opacity={0.8}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="predictedDemandLiters"
                name="AI Predicted Demand (L)"
                stroke="#FF6900"
                strokeWidth={3}
                dot={{ r: 5, fill: "#FF6900" }}
              />
              <Line
                type="monotone"
                dataKey="historicalDemandLiters"
                name="Historical Avg Baseline (L)"
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabular Breakdown of Forecast Days */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h3 className="font-bold text-sm text-content-primary mb-3">Daily Forecast Telemetry Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Date Horizon</th>
                <th className="py-2.5">Forecast Demand</th>
                <th className="py-2.5">Scheduled Supply</th>
                <th className="py-2.5">Net Variance</th>
                <th className="py-2.5">Shortage Risk</th>
                <th className="py-2.5">Temp (°C)</th>
                <th className="py-2.5">Rainfall (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecastData.forecasts.map((day) => {
                const statusStyle = getStatusColor(day.shortageRisk);
                return (
                  <tr key={day.date} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 font-bold text-content-primary whitespace-nowrap">{day.date}</td>
                    <td className="py-2.5 font-extrabold text-content-primary">
                      {formatNumber(day.predictedDemandLiters)} L
                    </td>
                    <td className="py-2.5 font-bold text-primary">
                      {formatNumber(day.expectedSupplyLiters)} L
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`font-bold ${
                          day.deficitOrSurplusLiters < 0 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {day.deficitOrSurplusLiters > 0 ? "+" : ""}
                        {formatNumber(day.deficitOrSurplusLiters)} L
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{day.shortageRisk}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{day.temperatureCelsius} °C</td>
                    <td className="py-2.5 text-slate-600">
                      {day.rainfallMmForecast > 0 ? (
                        <span className="text-cyan-700 font-semibold">{day.rainfallMmForecast} mm</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

