import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const mockWeather = {
  name: "Hyderabad",
  main: { temp: 32, humidity: 65, feels_like: 35 },
  weather: [{ main: "Clouds", description: "partly cloudy", icon: "02d" }],
  wind: { speed: 3.5 },
};

const generateDynamicForecast = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const forecast = [];

  const baseForecastData = [
    { temp: 33, icon: "☀️",  condition: "Sunny",        rain: "0%"  },
    { temp: 31, icon: "⛅",  condition: "Partly Cloudy","rain": "20%" },
    { temp: 28, icon: "🌧️", condition: "Rain",          rain: "80%" },
    { temp: 27, icon: "🌩️", condition: "Heavy Rain",    rain: "90%" },
    { temp: 30, icon: "⛅",  condition: "Partly Cloudy", rain: "30%" },
    { temp: 32, icon: "☀️",  condition: "Sunny",        rain: "5%"  },
    { temp: 34, icon: "☀️",  condition: "Sunny",        rain: "0%"  },
  ];

  for (let i = 0; i < 7; i++) {
    const dayIndex = (today + i) % 7;
    let dayName = days[dayIndex];
    if (i === 0) dayName = "Today";
    
    forecast.push({
      day: dayName,
      ...baseForecastData[i]
    });
  }
  return forecast;
};

const mockForecast = generateDynamicForecast();

// Dynamic advisories generation based on weather
const generateAdvisories = (weatherData) => {
  const generated = [];

  const temp = weatherData.main.temp;
  const windSpeed = weatherData.wind.speed;
  const condition = (weatherData.weather[0].main || weatherData.weather[0].description || "").toLowerCase();

  // 1. Rain / Storm Risk
  if (condition.includes("rain") || condition.includes("storm") || condition.includes("drizzle")) {
    generated.push({
      type: "🌧️",
      title: "Rain Alert",
      level: "High",
      msg: "Rain detected. Avoid irrigation and secure harvested crops.",
      voice: "Rain is currently detected. Please avoid irrigation and secure your crops."
    });
  }

  // 2. Heat Risk
  if (temp > 35) {
    generated.push({
      type: "🌡️",
      title: "Heat Advisory",
      level: "High",
      msg: `High temperature of ${Math.round(temp)}°C. Water crops in early morning only.`,
      voice: `High temperature of ${Math.round(temp)} degrees Celsius. Please water your crops only in the early morning.`
    });
  } else if (temp > 32) {
    generated.push({
      type: "🌡️",
      title: "Warm Weather",
      level: "Medium",
      msg: `Warm temperature of ${Math.round(temp)}°C. Monitor soil moisture closely.`,
      voice: `Warm temperature of ${Math.round(temp)} degrees Celsius. Please monitor soil moisture closely.`
    });
  }

  // 3. Wind Risk (m/s)
  if (windSpeed > 10) { // approx 36 km/h
    generated.push({
      type: "💨",
      title: "Strong Winds",
      level: "High",
      msg: `High wind speed of ${windSpeed} m/s detected. Support tall and weak crops.`,
      voice: `High wind speed of ${Math.round(windSpeed)} meters per second detected. Please support tall crops.`
    });
  } else if (windSpeed > 7) { // approx 25 km/h
    generated.push({
      type: "💨",
      title: "Breezy Conditions",
      level: "Medium",
      msg: "Moderate winds. Secure loose farm equipment.",
      voice: "Moderate winds detected. Secure loose farm equipment."
    });
  }

  // 4. Safe / Good Planting Day (If no high risks)
  if (generated.length === 0 || (generated.length === 1 && generated[0].level === "Medium")) {
     generated.push({
      type: "✅",
      title: "Good Planting Conditions",
      level: "Low",
      msg: "Current weather is favorable for sowing and general farm operations.",
      voice: "The current weather is favorable for sowing seeds and general farm operations."
    });
  }

  return generated;
};

const levelColor = { High: "#fdecea", Medium: "#fff3e0", Low: "#e6f4ea" };
const levelText  = { High: "#c0392b", Medium: "#e67e22", Low: "#27AE60" };

// Voice advisory using browser TTS
function speak(text, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = "en-IN"; u.rate = 0.9; u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export default function WeatherAdvisory() {
  const [weather, setWeather]   = useState(mockWeather);
  const [speaking, setSpeaking] = useState(null);

  useEffect(() => {
    if (!API_KEY) return;
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { q: "Hyderabad", appid: API_KEY, units: "metric" }
    }).then(r => setWeather(r.data)).catch(() => setWeather(mockWeather));
  }, []);

  function handleVoice(i, text) {
    if (speaking === i) { window.speechSynthesis.cancel(); setSpeaking(null); return; }
    speak(text, () => setSpeaking(null));
    setSpeaking(i);
  }

  return (
    <div className="bg-page min-h-screen transition-colors duration-250 font-sans">
      <Navbar title="Weather & Risk Advisory" />
      <div className="pt-6 px-4 md:px-7 pb-10">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon="🌡️" label="Temperature"  value={`${Math.round(weather.main.temp)}°C`}   sub={`Feels like ${Math.round(weather.main.feels_like)}°C`} />
          <StatCard icon="💧" label="Humidity"      value={`${weather.main.humidity}%`}             sub="Relative humidity" color="#2471a3" />
          <StatCard icon="💨" label="Wind Speed"    value={`${weather.wind.speed} m/s`}             sub="Current wind"      color="#e67e22" />
          <StatCard icon="🌤️" label="Condition"     value={weather.weather[0].description}          sub="Hyderabad"         color="#7d3c98" />
        </div>

        <div className="flex gap-5 flex-wrap mb-6">

          {/* 7-day forecast */}
          <div className="bg-card border border-border rounded-xl p-6 flex-[2] min-w-[280px] shadow-sm">
            <h2 className="m-0 mb-5 text-[16px] font-bold text-text-primary">
              7-Day Forecast
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-2">
              {mockForecast.map((f) => (
                <div key={f.day} className="text-center py-3.5 px-1.5 rounded-xl bg-page border border-border transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="text-[12px] font-bold text-text-primary mb-1.5">{f.day}</div>
                  <div className="text-[22px] mb-1.5">{f.icon}</div>
                  <div className="text-[14px] font-extrabold text-text-secondary">{f.temp}°C</div>
                  <div className="text-[11px] text-text-muted mt-1">🌧 {f.rain}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisories with Voice */}
          <div className="bg-card border border-border rounded-xl p-6 flex-1 min-w-[260px] shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
              <h2 className="m-0 text-[16px] font-bold text-text-primary">Risk Advisories</h2>
              <div className="text-[11px] text-text-muted flex items-center gap-1">
                🔊 <span>Click speaker for voice</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {generateAdvisories(weather).map((a, i) => (
                <div 
                  key={i} 
                  className="rounded-[10px] p-3.5 transition-transform duration-200 hover:-translate-y-0.5 shadow-sm"
                  style={{ background: levelColor[a.level], borderLeft: `5px solid ${levelText[a.level]}` }}
                >
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                    <span className="font-bold text-[13px] text-[#0f2d1f] flex-1 leading-snug">
                      {a.type} {a.title}
                    </span>
                    <div className="flex gap-1.5 items-center shrink-0">
                      <span 
                        className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full"
                        style={{ color: levelText[a.level] }}
                      >
                        {a.level}
                      </span>
                      <button 
                        onClick={() => handleVoice(i, a.voice)} 
                        title="Play voice advisory" 
                        className="border-none rounded-md w-[26px] h-[26px] cursor-pointer text-[12px] flex items-center justify-center transition-colors"
                        style={{ background: speaking === i ? levelText[a.level] : "#fff" }}
                      >
                        {speaking === i ? "⏹️" : "🔊"}
                      </button>
                    </div>
                  </div>
                  <p className="m-0 text-[12px] text-[#555] leading-relaxed">{a.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}