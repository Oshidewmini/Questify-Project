import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import { Search, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { getPapers, getQuestions } from '../../data/db';
import { buildExportPayload, downloadBlob, exportDocx } from '../../services/api';
import { QUESTION_TYPES } from '../../data/questionTypes';
import QuestionCard from '../sections/QuestionCard';
import { useAuth } from '../../context/AuthContext';
import { useGenerate } from '../../context/GenerateContext';
import './LibraryPage.css';

const LibraryPage = () => {
  const { user } = useAuth();
  const { libraryEpoch } = useGenerate();
  const [questions, setQuestions] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bloomFilter, setBloomFilter] = useState('all');
  const [aoFilter, setAoFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [paperFilter, setPaperFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

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
        setError(err.message || 'Failed to load question bank.');
        setQuestions([]);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid, libraryEpoch]);

  const subjects = [...new Set(questions.map((q) => q.subject).filter(Boolean))];
  const blooms = [...new Set(questions.map((q) => q.bloom_level).filter(Boolean))];
  const aos = [...new Set(questions.map((q) => q.ao_code).filter(Boolean))];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (typeFilter !== 'all' && q.question_type !== typeFilter) return false;
      if (bloomFilter !== 'all' && q.bloom_level !== bloomFilter) return false;
      if (aoFilter !== 'all' && q.ao_code !== aoFilter) return false;
      if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
      if (paperFilter !== 'all' && q.paperId !== paperFilter) return false;
      if (!term) return true;
      return [q.text, q.topic, q.subject, q.paperTitle, q.question_type]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [questions, search, typeFilter, bloomFilter, aoFilter, subjectFilter, paperFilter]);

  const handleDownloadPaper = async (paper) => {
    setDownloadingId(paper.id);
    try {
      const qs = questions.filter((q) => q.paperId === paper.id);
      const blob = await exportDocx(buildExportPayload({
        title: paper.title,
        exam_board: paper.exam_board,
        qualification_level: paper.qualification_level,
        subject: paper.subject,
        duration_minutes: paper.duration_minutes,
      }, qs));
      downloadBlob(blob, `${(paper.title || 'question_paper').replace(/[^A-Za-z0-9]+/g, '_')}.docx`);
    } catch (err) {
      alert(err.message || 'Download failed.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Question Bank</h1>
          <p className="screen-subtitle">Browse generated questions by type, Bloom&apos;s level, and topic</p>
        </header>

        <div className="page-body">
          <section className="library-controls">
            <div className="search-bar">
              <Input
                placeholder="Search questions, topics, or subjects..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="control-actions">
              <select className="select-input sort-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All types</option>
                {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select className="select-input sort-select" value={bloomFilter} onChange={(e) => setBloomFilter(e.target.value)}>
                <option value="all">All Bloom levels</option>
                {blooms.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="select-input sort-select" value={aoFilter} onChange={(e) => setAoFilter(e.target.value)}>
                <option value="all">All AOs</option>
                {aos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select className="select-input sort-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                <option value="all">All subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="select-input sort-select" value={paperFilter} onChange={(e) => setPaperFilter(e.target.value)}>
                <option value="all">All papers</option>
                {papers.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </section>

          {papers.length > 0 && (
            <section className="papers-list" style={{ marginBottom: 24 }}>
              {papers.map((paper) => (
                <div key={paper.id} className="paper-library-card">
                  <div className="paper-card-main">
                    <div className="paper-icon">
                      <FileText size={32} color="var(--color-primary-dark)" />
                    </div>
                    <div className="paper-info">
                      <h4>{paper.title}</h4>
                      <p className="text-small text-medium">
                        {paper.exam_board} · {paper.qualification_level} · {paper.subject}
                      </p>
                      <div className="paper-badges">
                        <span className="badge badge-info">{paper.total_marks || 0} Marks</span>
                        <span className="badge badge-success">{paper.question_count || 0} questions</span>
                        <span className="badge badge-primary">{paper.duration_minutes} Min</span>
                      </div>
                    </div>
                  </div>
                  <div className="paper-card-actions">
                    <Button
                      variant="secondary"
                      size="small"
                      icon={Download}
                      disabled={downloadingId === paper.id}
                      onClick={() => handleDownloadPaper(paper)}
                    >
                      {downloadingId === paper.id ? 'Preparing…' : 'Download .docx'}
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="questions-bank-list">
            {loading ? (
              <p className="library-status">Loading questions...</p>
            ) : error ? (
              <div className="empty-state">
                <FileText size={48} color="var(--color-border)" />
                <p>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} color="var(--color-border)" />
                <p>
                  {papers.length > 0 && questions.length === 0
                    ? 'These papers have no saved questions. Generate again or re-export to save questions to the bank.'
                    : questions.length === 0
                      ? 'No questions yet. Generate an exam to populate your question bank.'
                      : 'No questions match these filters.'}
                </p>
              </div>
            ) : (
              filtered.map((q) => {
                const open = expandedId === q.id;
                return (
                  <div key={q.id} className="question-bank-row">
                    <button className="question-bank-summary" onClick={() => setExpandedId(open ? null : q.id)}>
                      <div>
                        <p className="question-bank-stem">{q.text}</p>
                        <div className="paper-badges">
                          <span className="badge badge-type">{q.question_type}</span>
                          {q.bloom_level && <span className="badge badge-bloom">{q.bloom_level}</span>}
                          {q.ao_code && <span className="badge badge-success">{q.ao_code}</span>}
                          {q.topic && <span className="badge badge-primary">{q.topic}</span>}
                          {q.subject && <span className="badge badge-info">{q.subject}</span>}
                          <span className="badge">{q.mark_value} marks</span>
                        </div>
                      </div>
                      {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {open && (
                      <div className="question-bank-detail">
                        <QuestionCard
                          number=""
                          type={q.question_type}
                          bloom={q.bloom_level}
                          ao={q.ao_code}
                          topic={q.topic}
                          text={q.text}
                          options={q.options}
                          correctOption={q.correct_option}
                          answer={q.answer}
                          marks={q.mark_value}
                          parts={q.parts}
                          marking_scheme={q.marking_scheme}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
