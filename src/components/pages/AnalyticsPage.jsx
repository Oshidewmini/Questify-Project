import React from 'react';
import Sidebar from '../sections/Sidebar';
import ProgressBar from '../common/ProgressBar';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const bloomDistribution = [
    { label: 'Remember (20%)', progress: 20, target: '20%', color: '#42a5f5' },
    { label: 'Understand (25%)', progress: 25, target: '25%', color: '#66bb6a' },
    { label: 'Apply (20%)', progress: 20, target: '20%', color: '#ffa726' },
    { label: 'Analyze (20%)', progress: 20, target: '20%', color: '#ef5350' },
    { label: 'Evaluate (10%)', progress: 10, target: '10%', color: '#ab47bc' },
    { label: 'Create (5%)', progress: 5, target: '5%', color: '#26a69a' },
  ];

  const assessmentObjectives = [
    { label: 'AO1: Knowledge', value: '42%', target: '40%', status: 'success' },
    { label: 'AO2: Application', value: '36%', target: '35%', status: 'success' },
    { label: 'AO3: Analysis & Evaluation', value: '22%', target: '25%', status: 'warning' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Analytics & Insights</h1>
          <p className="screen-subtitle">Track your question generation patterns and quality metrics</p>
        </header>

        <section className="analytics-grid">
          <div className="analytics-card">
            <h3 className="section-title"><Award size={20} /> Bloom's Taxonomy Distribution</h3>
            <div className="bloom-distribution-list">
              {bloomDistribution.map((item, index) => (
                <ProgressBar 
                  key={index}
                  label={item.label}
                  progress={item.progress}
                  target={item.target}
                  color={item.color}
                />
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="section-title"><Target size={20} /> Cambridge Assessment Objectives</h3>
            <div className="ao-metrics-grid">
              {assessmentObjectives.map((ao, index) => (
                <div key={index} className="ao-metric-card">
                  <span className="ao-value">{ao.value}</span>
                  <span className="ao-label">{ao.label}</span>
                  <span className={`ao-status ${ao.status}`}>
                    {ao.status === 'success' ? '✓' : '⚠'} Target: {ao.target}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="quality-trends">
          <div className="analytics-card">
            <h3 className="section-title"><TrendingUp size={20} /> Quality Score Trends</h3>
            <div className="mock-chart">
              {/* This would be a real chart in a full app */}
              <div className="chart-placeholder">
                <BarChart3 size={48} color="var(--color-border)" />
                <p>Generation Quality vs Time (Last 30 Days)</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsPage;
