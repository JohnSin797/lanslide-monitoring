import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

const SensorChart = ({ data, sensorType, color = '#3b82f6' }) => {
  const formatData = (rawData) => {
    return rawData.map(reading => ({
      timestamp: reading.timestamp?.toDate?.() || new Date(reading.timestamp),
      value: reading[sensorType],
      displayTime: format(
        reading.timestamp?.toDate?.() || new Date(reading.timestamp),
        'HH:mm'
      )
    }));
  };

  const chartData = formatData(data);

  const getSensorLabel = (type) => {
    const labels = {
      tilt_x: 'Tilt X (°)',
      tilt_y: 'Tilt Y (°)',
      tilt_z: 'Tilt Z (°)',
      soil_moisture: 'Soil Moisture (%)',
      humidity: 'Humidity (%)',
      temperature: 'Temperature (°C)'
    };
    return labels[type] || type;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm text-gray-600">{`Time: ${label}`}</p>
          <p className="text-sm font-semibold" style={{ color }}>
            {`${getSensorLabel(sensorType)}: ${payload[0].value.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{getSensorLabel(sensorType)} - Last 24 Hours</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayTime" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
            name={getSensorLabel(sensorType)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
