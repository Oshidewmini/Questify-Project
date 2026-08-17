import React, { useState } from 'react';
import Sidebar from '../sections/Sidebar';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'school', name: 'School & Branding', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'localization', name: 'Localization', icon: Globe },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Settings</h1>
          <p className="screen-subtitle">Manage your account and platform preferences</p>
        </header>

        <div className="settings-container">
          <aside className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                <span>{tab.name}</span>
              </button>
            ))}
          </aside>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h3>Personal Profile</h3>
                <div className="form-grid">
                  <Input label="Full Name" defaultValue="Mr. John Smith" />
                  <Input label="Email Address" defaultValue="john.smith@school.com" />
                  <Input label="Job Title" defaultValue="Senior Biology Teacher" />
                  <Input label="Department" defaultValue="Science" />
                </div>
              </div>
            )}

            {activeTab === 'school' && (
              <div className="settings-section">
                <h3>School Branding</h3>
                <p className="section-desc">Customize how your generated papers look.</p>
                <div className="form-grid">
                  <Input label="School Name" defaultValue="Questify Academy International" />
                  <div className="input-wrapper">
                    <label>Default Syllabus</label>
                    <select className="select-input">
                      <option>Cambridge IGCSE</option>
                      <option>Edexcel International GCSE</option>
                      <option>AQA</option>
                    </select>
                  </div>
                  <div className="logo-upload">
                    <div className="logo-preview">QA</div>
                    <Button variant="secondary" size="small">Change Logo</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'localization' && (
              <div className="settings-section">
                <h3>Region & Language</h3>
                <div className="form-grid">
                  <div className="input-wrapper">
                    <label>Language</label>
                    <select className="select-input">
                      <option>English (UK)</option>
                      <option>English (US)</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div className="input-wrapper">
                    <label>Timezone</label>
                    <select className="select-input">
                      <option>GMT +05:30 (India/Sri Lanka)</option>
                      <option>GMT +00:00 (London)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-footer">
              <Button variant="primary" icon={Save}>Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
