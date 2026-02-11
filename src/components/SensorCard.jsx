import React from 'react';
import { Activity, Droplets, Thermometer, Compass } from 'lucide-react';

const SensorCard = ({ title, value, unit, icon, status, lastUpdate }) => {
  const getIcon = () => {
    switch (icon) {
      case 'tilt':
        return <Compass className="w-6 h-6" />;
      case 'moisture':
        return <Droplets className="w-6 h-6" />;
      case 'temperature':
        return <Thermometer className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            {getIcon()}
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
          {status || 'Unknown'}
        </span>
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        <span className="text-gray-500 ml-1">{unit}</span>
      </div>
      
      {lastUpdate && (
        <p className="text-sm text-gray-500">
          Last update: {lastUpdate}
        </p>
      )}
    </div>
  );
};

export default SensorCard;
