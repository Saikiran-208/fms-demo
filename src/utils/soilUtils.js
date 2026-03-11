// src/utils/soilUtils.js

export const getStatusColor = (status) => {
  if (status === "OK")   return { bg: "#e6f4ea", text: "#27AE60" };
  if (status === "Low")  return { bg: "#fff3e0", text: "#F4A300" };
  if (status === "High") return { bg: "#fdecea", text: "#E74C3C" };
  return                        { bg: "#f0f0f0", text: "#999999" }; // offline
};

export const getMoistureLabel = (moisture) => {
  if (moisture < 30)  return "Irrigate Now 🚨";
  if (moisture > 80)  return "Overwatered ⚠️";
  return                     "Moisture OK ✅";
};