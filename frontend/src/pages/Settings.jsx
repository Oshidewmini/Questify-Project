import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, School, Sliders, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const [schoolName, setSchoolName] = useState('Lyceum International School');
  const [defaultExamBoard, setDefaultExamBoard] = useState('Cambridge');
  const [modelType, setModelType] = useState('T5-base (Quantized for Speed)');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem 2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>System & Curriculum Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure institutional presets, AI model defaults, and Bloom's Taxonomy parameters.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        
        {/* Institution Settings */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <School size={20} color="var(--accent-primary)" />
            Institution & School Profile
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Default Curriculum Assessment Board
              </label>
              <select
                value={defaultExamBoard}
                onChange={(e) => setDefaultExamBoard(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              >
                <option value="Cambridge">Cambridge Assessment International Education (CAIE)</option>
                <option value="Edexcel">Pearson Edexcel International</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI & Infrastructure Settings */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-primary)" />
            AI & Model Quantization Configuration
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Question Generation Model Architecture
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            >
              <option value="T5-base (Quantized for Speed)">T5-base (INT8 Quantized - Fast & Efficient for Standard PCs)</option>
              <option value="T5-large">T5-large (High Precision - Requires Dedicated GPU)</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              T5-base quantization reduces memory usage to sustain execution on 8GB RAM local teacher machines.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '0.8rem 1.6rem' }}>
            <Save size={18} /> Save Settings
          </button>
          {savedMessage && (
            <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.9rem' }}>
              ✓ Settings saved successfully!
            </span>
          )}
        </div>

      </div>

    </div>
  );
}
