import { Society } from "@/types";

export interface NagpurTrainingRecord {
  id: string;
  date: string;
  societyId: string;
  societyName: string;
  season: "monsoon" | "post_monsoon" | "winter" | "pre_summer" | "peak_summer";
  temperatureCelsius: number;
  humidityPercent: number;
  isWeekend: boolean;
  occupancyPercent: number;
  desertCoolerActiveUnits: number;
  actualDemandLiters: number;
  nmcMunicipalSupplyLiters: number;
  borewellYieldLiters: number;
  tankerSupplyLiters: number;
  rwhHarvestedLiters: number;
  distributionLossLiters: number;
}

export type NagpurWaterTrainingRecord = NagpurTrainingRecord;

export interface NagpurTownshipProfile extends Society {
  zone: string;
  pincode: string;
  sourceBreakdown: {
    nmcPenchPipelinePercent: number;
    borewellBasaltPercent: number;
    tankerPercent: number;
    rwhPercent: number;
  };
  coolerPenetrationPercent: number;
  typicalSummerTempPeak: number;
  historicalBaseDemandLiters: number;
}

// Premier Real-World Townships & Housing Societies of Nagpur
export const NAGPUR_TOWNSHIPS: NagpurTownshipProfile[] = [
  {
    id: "soc_nagpur_bloomdale",
    name: "Mahindra Bloomdale Township RWA",
    location: "Sector 20, MIHAN SEZ, Nagpur, Maharashtra",
    zone: "South Nagpur (MIHAN Corridor)",
    pincode: "441108",
    totalApartments: 850,
    totalResidents: 3200,
    dailyWaterQuotaLiters: 432000,
    usableStorageCapacityLiters: 650000,
    borewellCount: 5,
    rwhUnitCount: 8,
    coordinates: { lat: 21.0425, lng: 79.0321 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 55,
      borewellBasaltPercent: 25,
      tankerPercent: 12,
      rwhPercent: 8,
    },
    coolerPenetrationPercent: 45,
    typicalSummerTempPeak: 45.2,
    historicalBaseDemandLiters: 420000,
  },
  {
    id: "soc_nagpur_godrej_anandam",
    name: "Godrej Anandam Luxury Residential Complex",
    location: "Model Mill Compound, Ganeshpeth, Nagpur, Maharashtra",
    zone: "Central Nagpur",
    pincode: "440018",
    totalApartments: 680,
    totalResidents: 2450,
    dailyWaterQuotaLiters: 330000,
    usableStorageCapacityLiters: 480000,
    borewellCount: 3,
    rwhUnitCount: 6,
    coordinates: { lat: 21.1448, lng: 79.0963 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 68,
      borewellBasaltPercent: 18,
      tankerPercent: 8,
      rwhPercent: 6,
    },
    coolerPenetrationPercent: 30,
    typicalSummerTempPeak: 44.8,
    historicalBaseDemandLiters: 325000,
  },
  {
    id: "soc_nagpur_vrindavan",
    name: "Vrindavan City Integrated Mega Township",
    location: "National Highway 44, Jamtha, Nagpur, Maharashtra",
    zone: "Outer South Nagpur (Jamtha Growth Hub)",
    pincode: "441122",
    totalApartments: 1400,
    totalResidents: 5600,
    dailyWaterQuotaLiters: 756000,
    usableStorageCapacityLiters: 1100000,
    borewellCount: 8,
    rwhUnitCount: 12,
    coordinates: { lat: 21.0028, lng: 79.0287 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 42,
      borewellBasaltPercent: 35,
      tankerPercent: 16,
      rwhPercent: 7,
    },
    coolerPenetrationPercent: 60,
    typicalSummerTempPeak: 45.8,
    historicalBaseDemandLiters: 740000,
  },
  {
    id: "soc_nagpur_shiv_kailasa",
    name: "Shiv Kailasa Resident Welfare Association",
    location: "Beltarodi Road, Manish Nagar, Nagpur, Maharashtra",
    zone: "South-West Nagpur (Besa-Manish Nagar)",
    pincode: "440037",
    totalApartments: 480,
    totalResidents: 1820,
    dailyWaterQuotaLiters: 245000,
    usableStorageCapacityLiters: 360000,
    borewellCount: 4,
    rwhUnitCount: 4,
    coordinates: { lat: 21.0872, lng: 79.0765 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 50,
      borewellBasaltPercent: 30,
      tankerPercent: 14,
      rwhPercent: 6,
    },
    coolerPenetrationPercent: 50,
    typicalSummerTempPeak: 44.9,
    historicalBaseDemandLiters: 240000,
  },
  {
    id: "soc_nagpur_sandesh_city",
    name: "Sandesh City Township RWA",
    location: "Opp. VCA Stadium, Wardha Road, Jamtha, Nagpur, Maharashtra",
    zone: "South Nagpur (Wardha Road Expressway)",
    pincode: "441108",
    totalApartments: 920,
    totalResidents: 3450,
    dailyWaterQuotaLiters: 465000,
    usableStorageCapacityLiters: 700000,
    borewellCount: 6,
    rwhUnitCount: 8,
    coordinates: { lat: 20.9984, lng: 79.0255 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 48,
      borewellBasaltPercent: 32,
      tankerPercent: 14,
      rwhPercent: 6,
    },
    coolerPenetrationPercent: 55,
    typicalSummerTempPeak: 45.5,
    historicalBaseDemandLiters: 450000,
  },
  {
    id: "soc_nagpur_empress_city",
    name: "Empress City Premium Residential Towers",
    location: "Near Gandhi Sagar Lake, Cotton Market, Nagpur, Maharashtra",
    zone: "Central East Nagpur",
    pincode: "440018",
    totalApartments: 550,
    totalResidents: 2100,
    dailyWaterQuotaLiters: 285000,
    usableStorageCapacityLiters: 400000,
    borewellCount: 3,
    rwhUnitCount: 5,
    coordinates: { lat: 21.1465, lng: 79.0912 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 72,
      borewellBasaltPercent: 15,
      tankerPercent: 8,
      rwhPercent: 5,
    },
    coolerPenetrationPercent: 35,
    typicalSummerTempPeak: 44.6,
    historicalBaseDemandLiters: 280000,
  },
  {
    id: "soc_greenwood_01",
    name: "Greenwood Enclave RWA",
    location: "Koradi Road, Mankapur Corridor, Nagpur, Maharashtra",
    zone: "North Nagpur (Koradi Thermal Corridor)",
    pincode: "440030",
    totalApartments: 420,
    totalResidents: 1650,
    dailyWaterQuotaLiters: 220000,
    usableStorageCapacityLiters: 320000,
    borewellCount: 3,
    rwhUnitCount: 4,
    coordinates: { lat: 21.1982, lng: 79.0834 },
    sourceBreakdown: {
      nmcPenchPipelinePercent: 58,
      borewellBasaltPercent: 24,
      tankerPercent: 12,
      rwhPercent: 6,
    },
    coolerPenetrationPercent: 48,
    typicalSummerTempPeak: 45.0,
    historicalBaseDemandLiters: 215000,
  },
];

/**
 * Generate 180 days of realistic chronological hydrological telemetry for a Nagpur township.
 * Incorporates Vidarbha's signature meteorological conditions:
 * - Monsoon (June - Sept): Heavy showers, RWH active, cooler off, temp 28-32°C
 * - Post-Monsoon (Oct - Nov): Clear skies, moderate temp 27-31°C, groundwater recharged
 * - Winter (Dec - Jan): Mild weather 18-26°C, lower demand
 * - Pre-Summer (Feb - Mar): Rising heat 32-38°C, desert coolers turned on, borewell drawdown begins
 * - Peak Summer Heatwave (Apr - May): Extreme temperatures 42-46°C, intense desert cooler refills, tanker reliance
 */
export function generateNagpurTrainingDataset(townshipId: string): NagpurWaterTrainingRecord[] {
  const township = NAGPUR_TOWNSHIPS.find((t) => t.id === townshipId) || NAGPUR_TOWNSHIPS[0];
  const records: NagpurWaterTrainingRecord[] = [];

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 180);

  const baseResidents = township.totalResidents;
  const baseDemandPerCapita = 135; // LPCD (Bureau of Indian Standards / CPHEEO standard)
  const baseCoolers = Math.round(township.totalApartments * (township.coolerPenetrationPercent / 100));

  for (let i = 0; i < 180; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + i);

    const isWeekend = curDate.getDay() === 0 || curDate.getDay() === 6;
    const dateStr = curDate.toISOString().split("T")[0];

    // Determine seasonal phase across the 180-day training trajectory
    let season: NagpurWaterTrainingRecord["season"] = "post_monsoon";
    let tempCelsius = 29;
    let humidity = 60;
    let coolerUsageFactor = 0.1;
    let rwhHarvested = 0;

    if (i < 40) {
      // Monsoon tail
      season = "monsoon";
      tempCelsius = 28 + (Math.sin(i * 0.2) * 2.5);
      humidity = 78;
      coolerUsageFactor = 0.05;
      rwhHarvested = Math.round(15000 + Math.random() * 25000);
    } else if (i < 80) {
      // Post-monsoon
      season = "post_monsoon";
      tempCelsius = 27 + (Math.sin(i * 0.15) * 2);
      humidity = 55;
      coolerUsageFactor = 0.15;
    } else if (i < 120) {
      // Vidarbha Winter
      season = "winter";
      tempCelsius = 22 + (Math.sin(i * 0.1) * 3);
      humidity = 45;
      coolerUsageFactor = 0.0;
    } else if (i < 155) {
      // Pre-Summer transition
      season = "pre_summer";
      tempCelsius = 35 + (Math.sin(i * 0.15) * 3);
      humidity = 30;
      coolerUsageFactor = 0.75;
    } else {
      // Peak Nagpur Heatwave (Loo winds, 42-46°C)
      season = "peak_summer";
      tempCelsius = 42.5 + ((i - 155) * 0.12) + (Math.sin(i) * 1.8);
      humidity = 22;
      coolerUsageFactor = 0.95;
    }

    // Active desert coolers: In Nagpur, a desert cooler is typically refilled twice daily (~55-70 Litres/cooler/day)
    const activeCoolers = Math.round(baseCoolers * coolerUsageFactor * (isWeekend ? 1.05 : 0.98));
    const coolerWaterLiters = activeCoolers * 60;

    // Occupancy surge: Weekends have +10-15% occupancy due to WFH/family stay
    const occupancyPercent = isWeekend ? 94 + (i % 5) : 84 + (i % 6);
    const occupantCount = Math.round(baseResidents * (occupancyPercent / 100));

    // Base domestic water demand
    const domesticLiters = occupantCount * baseDemandPerCapita;

    // Heat sensitivity coefficient: +2.1% demand per degree C above 30°C for extra showers, plant watering, domestic use
    const heatSensitivityMultiplier = tempCelsius > 30 ? 1 + (tempCelsius - 30) * 0.021 : 1.0;

    // Distribution pipe loss: ~4% to 5.5% in residential grid
    const lossPercent = 4.2 + (Math.sin(i * 0.3) * 0.8);
    
    // Total physical metered demand
    const totalActualDemand = Math.round(
      (domesticLiters * heatSensitivityMultiplier + coolerWaterLiters) * (1 + lossPercent / 100)
    );

    const distributionLossLiters = Math.round(totalActualDemand * (lossPercent / 100));

    // Water source allocation: NMC Pench pipeline, Borewell Basalt extraction, Tankers, RWH
    const nmcAllocated = Math.round(township.dailyWaterQuotaLiters * 0.65 * (season === "peak_summer" ? 0.85 : 1.0));
    const borewellAvailable = Math.round(
      (township.dailyWaterQuotaLiters * 0.28) * (season === "peak_summer" ? 0.65 : 1.0)
    );

    const shortfall = Math.max(0, totalActualDemand - (nmcAllocated + borewellAvailable + rwhHarvested));
    const tankerSupplyLiters = shortfall > 0 ? Math.ceil(shortfall / 6000) * 6000 : 0;

    records.push({
      id: `ngp_rec_${townshipId}_${i + 1}`,
      date: dateStr,
      societyId: township.id,
      societyName: township.name,
      season,
      temperatureCelsius: +tempCelsius.toFixed(1),
      humidityPercent: Math.round(humidity),
      isWeekend,
      occupancyPercent,
      desertCoolerActiveUnits: activeCoolers,
      actualDemandLiters: totalActualDemand,
      nmcMunicipalSupplyLiters: nmcAllocated,
      borewellYieldLiters: borewellAvailable,
      tankerSupplyLiters,
      rwhHarvestedLiters: rwhHarvested,
      distributionLossLiters,
    });
  }

  return records;
}
