import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Sun, Moon, LayoutDashboard, FileText, Database, Settings, School } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate Exam', icon: Sparkles },
    { id: 'bank', label: 'Question Bank', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="glass-card" style={{ margin: '1rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--accent-gradient-glow)'
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '700', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Questify AI
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Bloom's Taxonomy Assessment Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--bg-secondary)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: School info + Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-tertiary)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <School size={15} color="var(--accent-secondary)" />
            <span>Lyceum Intl School</span>
          </div>

          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform var(--transition-fast)'
            }}
          >
            {theme === 'light' ? <Moon size={20} color="#6366F1" /> : <Sun size={20} color="#F59E0B" />}
          </button>
        </div>

      </div>
    </header>
  );
}
