import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';

export const useSensorData = (deviceId, hours = 24) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);

    const q = query(
      collection(db, 'sensor_readings'),
      where('device_id', '==', deviceId),
      where('timestamp', '>=', cutoffTime),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const readings = [];
      snapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() });
      });
      setData(readings.reverse());
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deviceId, hours]);

  return { data, loading, error };
};

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'sensor_readings'));
        const deviceSet = new Set();
        snapshot.forEach((doc) => {
          deviceSet.add(doc.data().device_id);
        });
        setDevices(Array.from(deviceSet));
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return { devices, loading };
};

export const useAlerts = (deviceId = null, acknowledged = false) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'alerts'),
      where('acknowledged', '==', acknowledged),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    if (deviceId) {
      q = query(q, where('device_id', '==', deviceId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertList = [];
      snapshot.forEach((doc) => {
        alertList.push({ id: doc.id, ...doc.data() });
      });
      setAlerts(alertList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deviceId, acknowledged]);

  return { alerts, loading };
};

export const useThresholds = (deviceId) => {
  const [thresholds, setThresholds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) return;

    const fetchThresholds = async () => {
      try {
        const docRef = doc(db, 'thresholds', deviceId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setThresholds(docSnap.data());
        } else {
          // Default thresholds
          setThresholds({
            device_id: deviceId,
            tilt_max: 15.0,
            soil_moisture_max: 80.0,
            humidity_max: 90.0,
            soil_moisture_min: 10.0,
          });
        }
      } catch (error) {
        console.error('Error fetching thresholds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThresholds();
  }, [deviceId]);

  return { thresholds, loading };
};
