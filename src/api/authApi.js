// ─────────────────────────────────────────────────────
// authApi.js — Mock dataset for Authentication & Farmer Profiles
// Backend team: replace these with real API calls
// ─────────────────────────────────────────────────────

// Registered farmers (for OTP lookup)
export const registeredFarmers = [
  { id: 1,  phone: "9876543210", name: "Ravi Kumar",    village: "Pochampally", block: "Bhongir",     district: "Yadadri",    soil: "Black",  farmSize: 3.5, crop: "Paddy",   language: "te" },
  { id: 2,  phone: "9876543211", name: "Lakshmi Devi",  village: "Miryalaguda", block: "Miryalaguda", district: "Nalgonda",   soil: "Red",    farmSize: 2.0, crop: "Cotton",  language: "te" },
  { id: 3,  phone: "9876543212", name: "Venkat Rao",    village: "Siddipet",    block: "Siddipet",    district: "Siddipet",   soil: "Loamy",  farmSize: 4.2, crop: "Maize",   language: "te" },
  { id: 4,  phone: "9876543213", name: "Padma Bai",     village: "Kamareddy",   block: "Kamareddy",   district: "Kamareddy",  soil: "Sandy",  farmSize: 1.5, crop: "Wheat",   language: "te" },
  { id: 5,  phone: "9876543214", name: "Suresh Goud",   village: "Tandur",      block: "Tandur",      district: "Vikarabad",  soil: "Black",  farmSize: 5.0, crop: "Paddy",   language: "te" },
];

// Mock OTP (backend will generate real OTPs)
export const MOCK_OTP = "123456";

// Mock function to simulate OTP send (backend: POST /api/auth/send-otp)
export async function sendOtp(phone) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true, message: "OTP sent to " + phone }), 800)
  );
}

// Mock function to simulate OTP verify (backend: POST /api/auth/verify-otp)
export async function verifyOtp(phone, otp) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        const farmer = registeredFarmers.find(f => f.phone === phone);
        if (farmer) resolve({ success: true, farmer, token: "mock-jwt-token-xyz" });
        else resolve({ success: true, isNew: true, phone });
      } else {
        reject(new Error("Invalid OTP. Please try again."));
      }
    }, 1000)
  );
}

// Mock function to create profile (backend: POST /api/farmers/profile)
export async function createProfile(profileData) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true, farmer: { id: Date.now(), ...profileData } }), 700)
  );
}

export const cropOptions = ["Paddy", "Cotton", "Maize", "Wheat", "Soybean", "Groundnut", "Sugarcane", "Turmeric"];

export const soilOptions = ["Black", "Red", "Loamy", "Sandy", "Clay", "Laterite"];

export const telanganaDistricts = [
  "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
  "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
  "Khammam", "Komuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
  "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
  "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
  "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
  "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri",
];
