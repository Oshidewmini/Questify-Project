import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import { FileText, Plus, Activity, Search, Bell, Sparkles, BookOpen, Layers, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { getPapers, getQuestions, toDate } from '../../data/db';
import { useAuth } from '../../context/AuthContext';
import { useGenerate } from '../../context/GenerateContext';
import './DashboardPage.css';

const formatRelative = (value) => {
  const d = toDate(value);
  if (!d) return 'Generated recently';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Generated just now';
  if (mins < 60) return `Generated ${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Generated ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Generated yesterday';
  if (days < 7) return `Generated ${days} days ago`;
  return `Generated ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { libraryEpoch } = useGenerate();
  const [questions, setQuestions] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Teacher';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!user?.uid) return;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [qs, ps] = await Promise.all([getQuestions(), getPapers()]);
        setQuestions(qs);
        setPapers(ps);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.');
        setQuestions([]);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, libraryEpoch]);

  const subjects = useMemo(() => new Set([
    ...papers.map((p) => p.subject).filter(Boolean),
    ...questions.map((q) => q.subject).filter(Boolean),
  ]), [papers, questions]);

  const topics = useMemo(() => {
    const fromQuestions = questions.map((q) => q.topic).filter(Boolean);
    if (fromQuestions.length) return new Set(fromQuestions);
    return new Set(papers.flatMap((p) => p.topic_labels || []).filter(Boolean));
  }, [papers, questions]);

  const stats = [
    { label: 'Total Questions', value: questions.length, icon: Sparkles, color: '#1a5f7a', bg: '#e0f2f1' },
    { label: 'Exams Ready', value: papers.length, icon: FileText, color: '#2c8c99', bg: '#e0f7fa' },
    { label: 'Subjects', value: subjects.size, icon: BookOpen, color: '#f4a261', bg: '#fff3e0' },
    { label: 'Topics', value: topics.size, icon: Layers, color: '#06d6a0', bg: '#e8f5e9' },
  ];

  const recentPapers = papers.slice(0, 5).map((paper) => ({
    id: paper.id,
    title: paper.title || 'Untitled assessment',
    subject: paper.subject || 'Subject not set',
    date: formatRelative(paper.created_at),
    questions: questions.filter((q) => q.paperId === paper.id).length || paper.question_count || 0,
  }));

  const latestPaper = papers[0];
  const latestSubject = latestPaper?.subject || latestPaper?.title;

  const syllabusBars = useMemo(() => {
    const counts = {};
    papers.forEach((p) => {
      const key = p.exam_board || p.qualification_level;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = papers.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        width: Math.round((count / total) * 100),
        count,
      }));
  }, [papers]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <nav className="top-nav">
          <div className="search-container">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search templates, papers, or questions..." readOnly onFocus={() => navigate('/library')} />
          </div>
          <div className="nav-user-area">
            <button className="icon-btn" type="button" aria-label="Notifications"><Bell size={20} /></button>
            <div className="user-pill" onClick={() => navigate('/settings')} role="button" tabIndex={0}>
              <span className="user-pill-initial">{initial}</span>
              <span>{displayName}</span>
            </div>
          </div>
        </nav>

        <div className="dashboard-body">
          <header className="welcome-hero">
            <div className="hero-content">
              <h1>Welcome back, <span className="highlight-name">{displayName}!</span></h1>
              <p>
                {papers.length
                  ? 'Ready to create a new exam? Your recent papers are ready in the library.'
                  : 'Ready to create your first exam? Start from a syllabus topic and generate questions with AI.'}
              </p>
              <div className="hero-actions">
                <Button variant="primary" icon={Plus} size="large" onClick={() => navigate('/upload')}>Start New Exam</Button>
              </div>
            </div>
          </header>

          {loading ? (
            <p className="dashboard-status">Loading dashboard...</p>
          ) : error ? (
            <p className="dashboard-status">{error}</p>
          ) : (
            <>
              <section className="stats-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card">
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
                  {recentPapers.length === 0 ? (
                    <p className="dashboard-empty">No assessments yet. Start a new exam to see them here.</p>
                  ) : (
                    <div className="recent-papers-list">
                      {recentPapers.map((paper) => (
                        <div
                          key={paper.id}
                          className="recent-paper-card"
                          onClick={() => navigate('/library')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') navigate('/library'); }}
                        >
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <div className="dashboard-sidebar">
                  <section className="section-card ai-suggestion">
                    <h4><Sparkles size={18} /> AI Suggestion</h4>
                    <p className="suggestion-text">
                      {latestPaper
                        ? <>You recently created a <strong>{latestSubject}</strong> paper. Would you like to generate a <strong>Revision Quiz</strong> based on those same topics?</>
                        : <>Generate your first exam to get topic-based suggestions here.</>}
                    </p>
                    <Button variant="secondary" size="small" style={{ width: '100%' }} onClick={() => navigate('/upload')}>
                      {latestPaper ? 'Try Assistant Suggestions' : 'Generate your first exam'}
                    </Button>
                  </section>

                  {syllabusBars.length > 0 && (
                    <section className="section-card quick-stats" style={{ marginTop: '24px' }}>
                      <div className="section-header">
                        <h3>Syllabus Reach</h3>
                      </div>
                      <div className="progress-list">
                        {syllabusBars.map((bar) => (
                          <div key={bar.label} className="progress-item">
                            <span>{bar.label} ({bar.count})</span>
                            <div className="mini-progress"><div className="fill" style={{ width: `${bar.width}%` }}></div></div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </>
          )}
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
