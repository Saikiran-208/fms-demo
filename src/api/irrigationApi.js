// ─────────────────────────────────────────────────────
// irrigationApi.js — Mock dataset for Smart Irrigation Advisory
// Backend team: replace with rule-engine API results
// Rule engine uses: soil moisture + weather forecast + crop rules
// ─────────────────────────────────────────────────────

// Irrigation rules by crop (backend rule engine source)
export const cropIrrigationRules = {
  Paddy:     { minMoisture: 70, maxMoisture: 90, intervalDays: 3,  waterLitersPerAcre: 1200, bestTimeWindow: "6:00 AM – 8:00 AM" },
  Cotton:    { minMoisture: 45, maxMoisture: 75, intervalDays: 5,  waterLitersPerAcre: 800,  bestTimeWindow: "6:00 AM – 9:00 AM" },
  Maize:     { minMoisture: 50, maxMoisture: 80, intervalDays: 4,  waterLitersPerAcre: 900,  bestTimeWindow: "5:30 AM – 7:30 AM" },
  Wheat:     { minMoisture: 40, maxMoisture: 70, intervalDays: 6,  waterLitersPerAcre: 700,  bestTimeWindow: "6:00 AM – 8:00 AM" },
  Soybean:   { minMoisture: 50, maxMoisture: 75, intervalDays: 5,  waterLitersPerAcre: 850,  bestTimeWindow: "6:30 AM – 8:30 AM" },
  Groundnut: { minMoisture: 45, maxMoisture: 70, intervalDays: 5,  waterLitersPerAcre: 750,  bestTimeWindow: "6:00 AM – 8:00 AM" },
};

// Current irrigation advisories per sensor/district
// (backend: POST /api/irrigation/advisory with sensor_id + crop)
export const irrigationAdvisories = [
  {
    id: "IA001",
    sensor_id: "S001",
    farmer: "Ravi Kumar",
    location: "Pochampally, Bhongir",
    district: "Yadadri",
    crop: "Paddy",
    moisture: 42,
    recommendation: "Water Now",
    urgency: "High",
    reason: "Soil moisture is critically low (42%). Paddy requires ≥70% moisture.",
    suggestedTime: "6:00 AM – 8:00 AM",
    waterRequired: "1,200 litres/acre",
    rainExpected: false,
    nextRainIn: null,
  },
  {
    id: "IA002",
    sensor_id: "S002",
    farmer: "Lakshmi Devi",
    location: "Miryalaguda Block",
    district: "Nalgonda",
    crop: "Cotton",
    moisture: 68,
    recommendation: "Wait — Rain Expected",
    urgency: "Low",
    reason: "Rain is forecast in 18 hours. Current moisture (68%) is within acceptable range.",
    suggestedTime: "Wait until after rain",
    waterRequired: "—",
    rainExpected: true,
    nextRainIn: "18 hrs",
  },
  {
    id: "IA003",
    sensor_id: "S003",
    farmer: "Venkat Rao",
    location: "Siddipet Block",
    district: "Siddipet",
    crop: "Maize",
    moisture: 55,
    recommendation: "OK",
    urgency: "None",
    reason: "Moisture levels are sufficient. No irrigation needed today.",
    suggestedTime: "Next irrigation: 2 days",
    waterRequired: "—",
    rainExpected: false,
    nextRainIn: null,
  },
  {
    id: "IA004",
    sensor_id: "S004",
    farmer: "Padma Bai",
    location: "Kamareddy Block",
    district: "Kamareddy",
    crop: "Wheat",
    moisture: 28,
    recommendation: "Water Now",
    urgency: "High",
    reason: "Moisture critically low (28%). Wheat may suffer permanent stress below 30%.",
    suggestedTime: "6:00 AM – 8:00 AM",
    waterRequired: "700 litres/acre",
    rainExpected: false,
    nextRainIn: null,
  },
  {
    id: "IA005",
    sensor_id: "S005",
    farmer: "Suresh Goud",
    location: "Tandur Block",
    district: "Vikarabad",
    crop: "Paddy",
    moisture: 88,
    recommendation: "Skip — Overwatered",
    urgency: "Medium",
    reason: "Moisture is too high (88%). Avoid irrigation to prevent root rot.",
    suggestedTime: "Skip next 48 hours",
    waterRequired: "—",
    rainExpected: false,
    nextRainIn: null,
  },
  {
    id: "IA006",
    sensor_id: "S006",
    farmer: "Anitha Reddy",
    location: "Wanaparthy Block",
    district: "Wanaparthy",
    crop: "Soybean",
    moisture: 60,
    recommendation: "OK",
    urgency: "None",
    reason: "Moisture is within optimal range for Soybean. No action needed.",
    suggestedTime: "Next irrigation: 3 days",
    waterRequired: "—",
    rainExpected: false,
    nextRainIn: null,
  },
];

// Irrigation summary stats
export const irrigationSummary = {
  totalFarms: 240,
  needsWaterNow: 68,
  waitForRain: 42,
  optimal: 112,
  overwatered: 18,
};

// 7-day irrigation demand forecast (litres)
export const irrigationForecastData = [
  { day: "Mon", demand: 12400, rain: 0     },
  { day: "Tue", demand: 11200, rain: 0     },
  { day: "Wed", demand: 3200,  rain: 18000 },
  { day: "Thu", demand: 1800,  rain: 24000 },
  { day: "Fri", demand: 9600,  rain: 0     },
  { day: "Sat", demand: 13100, rain: 0     },
  { day: "Sun", demand: 12800, rain: 0     },
];
