import { soilSensorData } from "../api/soilApi";
import { marketPriceData } from "../api/marketApi";
import { harvestData } from "../api/farmerApi";
import { getStatusColor, getHarvestColor, getTrendIcon } from "../utils/helpers";

export default function FarmerDrawer({ farmer, onClose }) {
  if (!farmer) return null;

  // Find related soil sensor
  const sensor = soilSensorData.find(s => s.district === farmer.district) || null;
  const sensorColors = sensor ? getStatusColor(sensor.status) : null;

  // Find harvest record
  const harvest = harvestData.find(h => h.farmerId === farmer.id) || null;
  const harvestColors = harvest ? getHarvestColor(harvest.result) : null;

  // Find market price for the farmer's crop
  const market = marketPriceData.find(m => m.crop === farmer.crop) || null;
  const trendInfo = market ? getTrendIcon(market.trend) : null;

  return (
    <>
      <div className="farmer-drawer-overlay" onClick={onClose} />
      <div className="farmer-drawer">
        {/* Header */}
        <div className="p-6 bg-accent/10 dark:bg-accent/20 border-b border-accent/20 flex justify-between items-start">
          <div>
            <div className="w-[52px] h-[52px] rounded-full bg-[#4ade80] text-[#0f2d1f] flex items-center justify-center font-extrabold text-[22px] mb-3">
              {farmer.name[0]}
            </div>
            <div className="text-white font-extrabold text-[18px]">{farmer.name}</div>
            <div className="text-[#4a7a5a] text-[13px] mt-1">
              {farmer.village}, {farmer.block} · {farmer.district}
            </div>
            <div className="text-[#4a7a5a] text-[12px] mt-0.5">
              📞 {farmer.phone}
            </div>
          </div>
          <button onClick={onClose} className="bg-white/10  border-none rounded-lg w-8 h-8 cursor-pointer  text-[16px] flex items-center justify-center hover:bg-white/20 transition-colors ">
            <span class="text-black">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Farm Info */}
          <Section title="🌾 Farm Details">
            <Row label="Crop" value={farmer.crop} />
            <Row label="Farm Size" value={`${farmer.farmSize} acres`} />
            <Row label="Soil Type" value={<Badge text={farmer.soil} bg="#e6f4ea" color="#27AE60" />} />
          </Section>

          {/* Soil Sensor */}
          <Section title="📡 Nearest Sensor">
            {sensor ? <>
              <Row label="Sensor ID" value={sensor.sensor_id} />
              <Row label="Location" value={sensor.location} />
              <Row label="Moisture" value={
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#e0efe5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sensor.moisture}%`, background: sensorColors.text }} />
                  </div>
                  <strong style={{ color: sensorColors.text }}>{sensor.moisture}%</strong>
                </div>
              } />
              <Row label="Status" value={<Badge text={sensor.status} bg={sensorColors.bg} color={sensorColors.text} />} />
            </> : <div className="text-text-muted text-[13px]">No sensor in this district.</div>}
          </Section>

          {/* Harvest Status */}
          <Section title="🌱 Harvest Status">
            {harvest ? <>
              <Row label="Result" value={<Badge text={harvest.result} bg={harvestColors.bg} color={harvestColors.text} />} />
              <Row label="Confidence" value={`${harvest.confidence}%`} />
              <Row label="Days Remaining" value={harvest.daysRemaining === 0 ? "Ready now" : `${harvest.daysRemaining} days`} />
              <Row label="Last Scan" value={harvest.date} />
            </> : <div className="text-text-muted text-[13px]">No scan data available.</div>}
          </Section>

          {/* Market Prices */}
          <Section title="📈 Nearest Mandi Price">
            {market ? <>
              <Row label="Mandi" value={market.mandi} />
              <Row label="Price" value={`₹${market.price} / quintal`} />
              <Row label="Previous" value={`₹${market.prevPrice}`} />
              <Row label="Trend" value={
                <span className="font-bold" style={{ color: trendInfo.color }}>
                  {trendInfo.icon} {market.trend === "up" ? "Rising" : market.trend === "down" ? "Falling" : "Stable"}
                </span>
              } />
            </> : <div className="text-text-muted text-[13px]">No market data available.</div>}
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <div className="text-[13px] font-bold text-text-muted mb-3 tracking-[0.5px] uppercase">
        {title}
      </div>
      <div className="bg-page rounded-[10px] border border-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center px-[14px] py-2.5 border-b border-border last:border-b-0">
      <span className="text-[12px] text-text-muted">{label}</span>
      <span className="text-[13px] font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function Badge({ text, bg, color }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[12px] font-bold inline-block"
      style={{ background: bg, color }}
    >
      {text}
    </span>
  );
}
