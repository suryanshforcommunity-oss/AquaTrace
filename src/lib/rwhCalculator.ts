export interface RWHCalculationInput {
  roofAreaSqM: number;
  rainfallMm: number;
  runoffCoefficient: number; // typically 0.80 - 0.95
  collectionEfficiency: number; // typically 0.80 - 0.95
  actualCollectedLiters?: number;
}

export interface RWHCalculationResult {
  potentialVolumeLiters: number;
  potentialVolumeKl: number;
  actualCollectedLiters: number;
  effectivenessPercent: number;
  perCapitaDaysWaterEquivalence: number; // e.g. at 135 L/person/day
  assumptions: string[];
}

export function calculateRWHPotential(input: RWHCalculationInput): RWHCalculationResult {
  const {
    roofAreaSqM,
    rainfallMm,
    runoffCoefficient,
    collectionEfficiency,
    actualCollectedLiters = 0,
  } = input;

  // Potential Collection (Litres) = Area (m2) * Rainfall (mm) * Runoff Coefficient * Collection Efficiency
  // Note: 1 mm over 1 m2 = 1 Litre
  const potentialVolumeLiters = Math.round(
    roofAreaSqM * rainfallMm * runoffCoefficient * collectionEfficiency
  );

  const potentialVolumeKl = +(potentialVolumeLiters / 1000).toFixed(2);

  const effectivenessPercent =
    potentialVolumeLiters > 0 && actualCollectedLiters > 0
      ? +((actualCollectedLiters / potentialVolumeLiters) * 100).toFixed(1)
      : 0;

  // Standard Indian urban consumption benchmark is 135 L/person/day (BIS 1172)
  const perCapitaDaysWaterEquivalence = Math.round(potentialVolumeLiters / 135);

  return {
    potentialVolumeLiters,
    potentialVolumeKl,
    actualCollectedLiters,
    effectivenessPercent,
    perCapitaDaysWaterEquivalence,
    assumptions: [
      "1 mm of rainfall deposited over 1 m² of roof catchment equals 1.0 Litre of water.",
      `Runoff Coefficient (${runoffCoefficient}): Accounts for roof surface absorption and evaporation losses.`,
      `Collection Efficiency (${collectionEfficiency}): Accounts for first-flush silt diverter diversion and filter backwash losses.`,
      "Calculated volumes represent potential estimates based on precipitation measurements.",
    ],
  };
}

