import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Sparkles, Database, LineChart, Settings,
  LogOut, Sun, Moon, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Teacher';

  // Default to dark (navy blue) theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const menuItems = [
    { title: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Generate Exam', icon: Sparkles,         path: '/upload' },
    { title: 'Question Bank', icon: Database,         path: '/library' },
    { title: 'Analytics',     icon: LineChart,        path: '/analytics' },
    { title: 'Settings',      icon: Settings,         path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-area">
        <div className="sidebar-logo-icon">Q</div>
        <div className="sidebar-logo-text">
          <span className="logo-name">Questify</span>
          <span className="logo-tagline">AI Assessment</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="nav-icon-wrap">
                <Icon size={18} />
              </div>
              <span className="nav-label">{item.title}</span>
              {isActive && <ChevronRight size={14} className="nav-chevron" />}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        {/* Theme toggle */}
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <div className="theme-toggle-track">
            <div className={`theme-toggle-thumb ${theme === 'light' ? 'light-active' : ''}`} />
          </div>
          <span className="theme-toggle-label">
            {theme === 'dark' ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
          </span>
        </button>

        {/* User profile */}
        <div className="sidebar-user">
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-email">{user?.email || ''}</span>
          </div>
          <button
            className="logout-icon-btn"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
