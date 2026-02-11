import React from 'react';
import { AlertTriangle, Check, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const AlertPanel = ({ alerts, onAcknowledge, loading }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertClass = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading alerts...</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <Check className="w-5 h-5 text-green-600" />
        <span className="text-green-800">No active alerts. All systems normal.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`border rounded-lg p-4 ${getAlertClass(alert.level)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.level)}
              <div>
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Device: {alert.device_id} • {' '}
                  {format(
                    alert.timestamp?.toDate?.() || new Date(alert.timestamp),
                    'MMM d, HH:mm'
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Value: {alert.value?.toFixed(2)} (Threshold: {alert.threshold})
                </p>
              </div>
            </div>
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Acknowledge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertPanel;
