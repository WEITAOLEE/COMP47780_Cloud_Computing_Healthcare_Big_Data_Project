import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';

// A generic function to fetch data from a given endpoint
const fetchDataFromEndpoint = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const ChartComponent = ({ data, chartType, label, dataKey, backgroundColor, borderColor }) => {
  const chartData = {
    labels: data.map(item => item['Country/Region']),
    datasets: [{
      label,
      data: data.map(item => item[dataKey]),
      backgroundColor,
      borderColor,
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  switch (chartType) {
    case 'bar':
      return <Bar data={chartData} options={options} />;
    case 'pie':
      return <Pie data={chartData} options={options} />;
    case 'line':
      return <Line data={chartData} options={options} />;
    default:
      return null;
  }
};

const App = () => {
  const [countryData, setCountryData] = useState([]);
  const [covidData, setCovidData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const countryResponse = await fetchDataFromEndpoint('http://localhost:3001/country-wise-latest');
      setCountryData(countryResponse);

      const covidResponse = await fetchDataFromEndpoint('http://localhost:3001/covid-19-clean-complete');
      setCovidData(covidResponse);

      const groupedResponse = await fetchDataFromEndpoint('http://localhost:3001/full-grouped');
      setGroupedData(groupedResponse);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>COVID-19 Data Visualization</h1>
      {countryData.length > 0 && (
        <ChartComponent
          data={countryData}
          chartType="bar"
          label="Confirmed Cases"
          dataKey="Confirmed"
          backgroundColor="rgba(255, 99, 132, 0.2)"
          borderColor="rgba(255, 99, 132, 1)"
        />
      )}
      {/* Repeat for other datasets with Pie and Line components */}
    </div>
  );
};

export default App;