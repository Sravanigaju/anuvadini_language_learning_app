import React, { useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import Chart from 'react-apexcharts';

const DonutChartCard = ({ title, filterOptions, data }) => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const currentData = data[selectedFilter];

  // Define label order to match your expected colors
  const labels = Object.keys(currentData);

  // Prepare colors — matching your original theme
  const labelColors = {
    Female: '#4680ff',
    Male: '#2ed8b6',
    English: '#4680ff',
    Hindi: '#2ed8b6',
    Tamil: '#ffb64d',
    Telugu: '#fc6180',
    Bengali: '#ab7967',
    Marathi: '#99c794',
    Gujarati: '#c594c5',
    Punjabi: '#f99157',
    Kannada: '#5fb3b3',
    Malayalam: '#ec5f67', 
    French: '#f99157',
    Spanish: '#b64d45', // fallback gray
  };
  // '#4680ff', '#2ed8b6'
  // Create colors array in the same order as labels
  const colors = labels.map(label => labelColors[label] || '#6c757d'); // fallback gray

  // Build series based on defined label order
  const chartSeries = labels.map(label => currentData[label] || 0);

const chartOptions = {
  chart: {
    type: 'donut',
  },
  labels: labels,
  colors: colors,
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: false, // ✅ disables labels on slices
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: false, // ✅ disables labels inside donut hole
        },
      },
    },
  },
};


  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>{title}</h5>
          </Col>
          <Col className="text-end">
            <Form.Select
              style={{ width: '160px', display: 'inline-block' }}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Chart options={chartOptions} series={chartSeries} type="donut" height={220} />
        <Row className="mt-3 text-center">
          {labels.map((label) => (
            <Col key={label}>
              <h3 className="m-0">
                <i className="fas fa-circle f-10 mx-2" style={{ color: labelColors[label] }} />
                {currentData[label]}
              </h3>
              <span className="ms-3">{label}</span>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DonutChartCard;
