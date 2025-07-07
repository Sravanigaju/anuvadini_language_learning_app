import React from "react";
import { FaBook, FaClipboardList, FaGlobe, FaUserCheck, FaCheckCircle } from "react-icons/fa";
import AdminHeader from "../../components/header/Dashboar-Header";

const Dashboard = () => {
  return  (
    <div>
      <AdminHeader />
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#286bda', color: 'white', padding: '1.5rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>LrN Admin</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={navItemStyle}>Dashboard</li>
            <li style={navItemStyle}>Upload Content</li>
            <li style={navItemStyle}>Create Question Paper</li>
            <li style={navItemStyle}>Pending Submissions</li>
            <li style={navItemStyle}>Manage Languages</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, backgroundColor: '#f8fafe', padding: '2rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#286bda' }}>Hello Expert! 👋</h1>
          <p style={{ color: '#444' }}>Manage language content, question papers, and submissions all in one place.</p>
        </header>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {cardData.map(({ icon, label, value, bg }, idx) => (
            <div key={idx} style={{ ...cardStyle, backgroundColor: bg }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '1.25rem' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ color: '#286bda' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button style={buttonStyle}>➕ Upload Lesson</button>
            <button style={buttonStyle}>📝 Add Question</button>
            <button style={buttonStyle}>👁 Review Submissions</button>
          </div>
        </section>
      </main>
    </div>
    </div>
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
  { icon: <FaBook />, label: "Total Lessons", value: "1.2K", bg: "#286bda" },
  { icon: <FaClipboardList />, label: "Question Papers", value: "450", bg: "#35a854" },
  { icon: <FaCheckCircle />, label: "Pending Reviews", value: "120", bg: "#e78c32" },
  { icon: <FaGlobe />, label: "Languages", value: "18", bg: "#A835A8" },
  { icon: <FaUserCheck />, label: "Active Experts", value: "75", bg: "#1E90FF" },
];

export default Dashboard;