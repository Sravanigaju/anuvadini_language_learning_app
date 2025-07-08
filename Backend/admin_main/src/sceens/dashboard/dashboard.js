import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import AdminHeader from "../../components/header/Dashboar-Header";
import {
  FaUsers,
  FaUserCheck,
  FaUserPlus,
  FaCertificate,
  FaFire,
  FaGlobe
} from "react-icons/fa";
import DashboardCharts from './DashboardCharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

// Add internal CSS for the chart grid
const dashboardChartsGridStyle = `
.dashboard-charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
`;

const Dashboard = () => {
  // Sample data placeholders
  const ageData = {
    labels: ["10-19", "20-29", "30-39", "40-49", "50+"],
    datasets: [{
      label: "Users",
      data: [120, 400, 300, 150, 60],
      backgroundColor: "#286bda",
    }],
  };

  const languageData = {
    labels: ["Hindi", "English", "Spanish", "French"],
    datasets: [{
      data: [300, 500, 200, 100],
      backgroundColor: ["#286bda", "#35a854", "#e78c32", "#A835A8"],
    }],
  };

  const interestedLanguageData = {
    labels: ["French", "German", "Japanese", "Spanish"],
    datasets: [{
      label: "Learners",
      data: [250, 180, 150, 120],
      backgroundColor: "#35a854",
    }],
  };

  const xpProgressionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Total XP",
      data: [50000, 70000, 90000, 110000, 130000, 160000],
      fill: true,
      backgroundColor: "rgba(40, 107, 218, 0.2)",
      borderColor: "#286bda",
    }],
  };

  const streakData = {
    labels: ["0-3", "4-7", "8-14", "15+"],
    datasets: [{
      label: "Users",
      data: [150, 120, 90, 45],
      backgroundColor: "#e78c32",
    }],
  };

  const certificateData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Certificates",
      data: [50, 70, 90, 120, 140, 160],
      fill: true,
      backgroundColor: "rgba(168, 53, 168, 0.2)",
      borderColor: "#A835A8",
    }],
  };

  return (
    <>
      <style>{dashboardChartsGridStyle}</style>
      <div>
        <AdminHeader />
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          {/* Sidebar */}
          <aside style={{ width: '11rem', backgroundColor: '#286bda', color: 'white', padding: '1.5rem 1rem', position: 'fixed', height: '100vh', overflowY: 'auto', left: 0, top: '3.875rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>LrN Admin</h2>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={navItemStyle}>Dashboard</li>
                <li style={navItemStyle}>Manage Users</li>
                <li style={navItemStyle}>Reports & Analytics</li>
                <li style={navItemStyle}>Settings</li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, backgroundColor: '#f8fafe', padding: '2rem', marginLeft: '14rem', marginTop: '3.875rem' }}>
            <header style={{ marginBottom: '2rem' }}>
              <h1 style={{ color: '#286bda' }}>Welcome Admin 👋</h1>
              <p style={{ color: '#444' }}>Insights about users, activities, and growth.</p>
            </header>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {cardData.map(({ icon, label, value, bg }, idx) => (
                <div key={idx} style={{ ...cardStyle, backgroundColor: bg }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <div style={{ fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '1.25rem' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ color: '#286bda' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button style={buttonStyle}>👥 Manage Users</button>
                <button style={buttonStyle}>➕ Upload Lesson</button>
                <button style={buttonStyle}>📊 View Reports</button>
              </div>
            </section>

            {/* Charts Section */}
            <DashboardCharts
              ageData={ageData}
              languageData={languageData}
              interestedLanguageData={interestedLanguageData}
              xpProgressionData={xpProgressionData}
              streakData={streakData}
              certificateData={certificateData}
              className="dashboard-charts-grid"
            />
          </main>
        </div>
      </div>
    </>
  );
};

const navItemStyle = {
  margin: '1rem 0',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '500'
};

const cardStyle = {
  flex: '1 1 200px',
  color: 'white',
  borderRadius: '10px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const buttonStyle = {
  backgroundColor: '#286bda',
  color: 'white',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '14px'
};

const cardData = [
  { icon: <FaUsers />, label: "Total Users", value: "12,340", bg: "#286bda" },
  { icon: <FaUserCheck />, label: "Active Users", value: "3,200", bg: "#35a854" },
  { icon: <FaUserPlus />, label: "New Users", value: "480", bg: "#e78c32" },
  { icon: <FaCertificate />, label: "Certificates", value: "1,120", bg: "#A835A8" },
  { icon: <FaFire />, label: "Avg Daily Active", value: "150", bg: "#ff5c5c" },
  { icon: <FaGlobe />, label: "Countries", value: "42", bg: "#1E90FF" },
];

export default Dashboard;
