import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import LanguageDropdown from './LanguageDropdown';

const dashboardChartsStyle = `
.dashboard-charts-bg {
  background: linear-gradient(135deg, #f8fafe 60%, #eaf1fb 100%);
  padding: 2.5rem 1.5rem;
  border-radius: 2.5rem;
}
.dashboard-charts-grid-pro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2.5rem;
}
.dashboard-chart-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px 0 rgba(40,107,218,0.10), 0 1.5px 8px rgba(40,107,218,0.06);
  border: 1.5px solid #e6eaf3;
  padding: 2.2rem 1.7rem 1.7rem 1.7rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.25s, transform 0.22s, border 0.22s;
  min-width: 0;
  position: relative;
  overflow: hidden;
}
.dashboard-chart-card:hover {
  box-shadow: 0 12px 40px 0 rgba(40,107,218,0.18), 0 2.5px 12px rgba(40,107,218,0.10);
  border: 1.5px solid #286bda;
  transform: translateY(-4px) scale(1.018);
}
.dashboard-chart-title {
  font-size: 1.22rem;
  font-weight: 700;
  color: #286bda;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dashboard-chart-divider {
  height: 2px;
  width: 36px;
  background: linear-gradient(90deg, #286bda 60%, #e78c32 100%);
  border: none;
  margin-bottom: 1.1rem;
  border-radius: 2px;
}
.dashboard-dropdown-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  justify-content: flex-end;
}
.dashboard-chart-content {
  margin-top: 0.2rem;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 900px) {
  .dashboard-charts-bg {
    padding: 1.2rem 0.2rem;
    border-radius: 1.2rem;
  }
  .dashboard-charts-grid-pro {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .dashboard-chart-card {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
  }
}
`;

const DashboardCharts = ({
    ageData,
    languageData,
    interestedLanguageData,
    xpProgressionData,
    streakData,
    certificateData,
    className
}) => (
    <>
        <style>{dashboardChartsStyle}</style>
        <div className={className ? `${className} dashboard-charts-bg` : 'dashboard-charts-bg'}>
            <div className="dashboard-charts-grid-pro">
                <div className="dashboard-chart-card">
                    <div className="dashboard-chart-title">Age Distribution</div>
                    <div className="dashboard-chart-divider"></div>
                    <div className="dashboard-dropdown-row"><LanguageDropdown /></div>
                    <div className="dashboard-chart-content"><Bar data={ageData} /></div>
                </div>
                <div className="dashboard-chart-card">
                    <div className="dashboard-chart-title">Source Languages</div>
                    <div className="dashboard-chart-divider"></div>
                    <div className="dashboard-dropdown-row"><LanguageDropdown /></div>
                    <div className="dashboard-chart-content"><Pie data={languageData} /></div>
                </div>
                <div className="dashboard-chart-card">
                    <div className="dashboard-chart-title">Interested Languages</div>
                    <div className="dashboard-chart-divider"></div>
                    <div className="dashboard-dropdown-row"><LanguageDropdown /></div>
                    <div className="dashboard-chart-content"><Bar data={interestedLanguageData} /></div>
                </div>
                <div className="dashboard-chart-card">
                    <div className="dashboard-chart-title">Streak Distribution</div>
                    <div className="dashboard-chart-divider"></div>
                    <div className="dashboard-dropdown-row"><LanguageDropdown /></div>
                    <div className="dashboard-chart-content"><Bar data={streakData} /></div>
                </div>
                <div className="dashboard-chart-card">
                    <div className="dashboard-chart-title">Certificates Earned Over Time</div>
                    <div className="dashboard-chart-divider"></div>
                    <div className="dashboard-dropdown-row"><LanguageDropdown /></div>
                    <div className="dashboard-chart-content"><Line data={certificateData} /></div>
                </div>
            </div>
        </div>
    </>
);

export default DashboardCharts; 