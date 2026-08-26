import React, { useEffect, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, profile, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setName(profile?.name ?? '');
    setJobTitle(profile?.jobTitle ?? '');
    setDepartment(profile?.department ?? '');
  }, [profile]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'school', name: 'School & Branding', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'localization', name: 'Localization', icon: Globe },
  ];

  const handleSave = async () => {
    if (activeTab !== 'profile') return;
    if (!name.trim() || !jobTitle.trim() || !department.trim()) {
      setStatus({ type: 'error', message: 'Please fill in name, job title, and department.' });
      return;
    }
    setStatus({ type: '', message: '' });
    setSaving(true);
    try {
      await updateProfile({ name, jobTitle, department });
      setStatus({ type: 'success', message: 'Profile saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Could not save profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Settings</h1>
          <p className="screen-subtitle">Manage your account and platform preferences</p>
        </header>

        <div className="page-body">
          <div className="settings-container">
            <aside className="settings-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setStatus({ type: '', message: '' });
                  }}
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
                    <Input
                      label="Full Name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={user?.email ?? ''}
                      disabled
                    />
                    <Input
                      label="Job Title"
                      placeholder="e.g. Senior Biology Teacher"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                    <Input
                      label="Department"
                      placeholder="e.g. Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
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
                {status.message && (
                  <p className={`settings-status settings-status-${status.type}`}>
                    {status.message}
                  </p>
                )}
                <Button
                  variant="primary"
                  icon={Save}
                  onClick={handleSave}
                  loading={saving}
                  disabled={activeTab !== 'profile' || saving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
