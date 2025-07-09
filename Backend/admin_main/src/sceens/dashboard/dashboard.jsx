import React from 'react';

// react-bootstrap
import { Row, Col, Card, Table, ListGroup } from 'react-bootstrap';

// third party
import Chart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import OrderCard from '../../components/Widgets/Statistic/OrderCard';
import SocialCard from '../../components/Widgets/Statistic/SocialCard';

import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
import customerChart from './chart/analytics-cuatomer-chart';
import customerChart1 from './chart/analytics-cuatomer-chart-1';
import AgeDistributionChart from './chart/analytics-age-distribution-chart';
import DonutChartCard from './chart/donut-chart';
import UsersByCountryMap from './chart/UsersByCountryMap';
import UsersJoinedChart from './chart/user-joined-chart';
import TargetLanguagePieChart from './chart/target-lang-pie';



// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DashAnalytics = () => {
  const genderData = {
    Users: { Female: 674, Male: 182 },
    'Content Creators': { Female: 300, Male: 120 },
    Validators: { Female: 50, Male: 40 },
  };
  const sourceLangData = {
    Users: { English: 500, Hindi: 300, Spanish: 150, French: 100 },
    'Content Creators': { English: 250, Hindi: 150, Spanish: 50, French: 25 },
    Validators: { English: 100, Hindi: 60, Spanish: 30, French: 20 },
  };
  const filterOptions = ['Users', 'Content Creators', 'Validators'];
  return (
    <React.Fragment>
      <Row className="mb-4">
        <Col md={3}>
          <OrderCard params={{ title: 'Total Users', class: 'bg-c-blue', icon: 'feather icon-users', primaryText: '486' }} />
        </Col>
        <Col md={3}>
          <OrderCard params={{ title: 'Total Content Creators', class: 'bg-c-green', icon: 'feather icon-users', primaryText: '160041' }} />
        </Col>
        <Col md={3}>
          <OrderCard params={{ title: 'Total Institutions', class: 'bg-c-yellow', icon: 'feather icon-users', primaryText: '500' }} />
        </Col>
        <Col md={3}>
          <OrderCard params={{ title: 'Total Validators', class: 'bg-c-red', icon: 'feather icon-users', primaryText: '910' }} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <AgeDistributionChart />
        </Col>
        <Col md={3}>
          <DonutChartCard title="Gender Distribution" filterOptions={filterOptions} data={genderData} />
        </Col>
        <Col md={3}>
          <TargetLanguagePieChart />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <UsersJoinedChart />
        </Col>
        <Col md={6}>
          <UsersByCountryMap />
        </Col>
      </Row>

    </React.Fragment>
  );
};

export default DashAnalytics;
