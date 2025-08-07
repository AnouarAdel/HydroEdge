import { useState, useEffect, useCallback, useRef } from 'react';
import StatCard from './StatCard';
import LineChart from './LineChart';

// --- Lucide Icons ---
import { Clock3, ThermometerSun, BrainCircuit } from 'lucide-react';

function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationData, setSimulationData] = useState([]);
  const [currentStats, setCurrentStats] = useState(null);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchNextStep = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/simulation_step', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.statusText}`);
      }
      const data = await response.json();
      setCurrentStats(data);
      setSimulationData(prevData => [...prevData, data]);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch simulation step:", err);
      setError("Connection to backend failed. Is the server running?");
      setIsRunning(false);
    }
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    setError(null);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(false);
    try {
      await fetch('http://localhost:5000/api/reset_simulation', { method: 'POST' });
      setSimulationData([]);
      setCurrentStats(null);
      setError(null);
    } catch (err) {
      console.error("Failed to reset simulation:", err);
      setError("Failed to reset simulation on the backend.");
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      fetchNextStep();
      intervalRef.current = setInterval(fetchNextStep, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, fetchNextStep]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4 mb-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-700">Simulation Control</h2>
        <div className="flex space-x-2">
          <button onClick={handleStart} disabled={isRunning} className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition-colors">Start</button>
          <button onClick={handleStop} disabled={!isRunning} className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-300 text-white font-bold py-2 px-4 rounded-lg transition-colors">Stop</button>
          <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Reset</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LineChart chartData={simulationData} />
        </div>

        <div className="space-y-8">
          <StatCard
            icon={<Clock3 className="h-6 w-6 text-slate-600" />}
            title="Hour of Day"
            value={currentStats ? currentStats.hour : '--'}
            unit="h"
          />
          <StatCard
            icon={<ThermometerSun className="h-6 w-6 text-slate-600" />}
            title="Temperature"
            value={currentStats ? currentStats.temperature : '--'}
            unit="°C"
          />
          <StatCard
            icon={<BrainCircuit className="h-6 w-6 text-slate-600" />}
            title="AI Decision"
            value={currentStats ? (currentStats.irrigation_on ? 'IRRIGATING' : 'Monitoring') : '--'}
            colorClass={currentStats?.irrigation_on ? 'text-blue-500' : 'text-slate-800'}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
