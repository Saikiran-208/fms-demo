// src/api/marketApi.js

export const marketPriceData = [
  { id: 1, crop: "Paddy",   mandi: "Hyderabad",  district: "Rangareddy", price: 2100, prevPrice: 1980, unit: "Per Quintal", trend: "up" },
  { id: 2, crop: "Paddy",   mandi: "Warangal",   district: "Warangal",   price: 2050, prevPrice: 2100, unit: "Per Quintal", trend: "down" },
  { id: 3, crop: "Paddy",   mandi: "Karimnagar", district: "Karimnagar", price: 2200, prevPrice: 2200, unit: "Per Quintal", trend: "stable" },
  { id: 4, crop: "Maize",   mandi: "Nizamabad",  district: "Nizamabad",  price: 1850, prevPrice: 1700, unit: "Per Quintal", trend: "up" },
  { id: 5, crop: "Maize",   mandi: "Adilabad",   district: "Adilabad",   price: 1780, prevPrice: 1800, unit: "Per Quintal", trend: "down" },
  { id: 6, crop: "Cotton",  mandi: "Khammam",    district: "Khammam",    price: 6200, prevPrice: 6000, unit: "Per Quintal", trend: "up" },
  { id: 7, crop: "Cotton",  mandi: "Nalgonda",   district: "Nalgonda",   price: 6100, prevPrice: 6150, unit: "Per Quintal", trend: "down" },
  { id: 8, crop: "Soybean", mandi: "Medak",      district: "Medak",      price: 4100, prevPrice: 3950, unit: "Per Quintal", trend: "up" },
  { id: 9, crop: "Soybean", mandi: "Sangareddy", district: "Sangareddy", price: 4050, prevPrice: 4050, unit: "Per Quintal", trend: "stable" },
  { id: 10, crop: "Wheat",  mandi: "Mahbubnagar",district: "Mahbubnagar",price: 2350, prevPrice: 2200, unit: "Per Quintal", trend: "up" },
];

// Price trend history for chart (last 7 days)
export const priceTrendData = [
  { day: "Mon", Paddy: 1980, Maize: 1700, Cotton: 6000, Soybean: 3950, Wheat: 2200 },
  { day: "Tue", Paddy: 2000, Maize: 1720, Cotton: 6050, Soybean: 3980, Wheat: 2210 },
  { day: "Wed", Paddy: 2020, Maize: 1750, Cotton: 6080, Soybean: 4000, Wheat: 2250 },
  { day: "Thu", Paddy: 2010, Maize: 1780, Cotton: 6100, Soybean: 4020, Wheat: 2280 },
  { day: "Fri", Paddy: 2050, Maize: 1800, Cotton: 6150, Soybean: 4050, Wheat: 2300 },
  { day: "Sat", Paddy: 2080, Maize: 1830, Cotton: 6180, Soybean: 4080, Wheat: 2330 },
  { day: "Sun", Paddy: 2100, Maize: 1850, Cotton: 6200, Soybean: 4100, Wheat: 2350 },
];

// Summary cards for top of page
export const marketSummary = [
  { crop: "Paddy",   avgPrice: 2117, highMandi: "Karimnagar", highPrice: 2200, trend: "up" },
  { crop: "Maize",   avgPrice: 1815, highMandi: "Nizamabad",  highPrice: 1850, trend: "up" },
  { crop: "Cotton",  avgPrice: 6150, highMandi: "Khammam",    highPrice: 6200, trend: "up" },
  { crop: "Soybean", avgPrice: 4075, highMandi: "Medak",      highPrice: 4100, trend: "up" },
  { crop: "Wheat",   avgPrice: 2350, highMandi: "Mahbubnagar",highPrice: 2350, trend: "up" },
];