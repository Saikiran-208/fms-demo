// ─────────────────────────────────────────────────────
// harvestAiApi.js — Mock dataset for Harvest Readiness AI
// Backend team: replace mockScanImage() with real inference API call
// Real endpoint: POST /api/harvest/scan  { image: base64, farmerId, crop }
// ─────────────────────────────────────────────────────

// Possible AI results
export const HARVEST_RESULTS = {
  READY:     "Ready",
  NOT_READY: "Not Ready",
  PENDING:   "Pending",
};

// Mock AI scan response (simulates ML inference delay)
// Backend: POST /api/harvest/scan
export async function mockScanImage(file, crop) {
  return new Promise(resolve =>
    setTimeout(() => {
      // Simulate varied results based on file name / deterministic mock
      const hash = file.name.length % 3;
      const results = [
        { result: "Ready",     confidence: 92, daysRemaining: 0,  advice: "Your crop is ready for harvest. Proceed within 3–5 days for optimal yield." },
        { result: "Not Ready", confidence: 78, daysRemaining: 12, advice: "Crop needs approximately 12 more days. Ensure adequate moisture and avoid fertilizer." },
        { result: "Not Ready", confidence: 85, daysRemaining: 7,  advice: "Almost ready. Maintain current irrigation schedule. Expected harvest in 7 days." },
      ];
      resolve({
        ...results[hash],
        crop,
        scanId: `SCN${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    }, 2200) // 2.2 sec simulated inference time
  );
}

// Crop-specific visual cues shown during upload
export const cropScanTips = {
  Paddy:     ["Check panicle colour — should be golden yellow", "Look for drooping panicles", "Grains should be hard when pressed"],
  Cotton:    ["Bolls should be fully open", "Fibers should be white and fluffy", "Avoid harvesting when damp"],
  Maize:     ["Silk should be brown and dry", "Husk should feel tight and green", "Kernels should be plump and firm"],
  Wheat:     ["Straw should be golden yellow", "Grains should be hard", "Moisture content should be below 14%"],
  Soybean:   ["Pods should be fully yellow-brown", "Leaves should have dropped", "Shake plants — seeds should rattle"],
  Groundnut: ["Yellowing of leaves indicates maturity", "Check pod mesh pattern", "Inner pod walls should be dark"],
};

// Scan history (shown in history tab — backend: GET /api/harvest/history?farmerId=x)
export const scanHistory = [
  { id: "SCN001", farmer: "Ravi Kumar",    crop: "Paddy",   result: "Ready",     confidence: 92, daysRemaining: 0,  date: "2026-03-05", imageMime: "image/jpeg" },
  { id: "SCN002", farmer: "Lakshmi Devi",  crop: "Cotton",  result: "Not Ready", confidence: 78, daysRemaining: 12, date: "2026-03-05", imageMime: "image/jpeg" },
  { id: "SCN003", farmer: "Venkat Rao",    crop: "Maize",   result: "Ready",     confidence: 88, daysRemaining: 0,  date: "2026-03-04", imageMime: "image/jpeg" },
  { id: "SCN004", farmer: "Padma Bai",     crop: "Wheat",   result: "Not Ready", confidence: 81, daysRemaining: 7,  date: "2026-03-04", imageMime: "image/jpeg" },
  { id: "SCN005", farmer: "Suresh Goud",   crop: "Paddy",   result: "Ready",     confidence: 95, daysRemaining: 0,  date: "2026-03-03", imageMime: "image/jpeg" },
  { id: "SCN006", farmer: "Anitha Reddy",  crop: "Soybean", result: "Not Ready", confidence: 74, daysRemaining: 20, date: "2026-03-03", imageMime: "image/jpeg" },
  { id: "SCN007", farmer: "Mahesh Naik",   crop: "Paddy",   result: "Ready",     confidence: 90, daysRemaining: 0,  date: "2026-03-02", imageMime: "image/jpeg" },
  { id: "SCN008", farmer: "Saraswati",     crop: "Cotton",  result: "Not Ready", confidence: 69, daysRemaining: 15, date: "2026-03-02", imageMime: "image/jpeg" },
];
