import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSensorData, useDevices, useAlerts, useThresholds } from '../hooks/useFirebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import SensorChart from '../components/SensorChart';
import AlertPanel from '../components/AlertPanel';
import ThresholdConfig from '../components/ThresholdConfig';
import SensorCard from '../components/SensorCard';
import { LogOut, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { devices, loading: devicesLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState('');
  
  const { data: sensorData, loading: dataLoading } = useSensorData(selectedDevice, 24);
  const { alerts, loading: alertsLoading } = useAlerts(selectedDevice, false);
  const { thresholds, loading: thresholdsLoading } = useThresholds(selectedDevice);

  const latestReading = sensorData[sensorData.length - 1];

  const handleAcknowledge = async (alertId) => {
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        acknowledged: true
      });
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSensorStatus = (value, threshold, type) => {
    if (!threshold) return 'normal';
    const ratio = value / threshold;
    if (ratio > 1.5) return 'critical';
    if (ratio > 1.0) return 'warning';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Landslide Monitoring Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome, {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Device Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Device
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a device --</option>
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
        </div>

        {!selectedDevice ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Please select a device to view data</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sensor Cards */}
            {latestReading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SensorCard
                  title="Tilt X"
                  value={latestReading.tilt_x}
                  unit="°"
                  icon="tilt"
                  status={getSensorStatus(Math.abs(latestReading.tilt_x), thresholds?.tilt_max)}
                />
                <SensorCard
                  title="Tilt Y"
                  value={latestReading.tilt_y}
                  unit="°"
                  icon="tilt"
                  status={getSensorStatus(Math.abs(latestReading.tilt_y), thresholds?.tilt_max)}
                />
                <SensorCard
                  title="Soil Moisture"
                  value={latestReading.soil_moisture}
                  unit="%"
                  icon="moisture"
                  status={getSensorStatus(latestReading.soil_moisture, thresholds?.soil_moisture_max)}
                />
                <SensorCard
                  title="Humidity"
                  value={latestReading.humidity}
                  unit="%"
                  icon="temperature"
                  status={getSensorStatus(latestReading.humidity, thresholds?.humidity_max)}
                />
              </div>
            )}

            {/* Alerts */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Active Alerts</h2>
              <AlertPanel
                alerts={alerts}
                onAcknowledge={handleAcknowledge}
                loading={alertsLoading}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SensorChart
                data={sensorData}
                sensorType="tilt_x"
                color="#ef4444"
              />
              <SensorChart
                data={sensorData}
                sensorType="soil_moisture"
                color="#3b82f6"
              />
              <SensorChart
                data={sensorData}
                sensorType="humidity"
                color="#10b981"
              />
              <SensorChart
                data={sensorData}
                sensorType="temperature"
                color="#f59e0b"
              />
            </div>

            {/* Threshold Configuration */}
            <ThresholdConfig
              deviceId={selectedDevice}
              thresholds={thresholds}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
