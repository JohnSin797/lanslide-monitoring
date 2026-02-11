import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ThresholdConfig = ({ deviceId, thresholds, onUpdate }) => {
  const [formData, setFormData] = useState(thresholds || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'thresholds', deviceId), {
        ...formData,
        device_id: deviceId,
        updated_at: new Date()
      });
      setMessage('Thresholds updated successfully');
      onUpdate?.();
    } catch (error) {
      setMessage('Error updating thresholds: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Tilt Angle (°)
          </label>
          <input
            type="number"
            name="tilt_max"
            value={formData.tilt_max || 15}
            onChange={handleChange}
            min="0"
            max="90"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Soil Moisture (%)
          </label>
          <input
            type="number"
            name="soil_moisture_max"
            value={formData.soil_moisture_max || 80}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Humidity (%)
          </label>
          <input
            type="number"
            name="humidity_max"
            value={formData.humidity_max || 90}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Soil Moisture (%)
          </label>
          <input
            type="number"
            name="soil_moisture_min"
            value={formData.soil_moisture_min || 10}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : 'Save Thresholds'}
        </button>
      </form>
    </div>
  );
};

export default ThresholdConfig;
