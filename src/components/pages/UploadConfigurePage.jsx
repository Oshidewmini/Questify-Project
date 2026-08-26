import React, { useState, useEffect } from 'react';
import Sidebar from '../sections/Sidebar';
import {
  CloudUpload, File, Check, Sparkles, ArrowLeft, BookOpen, Info, Clock,
  ChevronUp, ChevronDown, Trash2, Loader2
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useNavigate } from 'react-router-dom';
import {
  getBoardOptions, getLevelOptions,
  getSubjectsByCategory, getDefaultBloom, getAoProfile
} from '../../data/syllabi';
import { getTemplatesForBoard } from '../../data/paperTemplates';
import { QUESTION_TYPES, BLOOM_COLORS, EMPTY_TYPE_COUNTS, sumTypeCounts } from '../../data/questionTypes';
import { useGenerate } from '../../context/GenerateContext';
import { extractDocuments } from '../../services/api';
import './UploadConfigurePage.css';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

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

const makeFileId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const labelFromName = (name) =>
  (name || 'Untitled').replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

const UploadConfigurePage = () => {
  const navigate = useNavigate();
  const {
    uploadedFiles, setUploadedFiles,
    extractedTopics, setExtractedTopics,
    extractStale, setExtractStale,
    docTitle, setDocTitle,
    boardId, setBoardId,
    levelId, setLevelId,
    subject, setSubject,
    setBoardLabel, setLevelLabel,
    selectedTemplate, setSelectedTemplate,
    typeCounts, setTypeCounts,
    duration, setDuration,
    bloomLevels, setBloomLevels,
    setGeneratedQuestions, setPaperId, setGenerateWarnings, setTotalMarks,
    setGenerationNonce,
  } = useGenerate();

  const [activeTab, setActiveTab] = useState('upload');
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');

  const boardOptions   = getBoardOptions();
  const levelOptions   = getLevelOptions(boardId);
  const subjectsByCat  = getSubjectsByCategory(boardId, levelId);
  const templates      = getTemplatesForBoard(boardId);
  const aoProfile      = getAoProfile(boardId);
  const questionCount  = sumTypeCounts(typeCounts);

  useEffect(() => {
    const firstLevel = getLevelOptions(boardId)[0];
    const board = boardOptions.find(b => b.id === boardId);
    if (board) setBoardLabel(board.shortLabel || board.label);
    if (firstLevel) {
      setLevelId(firstLevel.id);
      setLevelLabel(firstLevel.label);
      setSubject('');
    }
  }, [boardId]);

  useEffect(() => {
    setSubject('');
    const bloom = getDefaultBloom(boardId, levelId);
    setBloomLevels(bloom);
    const level = levelOptions.find(l => l.id === levelId);
    if (level) setLevelLabel(level.label);
  }, [levelId]);

  const applyTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setTypeCounts({ ...EMPTY_TYPE_COUNTS, ...tpl.typeCounts });
    setDuration(tpl.duration);
    setBloomLevels({ ...tpl.bloom });
  };

  const handleBloomChange = (level, value) => {
    setBloomLevels(prev => ({ ...prev, [level]: value }));
  };

  const setTypeCount = (key, value) => {
    const n = Number.isNaN(parseInt(value, 10)) ? 0 : Math.max(0, Math.min(80, parseInt(value, 10)));
    setTypeCounts(prev => ({ ...prev, [key]: n }));
  };

  const totalBloom = Object.values(bloomLevels).reduce((a, b) => a + b, 0);
  const bloomValid = totalBloom === 100;

  const computedAo = {
    AO1: (bloomLevels.Remember || 0) + (bloomLevels.Understand || 0),
    AO2: (bloomLevels.Apply || 0)    + (bloomLevels.Analyze || 0),
    AO3: (bloomLevels.Evaluate || 0) + (bloomLevels.Create || 0)
  };

  const allLabeled = uploadedFiles.length > 0 && uploadedFiles.every(f => (f.label || '').trim());
  const extractReady = allLabeled && !extractStale && extractedTopics.length > 0;
  const canGoConfigure = Boolean(docTitle.trim() && subject && extractReady);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const next = [...uploadedFiles];
    incoming.forEach((file) => {
      if (file.size > MAX_FILE_BYTES) {
        setExtractError(`${file.name} exceeds 10 MB.`);
        return;
      }
      next.push({
        id: makeFileId(),
        file,
        name: file.name,
        size: file.size,
        label: labelFromName(file.name),
      });
    });
    setUploadedFiles(next);
    setExtractStale(true);
    setExtractedTopics([]);
    if (incoming.length) setExtractError('');
  };

  const updateLabel = (id, label) => {
    setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, label } : f));
    setExtractStale(true);
  };

  const moveFile = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= uploadedFiles.length) return;
    const next = [...uploadedFiles];
    [next[index], next[target]] = [next[target], next[index]];
    setUploadedFiles(next);
    setExtractStale(true);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setExtractStale(true);
    setExtractedTopics([]);
  };

  const handleExtract = async () => {
    if (!allLabeled) {
      setExtractError('Give every file a topic label before extracting.');
      return;
    }
    setExtracting(true);
    setExtractError('');
    try {
      const data = await extractDocuments(
        uploadedFiles.map(f => f.file),
        uploadedFiles.map(f => f.label.trim()),
      );
      setExtractedTopics(data.documents || []);
      setExtractStale(false);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Extraction failed.';
      setExtractError(typeof detail === 'string' ? detail : JSON.stringify(detail));
      setExtractedTopics([]);
      setExtractStale(true);
    } finally {
      setExtracting(false);
    }
  };

  const startGenerate = () => {
    setGeneratedQuestions([]);
    setPaperId(null);
    setGenerateWarnings([]);
    setTotalMarks(0);
    setGenerationNonce((n) => n + 1);
    navigate('/review');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Generate Questions</h1>
          <p className="screen-subtitle">Upload your content, configure your assessment, and generate AI-powered questions</p>
        </header>

        <div className="wizard-container">
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
              onClick={() => canGoConfigure && setActiveTab('configure')}
              disabled={!canGoConfigure}
            >
              <span className="tab-step">2</span>
              <span>Configure Assessment</span>
            </button>
          </div>

          {activeTab === 'upload' && (
            <div className="wizard-step animate-fade-in-up">
              <div className="upload-grid">
                <div className="upload-left">
                  <label
                    className="upload-area"
                    htmlFor="file-upload"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      addFiles(e.dataTransfer.files);
                    }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = '';
                      }}
                      hidden
                      accept=".pdf,.docx,.txt"
                    />
                    <div className="upload-icon-ring">
                      <CloudUpload size={32} />
                    </div>
                    <h4>Drop lesson-note files here</h4>
                    <p className="text-small text-medium">or click to browse — add one or more PDFs</p>
                    <div className="upload-formats">PDF · DOCX · TXT · Max 10 MB each</div>
                  </label>

                  {uploadedFiles.length > 0 && (
                    <div className="file-list">
                      {uploadedFiles.map((item, index) => {
                        const extracted = extractedTopics.find(d => d.topic_label === item.label.trim());
                        return (
                          <div key={item.id} className="file-preview-card">
                            <div className="file-icon">
                              <File size={20} />
                            </div>
                            <div className="file-details">
                              <span className="file-name">{item.name}</span>
                              <span className="file-size">{(item.size / (1024 * 1024)).toFixed(2)} MB</span>
                              <label className="input-label" style={{ marginTop: 8 }}>Topic label</label>
                              <input
                                className="select-input"
                                value={item.label}
                                placeholder="e.g. Forces & Motion"
                                onChange={(e) => updateLabel(item.id, e.target.value)}
                              />
                              {extracted && !extractStale && (
                                <span className="upload-status">
                                  <Check size={12} /> {extracted.char_count.toLocaleString()} characters extracted
                                </span>
                              )}
                              {extracted?.warnings?.length > 0 && !extractStale && (
                                <p className="helper-text">{extracted.warnings[0]}</p>
                              )}
                            </div>
                            <div className="file-reorder">
                              <button type="button" className="icon-btn" disabled={index === 0} onClick={() => moveFile(index, -1)} aria-label="Move up">
                                <ChevronUp size={16} />
                              </button>
                              <button type="button" className="icon-btn" disabled={index === uploadedFiles.length - 1} onClick={() => moveFile(index, 1)} aria-label="Move down">
                                <ChevronDown size={16} />
                              </button>
                              <button type="button" className="icon-btn text-danger" onClick={() => removeFile(item.id)} aria-label="Remove">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {extractError && <p className="extract-error">{extractError}</p>}

                  {extractedTopics.length > 0 && !extractStale && (
                    <div className="combined-preview">
                      <h4>Combined extraction preview</h4>
                      <p className="text-small text-medium">
                        {extractedTopics.reduce((sum, d) => sum + (d.char_count || 0), 0).toLocaleString()} characters
                        from {extractedTopics.length} topic{extractedTopics.length === 1 ? '' : 's'} (order matches the list above)
                      </p>
                      <pre className="extract-preview-text">
                        {extractedTopics.map(d => `## ${d.topic_label}\n${(d.text || '').slice(0, 400)}${(d.text || '').length > 400 ? '…' : ''}`).join('\n\n')}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="upload-right">
                  <div className="syllabus-card">
                    <div className="syllabus-card-header">
                      <BookOpen size={16} />
                      <span>Syllabus Configuration</span>
                    </div>

                    <div className="form-group">
                      <Input
                        label="Assessment Title"
                        placeholder="e.g., Physics — Waves and Optics Mock"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                      />
                      <p className="helper-text">Used as the heading on your generated paper</p>
                    </div>

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
                              <option key={s.code || s.name} value={s.name}>
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
                  variant="secondary"
                  icon={extracting ? Loader2 : Sparkles}
                  disabled={!allLabeled || extracting}
                  onClick={handleExtract}
                >
                  {extracting ? 'Extracting…' : extractReady ? 'Re-extract text' : 'Extract text'}
                </Button>
                <Button
                  variant="primary"
                  icon={Sparkles}
                  disabled={!canGoConfigure}
                  onClick={() => setActiveTab('configure')}
                >
                  Next: Configure Assessment
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'configure' && (
            <div className="wizard-step animate-fade-in-up">
              <div className="config-grid">
                <div className="config-main">
                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Paper Structure Template</h4>
                      <p className="text-small text-medium">
                        Select a preset — it auto-fills question counts, duration, and Bloom&apos;s distribution
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

                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Assessment Settings</h4>
                      <p className="text-small text-medium">Set how many questions of each type to generate</p>
                    </div>
                    <div className="type-count-grid">
                      {QUESTION_TYPES.map(qt => (
                        <div key={qt.value} className="type-count-field">
                          <label className="input-label">{qt.label}</label>
                          <input
                            className="select-input"
                            type="number"
                            min="0"
                            max="80"
                            value={typeCounts[qt.value] ?? 0}
                            onChange={(e) => setTypeCount(qt.value, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="form-group" style={{ width: '140px', marginTop: 16 }}>
                      <Input
                        label="Duration (min)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        min="10" max="240"
                      />
                    </div>
                    <div className="config-summary">
                      <span className="chip">{boardOptions.find(b => b.id === boardId)?.shortLabel}</span>
                      <span className="chip">{levelOptions.find(l => l.id === levelId)?.label?.split('(')[0].trim()}</span>
                      <span className="chip">{subject}</span>
                      <span className="chip">{duration} min</span>
                      <span className="chip">{questionCount} questions</span>
                    </div>
                  </section>
                </div>

                <div className="config-side">
                  <section className="config-section">
                    <div className="section-title-group">
                      <h4>Bloom&apos;s Taxonomy Distribution</h4>
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
                        AO percentages are computed from your Bloom&apos;s distribution above
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
                  disabled={!bloomValid || questionCount < 1}
                  onClick={startGenerate}
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
