import React from 'react';
import Sidebar from '../sections/Sidebar';
import { FileText, Clock, Plus, Zap, Activity, Search, Bell, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Questions', value: '1,256', icon: Sparkles, color: '#1a5f7a', bg: '#e0f2f1' },
    { label: 'Exams Ready', value: '42', icon: FileText, color: '#2c8c99', bg: '#e0f7fa' },
    { label: 'Hours Saved', value: '124h', icon: Clock, color: '#f4a261', bg: '#fff3e0' },
    { label: 'Accuracy', value: '98%', icon: TrendingUp, color: '#06d6a0', bg: '#e8f5e9' }
  ];

  const recentPapers = [
    { 
      title: 'O-Level Biology - Photosynthesis', 
      date: 'Generated 2 hours ago', 
      questions: 25, 
      quality: 98,
      subject: 'Science'
    },
    { 
      title: 'GCSE Physics - Energy Waves', 
      date: 'Generated 5 hours ago', 
      questions: 40, 
      quality: 94,
      subject: 'Physics'
    },
    { 
      title: 'A-Level Pure Math - Integration', 
      date: 'Generated yesterday', 
      questions: 30, 
      quality: 96,
      subject: 'Math'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <nav className="top-nav">
          <div className="search-container">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search templates, papers, or questions..." />
          </div>
          <div className="nav-user-area">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-pill">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop" alt="User" />
              <span>Mr. Smith</span>
            </div>
          </div>
        </nav>

        <div className="dashboard-body">
          <header className="welcome-hero">
            <div className="hero-content">
              <h1>Welcome back, <span className="highlight-name">Mr. Smith!</span></h1>
              <p>Ready to create a new exam? Your AI assistant has learned from your previous papers to suggest even better questions today.</p>
              <div className="hero-actions">
                <Button variant="primary" icon={Plus} size="large" onClick={() => navigate('/upload')}>Start New Exam</Button>
              </div>
            </div>
          </header>

          <section className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-main">
                  <div className="stat-icon-box" style={{ background: stat.bg }}>
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <div className="stat-mini-chart">
                  <Activity size={32} color={stat.color} style={{ opacity: 0.2 }} />
                </div>
              </div>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="section-card recent-activity">
              <div className="section-header">
                <h3>Recent Assessments</h3>
                <Button variant="ghost" size="small" icon={ChevronRight} onClick={() => navigate('/library')}>View Library</Button>
              </div>
              <div className="recent-papers-list">
                {recentPapers.map((paper, index) => (
                  <div key={index} className="recent-paper-card">
                    <div className="paper-info">
                      <div className="paper-icon-small">
                        <FileText size={20} color="var(--color-primary-dark)" />
                      </div>
                      <div className="paper-details">
                        <strong>{paper.title}</strong>
                        <span>{paper.date} • {paper.subject}</span>
                      </div>
                    </div>
                    <div className="paper-meta">
                      <span className="badge badge-bloom">{paper.questions} Qs</span>
                      <span className="badge badge-success">{paper.quality}% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="dashboard-sidebar">
              <section className="section-card ai-suggestion">
                <h4><Sparkles size={18} /> AI Suggestion</h4>
                <p className="suggestion-text">
                  You recently created a Biology paper. Would you like to generate a <strong>Revision Quiz</strong> based on those same topics?
                </p>
                <Button variant="secondary" size="small" style={{ width: '100%' }}>Try Assistant Suggestions</Button>
              </section>

              <section className="section-card quick-stats" style={{ marginTop: '24px' }}>
                <div className="section-header">
                  <h3>Syllabus Reach</h3>
                </div>
                <div className="progress-list">
                  <div className="progress-item">
                    <span>Cambridge IGCSE</span>
                    <div className="mini-progress"><div className="fill" style={{ width: '75%' }}></div></div>
                  </div>
                  <div className="progress-item">
                    <span>Edexcel A-Level</span>
                    <div className="mini-progress"><div className="fill" style={{ width: '40%' }}></div></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="large" 
          icon={Plus} 
          className="fab"
          onClick={() => navigate('/upload')}
        >
          New Exam
        </Button>
      </main>
    </div>
  );
};

export default DashboardPage;
