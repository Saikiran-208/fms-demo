// src/charts/MoistureChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { day: 'Mon', moisture: 45 },
  { day: 'Tue', moisture: 52 },
  { day: 'Wed', moisture: 61 },
  { day: 'Thu', moisture: 58 },
  { day: 'Fri', moisture: 70 },
  { day: 'Sat', moisture: 65 },
  { day: 'Sun', moisture: 55 },
];

export default function MoistureChart() {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="moisture" stroke="#2E75B6" />
    </LineChart>
  );
}