export const farmerData = [
  { id: 1,  name: "Ravi Kumar",    village: "Pochampally", block: "Bhongir",     district: "Yadadri",    soil: "Black",  farmSize: 3.5, crop: "Paddy",   phone: "9876543210" },
  { id: 2,  name: "Lakshmi Devi",  village: "Miryalaguda", block: "Miryalaguda", district: "Nalgonda",   soil: "Red",    farmSize: 2.0, crop: "Cotton",  phone: "9876543211" },
  { id: 3,  name: "Venkat Rao",    village: "Siddipet",    block: "Siddipet",    district: "Siddipet",   soil: "Loamy",  farmSize: 4.2, crop: "Maize",   phone: "9876543212" },
  { id: 4,  name: "Padma Bai",     village: "Kamareddy",   block: "Kamareddy",   district: "Kamareddy",  soil: "Sandy",  farmSize: 1.5, crop: "Wheat",   phone: "9876543213" },
  { id: 5,  name: "Suresh Goud",   village: "Tandur",      block: "Tandur",      district: "Vikarabad",  soil: "Black",  farmSize: 5.0, crop: "Paddy",   phone: "9876543214" },
  { id: 6,  name: "Anitha Reddy",  village: "Wanaparthy",  block: "Wanaparthy",  district: "Wanaparthy", soil: "Red",    farmSize: 2.8, crop: "Soybean", phone: "9876543215" },
  { id: 7,  name: "Mahesh Naik",   village: "Nizamabad",   block: "Nizamabad",   district: "Nizamabad",  soil: "Loamy",  farmSize: 3.1, crop: "Paddy",   phone: "9876543216" },
  { id: 8,  name: "Saraswati",     village: "Adilabad",    block: "Adilabad",    district: "Adilabad",   soil: "Black",  farmSize: 6.0, crop: "Cotton",  phone: "9876543217" },
  { id: 9,  name: "Rajesh Varma",  village: "Khammam",     block: "Khammam",     district: "Khammam",    soil: "Sandy",  farmSize: 2.3, crop: "Maize",   phone: "9876543218" },
  { id: 10, name: "Geetha Kumari", village: "Nalgonda",    block: "Nalgonda",    district: "Nalgonda",   soil: "Red",    farmSize: 1.8, crop: "Wheat",   phone: "9876543219" },
];

export const farmersByDistrict = [
  { district: "Rangareddy",  count: 142 },
  { district: "Warangal",    count: 98  },
  { district: "Karimnagar",  count: 115 },
  { district: "Nizamabad",   count: 87  },
  { district: "Nalgonda",    count: 103 },
  { district: "Khammam",     count: 76  },
  { district: "Adilabad",    count: 64  },
  { district: "Medak",       count: 91  },
  { district: "Mahbubnagar", count: 55  },
  { district: "Siddipet",    count: 72  },
];

export const farmerSummary = {
  total: 903,
  activeThisMonth: 741,
  newThisWeek: 28,
  totalArea: 2847,
};

export const harvestData = [
  { id: 1,  farmerId: 1,  farmer: "Ravi Kumar",   crop: "Paddy",   result: "Ready",     confidence: 92, daysRemaining: 0,  date: "2026-03-05" },
  { id: 2,  farmerId: 2,  farmer: "Lakshmi Devi", crop: "Cotton",  result: "Not Ready", confidence: 78, daysRemaining: 12, date: "2026-03-05" },
  { id: 3,  farmerId: 3,  farmer: "Venkat Rao",   crop: "Maize",   result: "Ready",     confidence: 88, daysRemaining: 0,  date: "2026-03-04" },
  { id: 4,  farmerId: 4,  farmer: "Padma Bai",    crop: "Wheat",   result: "Not Ready", confidence: 81, daysRemaining: 7,  date: "2026-03-04" },
  { id: 5,  farmerId: 5,  farmer: "Suresh Goud",  crop: "Paddy",   result: "Ready",     confidence: 95, daysRemaining: 0,  date: "2026-03-03" },
  { id: 6,  farmerId: 6,  farmer: "Anitha Reddy", crop: "Soybean", result: "Not Ready", confidence: 74, daysRemaining: 20, date: "2026-03-03" },
  { id: 7,  farmerId: 7,  farmer: "Mahesh Naik",  crop: "Paddy",   result: "Ready",     confidence: 90, daysRemaining: 0,  date: "2026-03-02" },
  { id: 8,  farmerId: 8,  farmer: "Saraswati",    crop: "Cotton",  result: "Not Ready", confidence: 69, daysRemaining: 15, date: "2026-03-02" },
];

export const harvestSummary = {
  totalScans: 240,
  ready: 140,
  notReady: 80,
  pending: 20,
};