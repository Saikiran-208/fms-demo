export const getStatusColor = (status) => {
  if (status === "OK")     return { bg: "#e6f4ea", text: "#27AE60", border: "#27AE60" };
  if (status === "Low")    return { bg: "#fff3e0", text: "#F4A300", border: "#F4A300" };
  if (status === "High")   return { bg: "#fdecea", text: "#E74C3C", border: "#E74C3C" };
  return                          { bg: "#f0f0f0", text: "#999999", border: "#999999" };
};

export const getMoistureLabel = (moisture) => {
  if (moisture < 30) return "Irrigate Now 🚨";
  if (moisture > 80) return "Overwatered ⚠️";
  return "Moisture OK ✅";
};

export const getTrendIcon = (trend) => {
  if (trend === "up")     return { icon: "▲", color: "#27AE60" };
  if (trend === "down")   return { icon: "▼", color: "#E74C3C" };
  return                         { icon: "→", color: "#999999" };
};

export const getHarvestColor = (result) => {
  if (result === "Ready")     return { bg: "#e6f4ea", text: "#27AE60" };
  if (result === "Not Ready") return { bg: "#fdecea", text: "#E74C3C" };
  return                             { bg: "#fff3e0", text: "#F4A300" };
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};