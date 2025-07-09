import React, { useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import Chart from 'react-apexcharts';

const AgeDistributionChart = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const ageDistributionData = {
    English: [120, 300, 250, 180, 100],
    Hindi: [80, 220, 200, 100, 40],
    Spanish: [50, 100, 90, 60, 20],
  };

  const ageDistributionCategories = ['10-19', '20-29', '30-39', '40-49', '50+'];

  const ageChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ageDistributionCategories,
    },
    colors: ['#4099ff'],
  };

  const ageChartSeries = [
    {
      name: 'Users',
      data: ageDistributionData[selectedLanguage] || [],
    },
  ];

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Age Distribution of Users</h5>
          </Col>
          <Col className="text-end">
            <Form.Select
              style={{ width: '150px', display: 'inline-block' }}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {Object.keys(ageDistributionData).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="ps-4 pt-4 pb-0">
        <Chart options={ageChartOptions} series={ageChartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default AgeDistributionChart;
