import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import ProgressBar from '../common/ProgressBar';
import { BarChart3, TrendingUp, Target, Award, FileText, Sparkles, BookOpen, Layers } from 'lucide-react';
import { getPapers, getQuestions, toDate } from '../../data/db';
import { BLOOM_COLORS } from '../../data/questionTypes';
import { useAuth } from '../../context/AuthContext';
import { useGenerate } from '../../context/GenerateContext';
import './AnalyticsPage.css';

const BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const AO_META = [
  { code: 'AO1', label: 'AO1: Knowledge' },
  { code: 'AO2', label: 'AO2: Application' },
  { code: 'AO3', label: 'AO3: Analysis & Evaluation' },
];

const WEEK_COUNT = 5;

const matchesKey = (value, expected) =>
  String(value || '').trim().toLowerCase() === String(expected).trim().toLowerCase();

const lookupDistValue = (dist, key) => {
  if (!dist || typeof dist !== 'object') return null;
  const entry = Object.entries(dist).find(([k]) => matchesKey(k, key));
  if (!entry) return null;
  const n = Number(entry[1]);
  return Number.isFinite(n) ? n : null;
};

const averagePaperTarget = (papers, field, key) => {
  const values = papers
    .map((p) => lookupDistValue(p[field], key))
    .filter((n) => n != null);
  if (!values.length) return null;
  return Math.round(values.reduce((sum, n) => sum + n, 0) / values.length);
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatWeekLabel = (start) =>
  start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const AnalyticsPage = () => {
  const { user } = useAuth();
  const { libraryEpoch } = useGenerate();
  const [questions, setQuestions] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.message || 'Failed to load analytics.');
        setQuestions([]);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, libraryEpoch]);

  const summary = useMemo(() => {
    const subjects = new Set([
      ...papers.map((p) => p.subject).filter(Boolean),
      ...questions.map((q) => q.subject).filter(Boolean),
    ]);
    const topics = new Set(questions.map((q) => q.topic).filter(Boolean));
    return {
      totalPapers: papers.length,
      totalQuestions: questions.length,
      subjectCount: subjects.size,
      topicCount: topics.size,
    };
  }, [papers, questions]);

  const bloomDistribution = useMemo(() => {
    const total = questions.length;
    return BLOOM_LEVELS.map((level) => {
      const count = questions.filter((q) => matchesKey(q.bloom_level, level)).length;
      const progress = total ? Math.round((count / total) * 100) : 0;
      const targetPct = averagePaperTarget(papers, 'bloom_distribution', level);
      return {
        label: `${level} (${progress}%)`,
        progress,
        target: targetPct != null ? `${targetPct}%` : undefined,
        color: BLOOM_COLORS[level],
      };
    });
  }, [questions, papers]);

  const assessmentObjectives = useMemo(() => {
    const total = questions.length;
    return AO_META.map((ao) => {
      const count = questions.filter((q) => matchesKey(q.ao_code, ao.code)).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      const targetPct = averagePaperTarget(papers, 'ao_distribution', ao.code);
      const onTarget = targetPct != null && Math.abs(pct - targetPct) <= 5;
      return {
        label: ao.label,
        value: `${pct}%`,
        target: targetPct != null ? `${targetPct}%` : null,
        status: targetPct == null ? null : onTarget ? 'success' : 'warning',
      };
    });
  }, [questions, papers]);

  const weeklyVolume = useMemo(() => {
    const thisWeekStart = startOfWeek(new Date());
    const weeks = Array.from({ length: WEEK_COUNT }, (_, i) => {
      const offset = WEEK_COUNT - 1 - i;
      const start = new Date(thisWeekStart);
      start.setDate(start.getDate() - offset * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { start, end, count: 0, label: formatWeekLabel(start) };
    });

    questions.forEach((q) => {
      const t = toDate(q.created_at);
      if (!t) return;
      const bucket = weeks.find((w) => t >= w.start && t < w.end);
      if (bucket) bucket.count += 1;
    });

    const max = Math.max(1, ...weeks.map((w) => w.count));
    return weeks.map((w) => ({ ...w, heightPct: Math.round((w.count / max) * 100) }));
  }, [questions]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Analytics & Insights</h1>
          <p className="screen-subtitle">Track your question generation patterns and coverage metrics</p>
        </header>

        <div className="page-body">
          {loading ? (
            <p className="analytics-status">Loading analytics...</p>
          ) : error ? (
            <div className="empty-state">
              <FileText size={48} color="var(--color-border)" />
              <p>{error}</p>
            </div>
          ) : papers.length === 0 && questions.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} color="var(--color-border)" />
              <p>Generate an exam to see analytics.</p>
            </div>
          ) : (
            <>
              <section className="analytics-summary-grid">
                <div className="analytics-summary-card">
                  <div className="analytics-summary-icon">
                    <FileText size={20} />
                  </div>
                  <span className="analytics-summary-value">{summary.totalPapers}</span>
                  <span className="analytics-summary-label">Papers</span>
                </div>
                <div className="analytics-summary-card">
                  <div className="analytics-summary-icon">
                    <Sparkles size={20} />
                  </div>
                  <span className="analytics-summary-value">{summary.totalQuestions}</span>
                  <span className="analytics-summary-label">Questions</span>
                </div>
                <div className="analytics-summary-card">
                  <div className="analytics-summary-icon">
                    <BookOpen size={20} />
                  </div>
                  <span className="analytics-summary-value">{summary.subjectCount}</span>
                  <span className="analytics-summary-label">Subjects</span>
                </div>
                <div className="analytics-summary-card">
                  <div className="analytics-summary-icon">
                    <Layers size={20} />
                  </div>
                  <span className="analytics-summary-value">{summary.topicCount}</span>
                  <span className="analytics-summary-label">Topics</span>
                </div>
              </section>

              {questions.length === 0 ? (
                <div className="empty-state analytics-note">
                  <p>These papers have no saved questions, so Bloom, AO, and volume charts cannot be computed yet.</p>
                </div>
              ) : (
                <>
              <section className="analytics-grid">
                <div className="analytics-card">
                  <h3 className="section-title"><Award size={20} /> Bloom&apos;s Taxonomy Distribution</h3>
                  <div className="bloom-distribution-list">
                    {bloomDistribution.map((item) => (
                      <ProgressBar
                        key={item.label}
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
                    {assessmentObjectives.map((ao) => (
                      <div key={ao.label} className="ao-metric-card">
                        <span className="ao-value">{ao.value}</span>
                        <span className="ao-label">{ao.label}</span>
                        {ao.target && (
                          <span className={`ao-status ${ao.status}`}>
                            {ao.status === 'success' ? '✓' : '⚠'} Target: {ao.target}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="quality-trends">
                <div className="analytics-card">
                  <h3 className="section-title"><TrendingUp size={20} /> Questions generated (last 30 days)</h3>
                  {weeklyVolume.every((w) => w.count === 0) ? (
                    <div className="chart-placeholder">
                      <BarChart3 size={48} color="var(--color-border)" />
                      <p>No questions generated in the last 30 days.</p>
                    </div>
                  ) : (
                    <div className="volume-chart" role="img" aria-label="Questions generated per week over the last 5 weeks">
                      {weeklyVolume.map((week) => (
                        <div key={week.start.toISOString()} className="volume-bar-col">
                          <span className="volume-bar-count">{week.count}</span>
                          <div className="volume-bar-track">
                            <div
                              className="volume-bar-fill"
                              style={{ height: `${week.heightPct}%` }}
                            />
                          </div>
                          <span className="volume-bar-label">{week.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
