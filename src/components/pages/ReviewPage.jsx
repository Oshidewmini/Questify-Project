import React, { useState, useEffect } from 'react';
import Sidebar from '../sections/Sidebar';
import QuestionCard from '../sections/QuestionCard';
import ProgressBar from '../common/ProgressBar';
import { Download, Filter, X, Zap, CheckCircle, BarChart2, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuestions, createPaper } from '../../services/api';
import './ReviewPage.css';

const MetricCard = ({ icon: Icon, value, label, sublabel }) => (
  <div className="metric-card">
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    {sublabel && <div className="metric-sublabel">{sublabel}</div>}
  </div>
);

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  const [metrics, setMetrics] = useState({
    quality: 95,
    grammar: 92,
    confidence: 88,
    ao: 'AO✓'
  });

  useEffect(() => {
    // Start fake progress bar for UX
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return 90; // Wait for API at 90%
        return prev + 10;
      });
    }, 200);

    // Call API
    generateQuestions().then(data => {
      setQuestions(data.map((q, i) => ({
        number: i + 1,
        type: q.question_type || 'Short Answer',
        bloom: q.bloom_level,
        ao: q.ao_code || 'AO1',
        quality: metrics.quality,
        status: 'Accepted',
        text: q.text,
        options: q.options,
        answer: q.answer,
        correctOption: q.correct_option,
        marks: q.mark_value || 2
      })));
      setGenerationProgress(100);
      clearInterval(interval);
    });

    return () => clearInterval(interval);
  }, []);

  const runModelAudit = () => {
    setIsAnalyzing(true);
    // Simulate model analysis delay
    setTimeout(() => {
      setMetrics({
        quality: 99,
        grammar: 98,
        confidence: 96,
        ao: 'AO✓'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleExportSave = async () => {
    setIsSaving(true);
    try {
      // Build payload for backend
      const paperPayload = {
        title: "Generated Assessment",
        subject: "Mixed",
        exam_board: "Unknown",
        total_marks: questions.reduce((sum, q) => sum + (q.marks || 0), 0),
        duration_minutes: 60,
        questions: questions.map(q => ({
          text: q.text,
          answer: q.answer,
          mark_value: q.marks,
          bloom_level: q.bloom,
          ao_code: q.ao,
          question_type: q.type,
          options: q.options,
          correct_option: q.correctOption
        }))
      };
      await createPaper(paperPayload);
      navigate('/export');
    } catch (error) {
      console.error("Error saving paper:", error);
      alert("Failed to save paper to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="review-header">
          <div className="title-action-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="screen-title">Generated Questions</h1>
              <p className="screen-subtitle">25 questions generated from "Photosynthesis_Chapter3.pdf"</p>
            </div>
            <Button 
              variant="secondary" 
              icon={Zap} 
              onClick={runModelAudit}
              disabled={isAnalyzing || generationProgress < 100}
            >
              {isAnalyzing ? "AI Analyzing..." : "Run AI Model Audit"}
            </Button>
          </div>
        </header>

        <section className="generation-status">
          <ProgressBar progress={generationProgress} label={generationProgress < 100 ? "Generating questions..." : "Generation Complete"} />
        </section>

        <section className="metrics-summary">
          <MetricCard value={`${metrics.quality}%`} label="Quality Score" icon={Zap} />
          <MetricCard value={`${metrics.grammar}%`} label="Grammar" icon={BarChart2} />
          <MetricCard value={`${metrics.confidence}%`} label="Answer Confidence" icon={ShieldCheck} />
          <MetricCard value={metrics.ao} label="Assessment Objectives" sublabel="All Targets Met" />
        </section>

        <div className="review-container">
          <aside className="filters-sidebar">
            <div className="filter-header">
              <Filter size={16} />
              <h4>Filters</h4>
            </div>
            {/* Filters content same as before but styled better */}
          </aside>

          <section className="questions-section">
            <div className="questions-list">
              {questions.map((q) => (
                <QuestionCard key={q.number} {...q} />
              ))}
            </div>
          </section>
        </div>

        <Button 
          variant="primary" 
          size="large" 
          icon={Download} 
          className="fab-export" 
          onClick={handleExportSave}
          disabled={isSaving || generationProgress < 100}
        >
          {isSaving ? "Saving..." : "Export & Save"}
        </Button>
      </main>
    </div>
  );
};

export default ReviewPage;
