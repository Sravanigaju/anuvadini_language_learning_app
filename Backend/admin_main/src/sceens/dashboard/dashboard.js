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
  FaGlobe,
} from "react-icons/fa";
import '../css/dashboard.css'; // Optional for additional custom styles

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

const Dashboard = () => {
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
    <div>
      <AdminHeader />
      <div className="d-flex" style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
        {/* Sidebar */}
        <aside className="bg-primary text-white p-3 position-fixed h-100" style={{ width: "12rem", top: "3.875rem", left: 0 }}>
          <h2 className="fs-4 mb-4">LrN Admin</h2>
          <nav>
            <ul className="list-unstyled">
              <li className="mb-3 cursor-pointer">Dashboard</li>
              <li className="mb-3 cursor-pointer">Manage Users</li>
              <li className="mb-3 cursor-pointer">Reports & Analytics</li>
              <li className="mb-3 cursor-pointer">Settings</li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 bg-light p-4" style={{ marginLeft: "12rem", marginTop: "3.875rem" }}>
          <header className="mb-4">
            <h1 className="text-primary">Welcome Admin 👋</h1>
            <p className="text-muted">Insights about users, activities, and growth.</p>
          </header>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            {cardData.map(({ icon, label, value, bg }, idx) => (
              <div key={idx} className="col-md-4 col-lg-3">
                <div className={`card text-white shadow`} style={{ backgroundColor: bg }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-4 mb-2">{icon}</div>
                    <div className="fw-semibold">{label}</div>
                    <div className="fs-5">{value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <section className="mb-4">
            <h2 className="text-primary">Quick Actions</h2>
            <div className="d-flex gap-2 mt-2 flex-wrap">
              <button className="btn btn-primary">👥 Manage Users</button>
              <button className="btn btn-primary">➕ Upload Lesson</button>
              <button className="btn btn-primary">📊 View Reports</button>
            </div>
          </section>

          {/* Charts Section */}
          <div className="row g-4">
            <div className="col-md-6">
              <h5>Age Distribution</h5>
              <Bar data={ageData} />
            </div>

            <div className="col-md-6">
              <h5>Source Languages</h5>
              <Pie data={languageData} />
            </div>

            <div className="col-md-6">
              <h5>Interested Languages</h5>
              <Bar data={interestedLanguageData} />
            </div>

            <div className="col-md-6">
              <h5>XP Progression</h5>
              <Line data={xpProgressionData} />
            </div>

            <div className="col-md-6">
              <h5>Streak Distribution</h5>
              <Bar data={streakData} />
            </div>

            <div className="col-md-6">
              <h5>Certificates Earned Over Time</h5>
              <Line data={certificateData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
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
