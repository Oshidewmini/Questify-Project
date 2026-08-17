import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import UploadConfigurePage from './components/pages/UploadConfigurePage';
import ReviewPage from './components/pages/ReviewPage';
import ExportPage from './components/pages/ExportPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import LibraryPage from './components/pages/LibraryPage';
import SettingsPage from './components/pages/SettingsPage';
import './styles/globals.css';

const Placeholder = ({ title }) => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1 style={{ color: 'var(--color-primary-dark)' }}>{title}</h1>
    <p>This feature is coming soon.</p>
    <a href="/dashboard" style={{ color: 'var(--color-secondary)' }}>Back to Dashboard</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadConfigurePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
