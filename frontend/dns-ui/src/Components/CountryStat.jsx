import React, {useEffect, useState} from 'react';
import { Bar } from 'react-chartjs-2';
import axios from "axios";
const CountryStat = ({ stats }) => {

  const data = {
    labels: stats.map(item => item.country),
    datasets: [
      {
        label: 'Countries with most registered domains',
        data: stats.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar fill color
        borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
        borderWidth: 1
      }
    ]
  };

  // Options object to customize the chart appearance
  const options = {
    indexAxis: 'y', // Display bars horizontally
    scales: {
      x: {
        beginAtZero: true // Start x-axis at zero
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '600px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};


export default CountryStat;
