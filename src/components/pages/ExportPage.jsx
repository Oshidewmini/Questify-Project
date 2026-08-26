import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../sections/Sidebar';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useGenerate } from '../../context/GenerateContext';
import { getPaperById, getQuestionsByPaperId } from '../../data/db';
import { buildExportPayload, downloadBlob, exportDocx } from '../../services/api';
import { sumTypeCounts } from '../../data/questionTypes';
import './ExportPage.css';

const ExportPage = () => {
  const navigate = useNavigate();
  const {
    paperId, docTitle, boardLabel, levelLabel, subject, duration,
    generatedQuestions, totalMarks, typeCounts,
  } = useGenerate();

  const [paper, setPaper] = useState(null);
  const [questions, setQuestions] = useState(generatedQuestions || []);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!paperId) {
        if (!generatedQuestions.length) navigate('/upload');
        return;
      }
      try {
        const saved = await getPaperById(paperId);
        const qs = await getQuestionsByPaperId(paperId);
        if (saved) setPaper(saved);
        if (qs?.length) setQuestions(qs);
      } catch (err) {
        setError(err.message || 'Could not load saved paper.');
      }
    };
    load();
  }, [paperId]);

  const header = useMemo(() => ({
    title: paper?.title || docTitle,
    exam_board: paper?.exam_board || boardLabel,
    qualification_level: paper?.qualification_level || levelLabel,
    subject: paper?.subject || subject,
    duration_minutes: paper?.duration_minutes || duration,
  }), [paper, docTitle, boardLabel, levelLabel, subject, duration]);

  const marks = paper?.total_marks || totalMarks || questions.reduce((s, q) => s + (q.mark_value || q.marks || 0), 0);
  const count = paper?.question_count || questions.length || sumTypeCounts(typeCounts);

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const blob = await exportDocx(buildExportPayload(header, questions));
      const filename = `${(header.title || 'question_paper').replace(/[^A-Za-z0-9]+/g, '_')}.docx`;
      downloadBlob(blob, filename);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Download failed.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Export & Finalize</h1>
          <p className="screen-subtitle">Download an editable Word paper. The file is not stored in the database.</p>
        </header>

        <section className="export-flow">
          <div className="wizard-step">
            <div className="step-content download-step">
              <div className="success-banner">
                <CheckCircle size={64} color="var(--color-success)" />
                <h3>{header.title || 'Your paper is ready'}</h3>
                <p className="text-medium">
                  {header.exam_board} · {header.qualification_level} · {header.subject}
                </p>
                <p className="text-small text-medium" style={{ marginTop: 8 }}>
                  {count} questions · {marks} marks · {header.duration_minutes} minutes
                </p>
              </div>

              {error && <p className="extract-error">{error}</p>}

              <div className="download-options">
                <div className="download-card">
                  <FileText size={24} />
                  <div className="dl-info">
                    <strong>Question paper + answer key</strong>
                    <p className="caption text-medium">Microsoft Word (.docx)</p>
                  </div>
                  <Button
                    variant="success"
                    icon={Download}
                    disabled={downloading || !questions.length}
                    onClick={handleDownload}
                  >
                    {downloading ? 'Preparing…' : 'Download .docx'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="step-actions">
              <Button variant="secondary" onClick={() => navigate('/review')}>Back to review</Button>
              <Button variant="primary" onClick={() => navigate('/library')}>Go to Question Bank</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExportPage;
