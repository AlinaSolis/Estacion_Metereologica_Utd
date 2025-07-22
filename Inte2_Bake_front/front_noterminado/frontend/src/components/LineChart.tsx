import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../pages/CSS/TemperaturePage.css';

interface ChartProps {
  data: { time: string; temp: number }[];
}

const TemperatureChart: React.FC<ChartProps> = ({ data }) => (
  <div className="weather-chart-container slide-up">
    <h3 className="weather-chart-title">Temperatura (°C)</h3>
    <div className="weather-chart-wrapper">
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <Line type="monotone" dataKey="temp" stroke="#d28c0c" strokeWidth={2} />
          <XAxis dataKey="time" tick={{ fill: '#7f8c8d' }} />
          <YAxis tick={{ fill: '#7f8c8d' }} />
          <Tooltip contentStyle={{
            background: '#2c3e50',
            borderColor: '#d28c0c',
            borderRadius: '8px',
            color: '#ffffff'
          }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TemperatureChart;
