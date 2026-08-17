import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, LayoutDashboard, Wand2, Database, BarChart2, Settings, Sun, Moon, GraduationCap } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generate', label: 'Generate Exam', icon: Wand2 },
  { id: 'bank', label: 'Question Bank', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={18} color="#fff" />
        </div>
        <div className="sidebar-brand-text">
          <h2>Questify</h2>
          <span>AI Assessment Engine</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-section-label">Main Menu</div>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item ${activeTab === id || (activeTab === 'review' && id === 'generate') ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
        >
          <Icon size={17} />
          {label}
        </button>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.25rem', marginBottom: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.08)' }}>
          <GraduationCap size={15} color="var(--accent-primary)" />
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-primary)' }}>Lyceum Intl School</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Cambridge & Edexcel</div>
          </div>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#6366F1" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
