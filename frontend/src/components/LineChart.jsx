import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// We need to register the components we're using from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ chartData }) {
  // Extract the labels (hour of day) and data points from the props
  const labels = chartData.map(data => `${data.hour}h`);
  const moistureData = chartData.map(data => data.soil_moisture);
  const tempData = chartData.map(data => data.temperature);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Soil Moisture',
        data: moistureData,
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y', // Assign to the left Y-axis
        tension: 0.3, // Makes the line slightly curved
      },
      {
        label: 'Temperature',
        data: tempData,
        borderColor: 'rgb(239, 68, 68)', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        yAxisID: 'y1', // Assign to the right Y-axis
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container's height
    animation: {
      duration: 500, // Smooth animation on re-render
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Live Sensor Data Simulation',
        font: {
          size: 18,
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (Hour of Day)'
        }
      },
      y: { // Left Y-axis (for Soil Moisture)
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Soil Moisture (%)',
          color: 'rgb(59, 130, 246)',
        },
      },
      y1: { // Right Y-axis (for Temperature)
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 35,
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: 'rgb(239, 68, 68)',
        },
        // Ensure the grid lines from this axis don't clash with the main one
        grid: {
          drawOnChartArea: false, 
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-96">
      <Line options={options} data={data} />
    </div>
  );
}

export default LineChart;