import React, { useState } from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import Chart from 'react-apexcharts';

const TargetLanguagePieChart = () => {
  const targetLangData = {
    English: [
      { language: "Hindi", count: 300 },
      { language: "Spanish", count: 150 },
      { language: "French", count: 100 },
    ],
    Hindi: [
      { language: "English", count: 200 },
      { language: "Tamil", count: 120 },
      { language: "Spanish", count: 80 },
    ],
    Spanish: [
      { language: "English", count: 100 },
      { language: "Hindi", count: 90 },
      { language: "French", count: 50 },
    ],
  };

  const sourceLanguages = Object.keys(targetLangData);
  const [selectedSourceLang, setSelectedSourceLang] = useState(sourceLanguages[0]);

  const currentData = targetLangData[selectedSourceLang];

  const options = {
    chart: {
      type: 'pie',
    },
    labels: currentData.map((item) => item.language),
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: false,
      formatter: function (val, opts) {
        return opts.w.globals.labels[opts.seriesIndex];
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} users`;
        },
      },
    },
    colors: ['#4680ff', '#2ed8b6', '#ffb64d', '#fc6180', '#ab7967', '#99c794'],
  };

  const series = currentData.map((item) => item.count);

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Target Language Distribution</h5>
          </Col>
          <Col className="text-end">
            <Form.Select
              style={{ width: '200px', display: 'inline-block' }}
              value={selectedSourceLang}
              onChange={(e) => setSelectedSourceLang(e.target.value)}
            >
              {sourceLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Chart options={options} series={series} type="pie" height={380} />
      </Card.Body>
    </Card>
  );
};

export default TargetLanguagePieChart;
