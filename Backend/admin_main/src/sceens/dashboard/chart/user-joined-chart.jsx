import React from 'react';
import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';

const UsersJoinedChart = () => {
  const data = [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 200 },
    { month: "Mar", count: 300 },
    { month: "Apr", count: 250 },
    { month: "May", count: 400 },
    { month: "Jun", count: 350 },
    { month: "Jul", count: 420 },
    { month: "Aug", count: 500 },
    { month: "Sep", count: 450 },
    { month: "Oct", count: 480 },
    { month: "Nov", count: 550 },
    { month: "Dec", count: 600 },
  ];

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: data.map((item) => item.month),
    },
    colors: ['#4680ff'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} sign-ups`;
        },
      },
    },
  };

  const series = [
    {
      name: 'New Sign-ups',
      data: data.map((item) => item.count),
    },
  ];

  return (
    <Card>
      <Card.Header>
        <h5>Users Joined Per Month</h5>
      </Card.Header>
      <Card.Body>
        <Chart options={options} series={series} type="area" height={350} />
      </Card.Body>
    </Card>
  );
};

export default UsersJoinedChart;
