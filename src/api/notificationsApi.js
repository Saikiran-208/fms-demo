// ─────────────────────────────────────────────────────
// notificationsApi.js — Mock dataset for Push Notifications
// Backend team: replace with Firebase FCM integration
// Real: POST /api/notifications/send { farmerId, type, message }
// ─────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = {
  WEATHER:   "weather",
  IRRIGATION:"irrigation",
  HARVEST:   "harvest",
  MARKET:    "market",
  SYSTEM:    "system",
};

// All notifications log (backend: GET /api/notifications?userId=x)
export const notificationsLog = [
  { id: 1,  type: "weather",    title: "Heavy Rain Alert",           body: "Expected heavy rain in Khammam on Wed–Thu. Secure crops.",         time: "10 min ago", read: false, level: "High"   },
  { id: 2,  type: "irrigation", title: "Irrigation Reminder",        body: "Ravi Kumar's Paddy field needs watering. Moisture at 42%.",        time: "25 min ago", read: false, level: "High"   },
  { id: 3,  type: "harvest",    title: "Harvest Ready!",             body: "Venkat Rao's Maize is ready to harvest. Confidence: 88%.",         time: "1 hr ago",   read: false, level: "Low"    },
  { id: 4,  type: "market",     title: "Paddy Price Surge",          body: "Paddy price up ₹120/quintal in Karimnagar mandi.",                 time: "2 hr ago",   read: true,  level: "Low"    },
  { id: 5,  type: "weather",    title: "Heat Advisory",              body: "Temp above 35°C expected. Water Paddy crops early morning.",       time: "3 hr ago",   read: true,  level: "Medium" },
  { id: 6,  type: "system",     title: "Sensor Offline",             body: "Sensor S008 in Adilabad Block 4 went offline.",                   time: "4 hr ago",   read: true,  level: "High"   },
  { id: 7,  type: "irrigation", title: "Skip Irrigation",            body: "Suresh Goud's field is overwatered (88%). Skip next 48 hrs.",     time: "5 hr ago",   read: true,  level: "Medium" },
  { id: 8,  type: "market",     title: "Cotton Prices Stable",       body: "Cotton prices stable at ₹6,150/quintal in Nalgonda mandi.",       time: "6 hr ago",   read: true,  level: "Low"    },
  { id: 9,  type: "harvest",    title: "Scan Completed",             body: "Padma Bai's Wheat scan complete: Not Ready. 7 days remaining.",   time: "8 hr ago",   read: true,  level: "Low"    },
  { id: 10, type: "system",     title: "New Farmer Registered",      body: "28 new farmers registered this week across Telangana.",           time: "1 day ago",  read: true,  level: "Low"    },
];

// Send mock push notification (backend: POST /api/notifications/send)
// eslint-disable-next-line no-unused-vars
export async function sendMockNotification(type, title, body) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true, notifId: `NOTIF_${Date.now()}` }), 300)
  );
}

export const notifTypeIcon = {
  weather:    "🌧️",
  irrigation: "💧",
  harvest:    "🌾",
  market:     "📈",
  system:     "⚙️",
};

export const notifTypeBg = {
  weather:    "#e8f4fd",
  irrigation: "#e6f4ea",
  harvest:    "#fff3e0",
  market:     "#f3e5f5",
  system:     "#fdecea",
};

export const notifTypeColor = {
  weather:    "#2471a3",
  irrigation: "#27AE60",
  harvest:    "#e67e22",
  market:     "#7d3c98",
  system:     "#c0392b",
};
