import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const countryNames = {
  'AT': 'Austria',
  'AL': 'Albania',
  'BA': 'Bosnia and Herzegovina',
  'BE': 'Belgium',
  'BG': 'Bulgaria',
  'CN_X_HK':'China except Hong Kong',
  'CH': 'Switzerland',
  'HR': 'Croatia',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DK': 'Denmark',
  'EE': 'Estonia',
  'FI': 'Finland',
  'FR': 'France',
  'IS': 'Iceland',
  'DE': 'Germany',
  'EL': 'Greece',
  'HU': 'Hungary',
  'IE': 'Ireland',
  'IT': 'Italy',
  'JP': 'Japan',
  'KR': 'South Korea',
  'LV': 'Latvia',
  'LI':'Liechtenstein',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'ME': 'Montenegro',
  'MO': 'Monaco',
  'MK': 'North Macedonia',
  'NO': 'Norway',
  'NL': 'Netherlands',
  'PL': 'Poland',
  'PT': 'Portugal',
  'RO': 'Romania',
  'RS': 'Serbia',
  'RU': 'Russia',
  'SK': 'Slovakia',
  'SI': 'Slovenia',
  'TR': 'Turkey',
  'UK': 'United Kingdom',
  'US': 'United States',
  'ES': 'Spain',
  'SE': 'Sweden'
};

// Register the required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExpenditureChart = () => {
  const [chartData, setChartData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/expenditures/')
      .then(response => {
        const data = response.data;
        const years = [...new Set(data.map(item => item.year))];
        const countries = [...new Set(data.map(item => item.country))].sort(); // Sort alphabetically
        setCountries(countries);

        if (countries.length > 0) {
          setSelectedCountry(countries[0]);
          const countryData = data.filter(item => item.country === countries[0]);

          const datasets = [{
            label: countries[0],
            data: years.map(year => {
              const record = countryData.find(item => item.year === year);
              return record ? record.percentage_of_gdp : 0;
            }),
            borderColor: getRandomColor(),
            fill: false
          }];

          setChartData({
            labels: years,
            datasets: datasets
          });
        }
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      axios.get('http://localhost:8000/api/expenditures/')
        .then(response => {
          const data = response.data;
          const years = [...new Set(data.map(item => item.year))].sort((a, b) => a - b); // Sort years numerically
          const countryData = data.filter(item => item.country === selectedCountry);

          const datasets = [{
            label: selectedCountry,
            data: years.map(year => {
              const record = countryData.find(item => item.year === year);
              return record ? record.percentage_of_gdp : 0;
            }),
            borderColor: getRandomColor(),
            fill: false
          }];

          setChartData({
            labels: years,
            datasets: datasets
          });
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    }
  }, [selectedCountry, countries]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <h2>Expenditure Chart</h2>
      <FormControl fullWidth>
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          labelId="country-select-label"
          value={selectedCountry}
          label="Country"
          onChange={handleCountryChange}
        >
          {countries.map(country => (
            <MenuItem key={country} value={country}>
              {countryNames[country] ? `${countryNames[country]} (${country})` : country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'R&D Expenditure as Percentage of GDP'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                },
                grid: {
                  display: false
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Percentage of GDP (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value.toFixed(2) + '%';
                  },
                  count: 5
                },
                grid: {
                  display: true
                }
              }
            }
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default ExpenditureChart;
