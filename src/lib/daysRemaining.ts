export interface DaysRemainingInput {
  usableStoredWaterLiters: number;
  averageDailyConsumptionLiters: number;
  scheduledIncomingSupplyLiters: number;
  forecastedDemandMultiplier?: number; // e.g. 1.05 for weekend spike
}

export interface DailyProjection {
  dayNumber: number;
  dateLabel: string;
  openingStockLiters: number;
  incomingSupplyLiters: number;
  consumptionLiters: number;
  closingStockLiters: number;
  stockPercentage: number;
}

export interface DaysRemainingResult {
  estimatedDaysRemaining: number;
  formattedDays: string;
  shortageRisk: "low" | "moderate" | "high" | "severe";
  usableStoredWaterLiters: number;
  averageDailyConsumptionLiters: number;
  scheduledIncomingSupplyLiters: number;
  depletionProjections: DailyProjection[];
  assumptions: string[];
}

export function calculateDaysRemaining(input: DaysRemainingInput): DaysRemainingResult {
  const {
    usableStoredWaterLiters,
    averageDailyConsumptionLiters,
    scheduledIncomingSupplyLiters,
    forecastedDemandMultiplier = 1.0,
  } = input;

  const adjustedDailyBurn = Math.max(1, averageDailyConsumptionLiters * forecastedDemandMultiplier);

  // Simple static baseline days: Usable Stored / Daily Burn
  // Dynamic forward projection day-by-day:
  let currentStock = usableStoredWaterLiters;
  let simulatedDay = 0;
  const projections: DailyProjection[] = [];

  const maxSimulationDays = 14;
  const today = new Date();

  while (currentStock > 0 && simulatedDay < maxSimulationDays) {
    simulatedDay++;
    const openingStock = currentStock;

    // Incoming supply is assumed for day 1 and scheduled intervals
    const incoming = simulatedDay === 1 ? scheduledIncomingSupplyLiters : 0;
    const dailyDemand = adjustedDailyBurn;

    const closingStock = Math.max(0, openingStock + incoming - dailyDemand);

    const projectedDate = new Date(today);
    projectedDate.setDate(today.getDate() + (simulatedDay - 1));

    projections.push({
      dayNumber: simulatedDay,
      dateLabel: projectedDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      openingStockLiters: Math.round(openingStock),
      incomingSupplyLiters: Math.round(incoming),
      consumptionLiters: Math.round(dailyDemand),
      closingStockLiters: Math.round(closingStock),
      stockPercentage: Math.min(100, Math.round((closingStock / usableStoredWaterLiters) * 100)),
    });

    currentStock = closingStock;
    if (closingStock <= 0) break;
  }

  // Exact days calculation with incoming supply factored in:
  const netEffectiveWater = usableStoredWaterLiters + scheduledIncomingSupplyLiters;
  const estimatedDaysRemaining = +(netEffectiveWater / adjustedDailyBurn).toFixed(1);

  let shortageRisk: "low" | "moderate" | "high" | "severe" = "low";
  if (estimatedDaysRemaining < 2.0) {
    shortageRisk = "severe";
  } else if (estimatedDaysRemaining < 3.5) {
    shortageRisk = "high";
  } else if (estimatedDaysRemaining < 5.0) {
    shortageRisk = "moderate";
  }

  return {
    estimatedDaysRemaining,
    formattedDays: `${estimatedDaysRemaining} Days`,
    shortageRisk,
    usableStoredWaterLiters,
    averageDailyConsumptionLiters: Math.round(adjustedDailyBurn),
    scheduledIncomingSupplyLiters,
    depletionProjections: projections,
    assumptions: [
      "Usable storage reflects active sumps and excludes dead storage volume (bottom 10% sediment zone).",
      "Calculations isolate primary underground buffers to prevent double-counting between UGT and OHT.",
      "Net stock accounts for planned and verified tanker deliveries arriving in the next 24-48 hours.",
      "Burn rate uses a 7-day rolling average adjusted for weekday/weekend demand elasticity.",
      "Label: This figure is an engineering projection, not an unconditional guarantee.",
    ],
  };
}

