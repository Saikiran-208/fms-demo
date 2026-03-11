// ─────────────────────────────────────────────────────
// soilApi.js — Extended mock dataset (16 sensors, all districts)
// Backend: GET /api/soil/sensors, GET /api/soil/trend?sensor_id=x
// ─────────────────────────────────────────────────────

export const soilSensorData = [
  { sensor_id: "S001", location: "Hyderabad Block 1",    district: "Rangareddy",  farmer: "Suresh Goud",    crop: "Paddy",     moisture: 62, status: "OK",      timestamp: "2026-03-08T08:30:00", battery: 92 },
  { sensor_id: "S002", location: "Warangal Block 3",     district: "Warangal",    farmer: "Anitha Reddy",   crop: "Cotton",    moisture: 28, status: "Low",     timestamp: "2026-03-08T08:32:00", battery: 78 },
  { sensor_id: "S003", location: "Karimnagar Block 2",   district: "Karimnagar",  farmer: "Mahesh Naik",    crop: "Paddy",     moisture: 85, status: "High",    timestamp: "2026-03-08T08:35:00", battery: 65 },
  { sensor_id: "S004", location: "Nizamabad Block 1",    district: "Nizamabad",   farmer: "Saraswati",      crop: "Maize",     moisture: 55, status: "OK",      timestamp: "2026-03-08T08:40:00", battery: 88 },
  { sensor_id: "S005", location: "Adilabad Block 4",     district: "Adilabad",    farmer: "Ravi Kumar",     crop: "Soybean",   moisture: 21, status: "Low",     timestamp: "2026-03-08T08:42:00", battery: 34 },
  { sensor_id: "S006", location: "Khammam Block 2",      district: "Khammam",     farmer: "Lakshmi Devi",   crop: "Paddy",     moisture: 70, status: "OK",      timestamp: "2026-03-08T08:45:00", battery: 95 },
  { sensor_id: "S007", location: "Nalgonda Block 1",     district: "Nalgonda",    farmer: "Venkat Rao",     crop: "Cotton",    moisture: 91, status: "High",    timestamp: "2026-03-08T08:47:00", battery: 72 },
  { sensor_id: "S008", location: "Medak Block 3",        district: "Medak",       farmer: "Padma Bai",      crop: "Wheat",     moisture: 48, status: "OK",      timestamp: "2026-03-08T08:50:00", battery: 56 },
  { sensor_id: "S009", location: "Sangareddy Block 2",   district: "Sangareddy",  farmer: "Suresh Goud",    crop: "Paddy",     moisture: 33, status: "Low",     timestamp: "2026-03-08T08:52:00", battery: 81 },
  { sensor_id: "S010", location: "Mahbubnagar Block 1",  district: "Mahbubnagar", farmer: "Anitha Reddy",   crop: "Groundnut", moisture: 67, status: "OK",      timestamp: "2026-03-08T08:55:00", battery: 90 },
  { sensor_id: "S011", location: "Siddipet Block 2",     district: "Siddipet",    farmer: "Rajesh Verma",   crop: "Maize",     moisture: 18, status: "Low",     timestamp: "2026-03-08T09:00:00", battery: 23 },
  { sensor_id: "S012", location: "Suryapet Block 3",     district: "Suryapet",    farmer: "Geetha Bai",     crop: "Paddy",     moisture: 77, status: "OK",      timestamp: "2026-03-08T09:02:00", battery: 67 },
  { sensor_id: "S013", location: "Kamareddy Block 1",    district: "Kamareddy",   farmer: "Padma Bai",      crop: "Cotton",    moisture: 44, status: "OK",      timestamp: "2026-03-08T09:05:00", battery: 74 },
  { sensor_id: "S014", location: "Vikarabad Block 2",    district: "Vikarabad",   farmer: "Naresh Kumar",   crop: "Soybean",   moisture: 12, status: "Low",     timestamp: "2026-03-08T09:07:00", battery: 15 },
  { sensor_id: "S015", location: "Yadadri Block 1",      district: "Yadadri",     farmer: "Ravi Kumar",     crop: "Paddy",     moisture: 82, status: "High",    timestamp: "2026-03-08T09:10:00", battery: 88 },
  { sensor_id: "S016", location: "Jagityal Block 3",     district: "Jagityal",    farmer: "Meena Kumari",   crop: "Wheat",     moisture: 59, status: "OK",      timestamp: "2026-03-08T09:12:00", battery: 62 },
];

export const moistureTrendData = [
  { day: "Mon", S001: 55, S002: 32, S003: 80, S004: 50, S005: 25 },
  { day: "Tue", S001: 58, S002: 29, S003: 82, S004: 52, S005: 23 },
  { day: "Wed", S001: 60, S002: 26, S003: 84, S004: 54, S005: 20 },
  { day: "Thu", S001: 59, S002: 25, S003: 85, S004: 53, S005: 18 },
  { day: "Fri", S001: 61, S002: 27, S003: 83, S004: 55, S005: 21 },
  { day: "Sat", S001: 63, S002: 28, S003: 86, S004: 56, S005: 22 },
  { day: "Sun", S001: 62, S002: 28, S003: 85, S004: 55, S005: 21 },
];

// Per-sensor historical data (last 7 days) — for detail view
export const sensorHistory = {
  S001: [62, 60, 63, 61, 59, 64, 62],
  S002: [28, 31, 27, 25, 26, 29, 28],
  S003: [85, 83, 87, 89, 84, 86, 85],
  S004: [55, 53, 57, 54, 52, 56, 55],
  S005: [21, 23, 19, 17, 20, 22, 21],
};

export const soilSummary = {
  total: 16, ok: 9, low: 5, high: 3, offline: 1,
  avgMoisture: 54, criticalCount: 2,
};

// Irrigation suggestion based on moisture status
// eslint-disable-next-line no-unused-vars
export function getIrrigationSuggestion(moisture, crop) {
  if (moisture < 30) return { action: "Water Now", urgency: "High",   icon: "💧" };
  if (moisture > 80) return { action: "Skip",       urgency: "Medium", icon: "⚠️" };
  return                   { action: "OK",           urgency: "None",   icon: "✅" };
}