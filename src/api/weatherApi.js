// ─────────────────────────────────────────────────────────────────────────────
// weatherApi.js — Real-time OpenWeatherMap + mock fallback
//
// Real API: https://openweathermap.org/api
// Set your API key in .env: VITE_WEATHER_API_KEY=your_key_here
// ─────────────────────────────────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY
             || import.meta.env.VITE_WEATHER_API_KEY
             || "";
const BASE    = "https://api.openweathermap.org/data/2.5";

// ── Live fetch: current weather ───────────────────────────────────────────────
export async function fetchCurrentWeather(city = "Hyderabad") {
  if (!API_KEY) throw new Error("No VITE_WEATHER_API_KEY set in .env");
  const res  = await fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error(`OpenWeather error ${res.status}: ${res.statusText}`);
  const c    = await res.json();
  const cond = c.weather[0].main;
  
  return {
    city:        c.name,
    state:       "Telangana", // OpenWeather current endpoint doesn't always return state
    temp:        Math.round(c.main.temp),
    feelsLike:   Math.round(c.main.feels_like),
    humidity:    c.main.humidity,
    windSpeed:   Math.round(c.wind.speed * 3.6), // convert m/s to km/h
    windDir:     getWindDirection(c.wind.deg),
    uvIndex:     "--", // OpenWeather current free tier lacks UV
    visibility:  c.visibility / 1000, // convert m to km
    pressure:    c.main.pressure,
    dewPoint:    "--",
    condition:   c.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
    icon:        mapConditionEmoji(c.weather[0].id),
    lastUpdated: new Date(c.dt * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    isLive:      true,
  };
}

// ── Helper: Wind Degree to Compass Direction ──
function getWindDirection(degree) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degree / 45) % 8];
}

// ── Live fetch: 5-day forecast (OpenWeather free tier defaults 5-day/3-hour) ──
export async function fetchForecast7Day(city = "Hyderabad") {
  if (!API_KEY) throw new Error("No VITE_WEATHER_API_KEY set in .env");
  const res  = await fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error(`OpenWeather error ${res.status}`);
  const raw  = await res.json();
  
  // Aggregate 3-hour chunks into daily highs/lows
  const daily = {};
  raw.list.forEach(chunk => {
    const dt = new Date(chunk.dt * 1000);
    const dateStr = dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const dayName = dt.toLocaleDateString("en-IN", { weekday: "short" });
    
    if (!daily[dateStr]) {
      daily[dateStr] = {
        day: dayName, date: dateStr, high: -999, low: 999,
        iconIds: [], conditions: [], humiditySum: 0, rainProbSum: 0, count: 0
      };
    }
    
    daily[dateStr].high = Math.max(daily[dateStr].high, chunk.main.temp_max);
    daily[dateStr].low  = Math.min(daily[dateStr].low, chunk.main.temp_min);
    daily[dateStr].iconIds.push(chunk.weather[0].id);
    daily[dateStr].conditions.push(chunk.weather[0].main);
    daily[dateStr].humiditySum += chunk.main.humidity;
    daily[dateStr].rainProbSum += chunk.pop;
    daily[dateStr].count += 1;
  });

  return Object.values(daily).map(d => ({
    day:       d.day,
    date:      d.date,
    high:      Math.round(d.high),
    low:       Math.round(d.low),
    icon:      mapConditionEmoji(d.iconIds[Math.floor(d.iconIds.length / 2)]), // pick midpoint condition
    condition: d.conditions[Math.floor(d.conditions.length / 2)],
    rain:      `${Math.round((d.rainProbSum / d.count) * 100)}%`,
    humidity:  Math.round(d.humiditySum / d.count),
  })).slice(0, 7); // Return max 7 days
}

// ── Emoji mapper (OpenWeather condition IDs) ─────────────────────────────────
function mapConditionEmoji(code) {
  if (code === 800) return "☀️"; // Clear
  if (code > 800) return "⛅";   // Clouds
  if (code >= 700) return "🌫️";  // Atmosphere (Fog/Mist/Dust)
  if (code >= 600) return "🌨️";  // Snow
  if (code >= 300) return "🌧️";  // Drizzle/Rain
  if (code >= 200) return "⛈️";  // Thunderstorm
  return "⛅";
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — used as fallback when API key is not set or request fails
// Backend team: keep shapes in sync with fetchCurrentWeather return object
// ─────────────────────────────────────────────────────────────────────────────

export const currentWeather = {
  city: "Hyderabad", state: "Telangana",
  temp: 32, feelsLike: 35, humidity: 65, windSpeed: 13,
  windDir: "SW", uvIndex: 7, visibility: 8.4, pressure: 1012,
  dewPoint: 24, condition: "Partly Cloudy", icon: "⛅",
  lastUpdated: "08:00 AM", isLive: false,
};

export const forecast7Day = [
  { day: "Mon", date: "Mar 8",  high: 33, low: 24, icon: "☀️",  condition: "Sunny",       rain: "0%",  humidity: 58 },
  { day: "Tue", date: "Mar 9",  high: 31, low: 23, icon: "⛅",  condition: "Partly Cloudy", rain: "20%", humidity: 63 },
  { day: "Wed", date: "Mar 10", high: 28, low: 21, icon: "🌧️", condition: "Rain",           rain: "80%", humidity: 84 },
  { day: "Thu", date: "Mar 11", high: 27, low: 20, icon: "⛈️", condition: "Heavy Rain",     rain: "90%", humidity: 91 },
  { day: "Fri", date: "Mar 12", high: 30, low: 22, icon: "⛅",  condition: "Partly Cloudy", rain: "30%", humidity: 70 },
  { day: "Sat", date: "Mar 13", high: 32, low: 23, icon: "☀️",  condition: "Sunny",         rain: "5%",  humidity: 55 },
  { day: "Sun", date: "Mar 14", high: 34, low: 25, icon: "☀️",  condition: "Hot & Sunny",   rain: "0%",  humidity: 50 },
];

export const weatherAlerts = [
  { id:"WA001", type:"🌧️", title:"Heavy Rain Alert",    level:"High",   validFrom:"Mar 10", validTo:"Mar 11",
    msg:"Expected heavy rain Wed–Thu. Avoid irrigation and secure crops.",
    voice:"Heavy rain is expected on Wednesday and Thursday. Please avoid irrigation and secure your crops." },
  { id:"WA002", type:"🌡️", title:"Heat Advisory",       level:"Medium", validFrom:"Mar 8",  validTo:"Mar 9",
    msg:"Temperatures above 33°C Mon–Tue. Water crops before 8 AM only.",
    voice:"Temperature above 33 degrees Celsius expected Monday and Tuesday. Water crops only before 8 AM." },
  { id:"WA003", type:"💨", title:"Strong Wind Warning",  level:"Medium", validFrom:"Mar 11", validTo:"Mar 11",
    msg:"Wind up to 45 km/h on Thursday. Support tall crops.",
    voice:"Strong winds up to 45 kilometres per hour are expected on Thursday." },
  { id:"WA004", type:"✅", title:"Ideal Planting Window",level:"Low",    validFrom:"Mar 12", validTo:"Mar 14",
    msg:"Friday–Sunday ideal for sowing and fertilizer application.",
    voice:"Friday to Sunday are ideal days for sowing seeds and applying fertilizer." },
];

export const districtWeather = [
  { district: "Hyderabad",  temp: 32, rain: "0%",  condition: "Sunny"         },
  { district: "Warangal",   temp: 31, rain: "15%", condition: "Partly Cloudy" },
  { district: "Karimnagar", temp: 30, rain: "20%", condition: "Partly Cloudy" },
  { district: "Nizamabad",  temp: 29, rain: "25%", condition: "Cloudy"        },
  { district: "Khammam",    temp: 30, rain: "40%", condition: "Rainy"         },
  { district: "Nalgonda",   temp: 31, rain: "10%", condition: "Sunny"         },
  { district: "Adilabad",   temp: 28, rain: "35%", condition: "Cloudy"        },
  { district: "Rangareddy", temp: 33, rain: "0%",  condition: "Hot & Sunny"   },
];

export const agroAdvisories = [
  { crop: "Paddy",   advisory: "Postpone top-dressing until after rains (Wed–Thu)", urgency: "High"   },
  { crop: "Cotton",  advisory: "Spray pesticides today before rain forecast",        urgency: "Medium" },
  { crop: "Maize",   advisory: "Clear drainage channels before Wednesday rains",     urgency: "Medium" },
  { crop: "Wheat",   advisory: "Soil moisture adequate — no irrigation needed",      urgency: "Low"    },
  { crop: "Soybean", advisory: "Good conditions for germination Fri–Sun",            urgency: "Low"    },
];