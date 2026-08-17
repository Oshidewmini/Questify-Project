import React, { useState, useEffect } from 'react';
import Sidebar from '../sections/Sidebar';
import { CloudUpload, File, Check, Sparkles, ArrowLeft, BookOpen, Info, Clock, Target } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useNavigate } from 'react-router-dom';
import {
  getBoardOptions, getLevelOptions, getSubjectOptions,
  getSubjectsByCategory, getDefaultBloom, getDefaultAoSplit, getAoProfile
} from '../../data/syllabi';
import { getTemplatesForBoard } from '../../data/paperTemplates';
import './UploadConfigurePage.css';

/* ============================================================
   Sub-components
============================================================ */

const BloomSlider = ({ label, value, onChange, color }) => (
  <div className="bloom-slider-container">
    <div className="bloom-slider-header">
      <span className="bloom-label">{label}</span>
      <span className="bloom-value" style={{ color }}>{value}%</span>
    </div>
    <input
      type="range" min="0" max="100" step="5"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="bloom-slider"
      style={{ accentColor: color }}
    />
    <div className="bloom-bar-track">
      <div className="bloom-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);


const BLOOM_COLORS = {
  Remember:   '#60a5fa',
  Understand: '#818cf8',
  Apply:      '#a78bfa',
  Analyze:    '#c084fc',
  Evaluate:   '#e879f9',
  Create:     '#f472b6'
};

const BLOOM_AO_MAP = {
  Remember:   'AO1', Understand: 'AO1',
  Apply:      'AO2', Analyze:    'AO2',
  Evaluate:   'AO3', Create:     'AO3'
};

/* ============================================================
   Question Type Options
============================================================ */
const QUESTION_TYPES = [
  { value: 'MCQ',          label: 'Multiple Choice (MCQ)' },
  { value: 'True/False',   label: 'True / False' },
  { value: 'Short Answer', label: 'Short Answer (SAQ)' },
  { value: 'Fill-in',      label: 'Fill in the Blank' },
  { value: 'Essay',        label: 'Essay / Extended Response' },
  { value: 'Structured',   label: 'Structured (Parts a, b, c)' },
  { value: 'Mixed',        label: 'Mixed (All Types)' }
];

/* ============================================================
   Main Component
============================================================ */
const UploadConfigurePage = () => {
  const navigate = useNavigate();

  // Step state
  const [activeTab, setActiveTab] = useState('upload');

  // Upload state
  const [file, setFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');

  // Syllabus cascade state
  const [boardId, setBoardId] = useState('cambridge-sri-lanka');
  const [levelId, setLevelId] = useState('cambridge-igcse');
  const [subject, setSubject] = useState('');

  // Config state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [questionType, setQuestionType] = useState('MCQ');
  const [questionCount, setQuestionCount] = useState(30);
  const [duration, setDuration] = useState(45);
  const [bloomLevels, setBloomLevels] = useState({
    Remember: 15, Understand: 20, Apply: 30, Analyze: 25, Evaluate: 10, Create: 0
  });
  const [aoSplit, setAoSplit] = useState({ AO1: 35, AO2: 45, AO3: 20 });

  // Derived data
  const boardOptions   = getBoardOptions();
  const levelOptions   = getLevelOptions(boardId);
  const subjectsByCat  = getSubjectsByCategory(boardId, levelId);
  const templates      = getTemplatesForBoard(boardId);
  const aoProfile      = getAoProfile(boardId);

  // Reset level and subject when board changes
  useEffect(() => {
    const firstLevel = getLevelOptions(boardId)[0];
    if (firstLevel) {
      setLevelId(firstLevel.id);
      setSubject('');
    }
  }, [boardId]);

  // Reset subject when level changes; load default Bloom/AO
  useEffect(() => {
    setSubject('');
    const bloom = getDefaultBloom(boardId, levelId);
    setBloomLevels(bloom);
    const ao = getDefaultAoSplit(boardId, levelId);
    setAoSplit(ao);
  }, [levelId]);

  // Apply template
  const applyTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setQuestionType(tpl.questionType);
    setQuestionCount(tpl.questionCount);
    setDuration(tpl.duration);
    setBloomLevels({ ...tpl.bloom });
    setAoSplit({ ...tpl.aoSplit });
  };

  const handleBloomChange = (level, value) => {
    setBloomLevels(prev => ({ ...prev, [level]: value }));
  };

  const totalBloom = Object.values(bloomLevels).reduce((a, b) => a + b, 0);
  const bloomValid = totalBloom === 100;

  // Compute AO split from Bloom values
  const computedAo = {
    AO1: (bloomLevels.Remember || 0) + (bloomLevels.Understand || 0),
    AO2: (bloomLevels.Apply || 0)    + (bloomLevels.Analyze || 0),
    AO3: (bloomLevels.Evaluate || 0) + (bloomLevels.Create || 0)
  };

  /* ============================================================
     Render
  ============================================================ */
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Generate Questions</h1>
          <p className="screen-subtitle">Upload your content, configure your assessment, and generate AI-powered questions</p>
        </header>

        <div className="wizard-container">

          {/* Step Tabs */}
          <div className="wizard-tabs">
            <button
              className={`wizard-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <span className="tab-step">1</span>
              <span>Upload Content</span>
            </button>
            <div className="tab-divider" />
            <button
              className={`wizard-tab ${activeTab === 'configure' ? 'active' : ''}`}
              onClick={() => activeTab !== 'upload' && setActiveTab('configure')}
              disabled={!file || !docTitle}
            >
              <span className="tab-step">2</span>
              <span>Configure Assessment</span>
            </button>
          </div>

          {/* ── STEP 1: Upload ── */}
          {activeTab === 'upload' && (
            <div className="wizard-step animate-fade-in-up">

              <div className="upload-grid">
                {/* Drop Zone */}
                <div className="upload-left">
                  <label className="upload-area" htmlFor="file-upload">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
                      hidden
                      accept=".pdf,.docx,.txt"
                    />
                    <div className="upload-icon-ring">
                      <CloudUpload size={32} />
                    </div>
                    <h4>Drop your content file here</h4>
                    <p className="text-small text-medium">or click to browse</p>
                    <div className="upload-formats">PDF · DOCX · TXT · Max 10 MB</div>
                  </label>

                  {file && (
                    <div className="file-preview-card animate-fade-in-up">
                      <div className="file-icon">
                        <File size={20} />
                      </div>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '100%' }} />
                        </div>
                        <span className="upload-status">
                          <Check size={12} /> Successfully uploaded
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Syllabus Cascade */}
                <div className="upload-right">
                  <div className="syllabus-card">
                    <div className="syllabus-card-header">
                      <BookOpen size={16} />
                      <span>Syllabus Configuration</span>
                    </div>

                    {/* Document Title */}
                    <div className="form-group">
                      <Input
                        label="Assessment Title"
                        placeholder="e.g., Physics — Waves and Optics Mock"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                      />
                      <p className="helper-text">Used as the heading on your generated paper</p>
                    </div>

                    {/* Board Selector */}
                    <div className="form-group">
                      <label className="input-label">Exam Board</label>
                      <div className="board-options">
                        {boardOptions.map(b => (
                          <button
                            key={b.id}
                            className={`board-pill ${boardId === b.id ? 'active' : ''}`}
                            style={{ '--board-color': b.color }}
                            onClick={() => setBoardId(b.id)}
                          >
                            <span className="board-dot" style={{ background: b.color }} />
                            {b.shortLabel}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Level Selector */}
                    <div className="form-group">
                      <label className="input-label">Qualification Level</label>
                      <select
                        className="select-input"
                        value={levelId}
                        onChange={(e) => setLevelId(e.target.value)}
                      >
                        {levelOptions.map(l => (
                          <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Selector — grouped by category */}
                    <div className="form-group">
                      <label className="input-label">Subject</label>
                      <select
                        className="select-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="">— Select subject —</option>
                        {Object.entries(subjectsByCat).map(([cat, subjects]) => (
                          <optgroup key={cat} label={cat}>
                            {subjects.map(s => (
                              <option key={s.code} value={s.name}>
                                {s.name} {s.code ? `(${s.code})` : ''}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <p className="helper-text">
                        Aligns AI generation with subject-specific terminology and AO requirements
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <Button
                  variant="primary"
                  icon={Sparkles}
                  disabled={!file || !docTitle || !subject}
                  onClick={() => setActiveTab('configure')}
                >
                  Next: Configure Assessment
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Configure ── */}
          {activeTab === 'configure' && (
            <div className="wizard-step animate-fade-in-up">
              <div className="config-grid">

                {/* LEFT — Templates + Primary Settings */}
                <div className="config-main">

                  {/* Paper Template Selector */}
                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Paper Structure Template</h4>
                      <p className="text-small text-medium">
                        Select a preset — it auto-fills question count, type, and Bloom's distribution
                      </p>
                    </div>
                    <div className="template-cards-grid">
                      {templates.map(tpl => (
                        <button
                          key={tpl.id}
                          className={`structure-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
                          onClick={() => applyTemplate(tpl)}
                        >
                          <span className="tpl-icon">{tpl.icon}</span>
                          <div className="tpl-info">
                            <strong>{tpl.name}</strong>
                            <span className="tpl-desc">{tpl.description}</span>
                            <div className="tpl-meta">
                              <span className="tpl-badge" style={{ background: tpl.badgeColor + '22', color: tpl.badgeColor }}>
                                {tpl.badge}
                              </span>
                              <span className="tpl-meta-item">
                                <Clock size={11} /> {tpl.duration} min
                              </span>
                              <span className="tpl-meta-item">
                                {tpl.questionCount} Qs
                              </span>
                            </div>
                          </div>
                          {selectedTemplate === tpl.id && (
                            <div className="tpl-check">
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Primary Settings */}
                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Assessment Settings</h4>
                      <p className="text-small text-medium">Fine-tune the paper details</p>
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="input-label">Question Type</label>
                        <select
                          className="select-input"
                          value={questionType}
                          onChange={(e) => setQuestionType(e.target.value)}
                        >
                          {QUESTION_TYPES.map(qt => (
                            <option key={qt.value} value={qt.value}>{qt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ width: '110px' }}>
                        <Input
                          label="Count"
                          type="number"
                          value={questionCount}
                          onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                          min="1" max="100"
                        />
                      </div>
                      <div className="form-group" style={{ width: '110px' }}>
                        <Input
                          label="Duration (min)"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          min="10" max="240"
                        />
                      </div>
                    </div>

                    {/* Summary chips */}
                    <div className="config-summary">
                      <span className="chip">📚 {boardOptions.find(b => b.id === boardId)?.shortLabel}</span>
                      <span className="chip">🎓 {levelOptions.find(l => l.id === levelId)?.label?.split('(')[0].trim()}</span>
                      <span className="chip">📖 {subject}</span>
                      <span className="chip">⏱ {duration} min</span>
                      <span className="chip">📝 {questionCount} questions</span>
                    </div>
                  </section>
                </div>

                {/* RIGHT — Bloom's + AO Panel */}
                <div className="config-side">

                  {/* Bloom's Distribution */}
                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Bloom's Taxonomy Distribution</h4>
                      <p className="text-small text-medium">Set cognitive level targets — must total 100%</p>
                    </div>

                    <div className={`bloom-total-badge ${bloomValid ? 'valid' : 'invalid'}`}>
                      {bloomValid
                        ? <><Check size={13} /> 100% — Ready</>
                        : <><Info size={13} /> {totalBloom}% — Needs {100 - totalBloom > 0 ? '+' : ''}{100 - totalBloom}%</>
                      }
                    </div>

                    <div className="bloom-sliders">
                      {Object.entries(bloomLevels).map(([level, value]) => (
                        <BloomSlider
                          key={level}
                          label={level}
                          value={value}
                          onChange={(val) => handleBloomChange(level, val)}
                          color={BLOOM_COLORS[level]}
                        />
                      ))}
                    </div>
                  </section>

                  {/* AO Mapping Panel */}
                  {aoProfile && (
                    <section className="config-section">
                      <div className="section-title-group">
                        <h4>Assessment Objective Mapping</h4>
                        <p className="text-small text-medium">{aoProfile.label}</p>
                      </div>
                      <div className="ao-list">
                        {Object.entries(aoProfile.objectives).map(([aoKey, ao]) => (
                          <div key={aoKey} className="ao-item">
                            <div className="ao-header">
                              <span className="ao-key">{aoKey}</span>
                              <span className="ao-name">{ao.name}</span>
                              <span className="ao-pct">{computedAo[aoKey]}%</span>
                            </div>
                            <div className="ao-track">
                              <div
                                className="ao-fill"
                                style={{ width: `${computedAo[aoKey]}%` }}
                              />
                            </div>
                            <p className="ao-bloom-tags">
                              {ao.bloomLevels.map(bl => (
                                <span key={bl} className="ao-bloom-tag" style={{ background: BLOOM_COLORS[bl] + '22', color: BLOOM_COLORS[bl] }}>
                                  {bl}
                                </span>
                              ))}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="helper-text" style={{ marginTop: '8px' }}>
                        <Info size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        AO percentages are computed from your Bloom's distribution above
                      </p>
                    </section>
                  )}
                </div>
              </div>

              <div className="step-actions">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setActiveTab('upload')}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  icon={Sparkles}
                  disabled={!bloomValid}
                  onClick={() => navigate('/review')}
                >
                  Generate Questions
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default UploadConfigurePage;
