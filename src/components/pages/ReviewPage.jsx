import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import QuestionCard from '../sections/QuestionCard';
import ProgressBar from '../common/ProgressBar';
import { Download, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { generateQuestions } from '../../services/api';
import { saveGeneratedAssessment } from '../../data/db';
import { useGenerate } from '../../context/GenerateContext';
import { QUESTION_TYPES, sumTypeCounts } from '../../data/questionTypes';
import './ReviewPage.css';

const MetricCard = ({ value, label, sublabel }) => (
  <div className="metric-card">
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    {sublabel && <div className="metric-sublabel">{sublabel}</div>}
  </div>
);

const mapQuestion = (q, i) => ({
  number: i + 1,
  type: q.question_type || 'Short Answer',
  bloom: q.bloom_level,
  ao: q.ao_code || 'AO1',
  topic: q.topic,
  text: q.text,
  options: q.options,
  answer: q.answer,
  correctOption: q.correct_option,
  marks: q.mark_value || 1,
  parts: q.parts,
  marking_scheme: q.marking_scheme,
  raw: q,
});

const generationCache = { nonce: null, promise: null };

const runGeneration = (nonce, generatePayload, paperMeta) => {
  if (generationCache.nonce === nonce && generationCache.promise) {
    return generationCache.promise;
  }
  generationCache.nonce = nonce;
  generationCache.promise = (async () => {
    try {
      const data = await generateQuestions(generatePayload);
      const saved = await saveGeneratedAssessment({
        ...paperMeta,
        total_marks: data.total_marks || 0,
        question_count: (data.questions || []).length,
      }, data.questions || []);
      return { data, saved };
    } catch (err) {
      generationCache.nonce = null;
      generationCache.promise = null;
      throw err;
    }
  })();
  return generationCache.promise;
};

const ReviewPage = () => {
  const navigate = useNavigate();
  const {
    extractedTopics, docTitle, boardLabel, levelLabel, subject,
    duration, typeCounts, bloomLevels, selectedTemplate,
    generatedQuestions, setGeneratedQuestions,
    generateWarnings, setGenerateWarnings,
    paperId, setPaperId, totalMarks, setTotalMarks,
    generationNonce,
  } = useGenerate();

  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bloomFilter, setBloomFilter] = useState('all');

  const questions = generatedQuestions.map(mapQuestion);
  const questionCount = sumTypeCounts(typeCounts);

  const computedAo = {
    AO1: (bloomLevels.Remember || 0) + (bloomLevels.Understand || 0),
    AO2: (bloomLevels.Apply || 0) + (bloomLevels.Analyze || 0),
    AO3: (bloomLevels.Evaluate || 0) + (bloomLevels.Create || 0),
  };

  useEffect(() => {
    if (!extractedTopics.length) {
      navigate('/upload');
      return;
    }
    if (!generationNonce) {
      if (generatedQuestions.length) setGenerationProgress(100);
      return;
    }
    if (generatedQuestions.length && paperId) {
      setGenerationProgress(100);
      return;
    }

    let cancelled = false;
    const interval = setInterval(() => {
      setGenerationProgress((prev) => (prev >= 90 ? 90 : prev + 2));
    }, 800);

    const run = async () => {
      try {
        const { data, saved } = await runGeneration(generationNonce, {
          topics: extractedTopics.map((t) => ({
            topic_label: t.topic_label,
            text: t.text,
          })),
          title: docTitle,
          exam_board: boardLabel,
          qualification_level: levelLabel,
          subject,
          duration_minutes: duration,
          type_counts: typeCounts,
          bloom_distribution: bloomLevels,
          template_type: selectedTemplate,
        }, {
          title: docTitle,
          subject,
          exam_board: boardLabel,
          qualification_level: levelLabel,
          template_type: selectedTemplate,
          type_counts: typeCounts,
          bloom_distribution: bloomLevels,
          ao_distribution: computedAo,
          duration_minutes: duration,
          topic_labels: extractedTopics.map((t) => t.topic_label),
        });
        if (cancelled) return;
        setGeneratedQuestions(data.questions || []);
        setTotalMarks(data.total_marks || 0);
        setGenerateWarnings(data.warnings || []);
        setGenerationProgress(100);
        setPaperId(saved.paper.id);
      } catch (err) {
        if (cancelled) return;
        const detail = err.response?.data?.detail || err.message || 'Generation failed.';
        setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        setGenerationProgress(0);
      } finally {
        clearInterval(interval);
      }
    };

    run();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [generationNonce]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (typeFilter !== 'all' && q.type !== typeFilter) return false;
      if (bloomFilter !== 'all' && q.bloom !== bloomFilter) return false;
      return true;
    });
  }, [questions, typeFilter, bloomFilter]);

  const uniqueTypes = [...new Set(questions.map((q) => q.type).filter(Boolean))];
  const uniqueBlooms = [...new Set(questions.map((q) => q.bloom).filter(Boolean))];
  const uniqueTopics = [...new Set(questions.map((q) => q.topic).filter(Boolean))];

  const handleExport = async () => {
    if (!paperId && questions.length) {
      setIsSaving(true);
      try {
        const saved = await saveGeneratedAssessment({
          title: docTitle,
          subject,
          exam_board: boardLabel,
          qualification_level: levelLabel,
          template_type: selectedTemplate,
          type_counts: typeCounts,
          bloom_distribution: bloomLevels,
          ao_distribution: computedAo,
          total_marks: totalMarks,
          question_count: questions.length,
          duration_minutes: duration,
          topic_labels: extractedTopics.map((t) => t.topic_label),
        }, generatedQuestions);
        setPaperId(saved.paper.id);
      } catch (err) {
        alert(err.message || 'Failed to save paper.');
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
    }
    navigate('/export');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="review-header">
          <div className="title-action-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="screen-title">Generated Questions</h1>
              <p className="screen-subtitle">
                {docTitle || 'Untitled assessment'} · {subject} · {boardLabel}
              </p>
            </div>
          </div>
        </header>

        <section className="generation-status">
          <ProgressBar
            progress={generationProgress}
            label={
              error
                ? 'Generation failed'
                : generationProgress < 100
                  ? `Generating ${questionCount} questions with Gemini… this can take a few minutes`
                  : 'Generation complete'
            }
          />
          {error && <p className="extract-error" style={{ marginTop: 12 }}>{error}</p>}
          {generateWarnings.length > 0 && generationProgress === 100 && (
            <p className="helper-text" style={{ marginTop: 8 }}>
              {generateWarnings.length} generation warning{generateWarnings.length === 1 ? '' : 's'}: {generateWarnings[0]}
            </p>
          )}
        </section>

        <section className="metrics-summary">
          <MetricCard value={questions.length} label="Questions" />
          <MetricCard value={totalMarks || questions.reduce((s, q) => s + (q.marks || 0), 0)} label="Total Marks" />
          <MetricCard value={`${duration}m`} label="Duration" />
          <MetricCard value={uniqueTopics.length || extractedTopics.length} label="Topics" />
        </section>

        <div className="review-container">
          <aside className="filters-sidebar">
            <div className="filter-header">
              <Filter size={16} />
              <h4>Filters</h4>
            </div>
            <label className="input-label">Question type</label>
            <select className="select-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              {(uniqueTypes.length ? uniqueTypes : QUESTION_TYPES.map(t => t.value)).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <label className="input-label" style={{ marginTop: 16 }}>Bloom&apos;s level</label>
            <select className="select-input" value={bloomFilter} onChange={(e) => setBloomFilter(e.target.value)}>
              <option value="all">All levels</option>
              {uniqueBlooms.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </aside>

          <section className="questions-section">
            <div className="questions-list">
              {filtered.map((q) => (
                <QuestionCard key={q.number} {...q} />
              ))}
              {generationProgress === 100 && filtered.length === 0 && (
                <p className="text-medium">No questions match these filters.</p>
              )}
            </div>
          </section>
        </div>

        <Button
          variant="primary"
          size="large"
          icon={Download}
          className="fab-export"
          onClick={handleExport}
          disabled={isSaving || generationProgress < 100 || !questions.length}
        >
          {isSaving ? 'Saving…' : 'Export paper'}
        </Button>
      </main>
    </div>
  );
};

export default ReviewPage;
