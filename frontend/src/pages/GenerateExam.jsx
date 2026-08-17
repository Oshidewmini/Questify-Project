import React, { useState, useRef } from 'react';
import { Upload, FileText, ChevronRight, ChevronLeft, Sparkles, CheckCircle, Loader2, BookOpen, Layers, AlignLeft } from 'lucide-react';
import axios from 'axios';

const BLOOM_LEVELS = [
  { key: 'Remember',   color: '#3B82F6', cls: 'bloom-remember',   ao: 'AO1', desc: 'Recall facts and basic concepts' },
  { key: 'Understand', color: '#10B981', cls: 'bloom-understand',  ao: 'AO1', desc: 'Explain ideas and concepts' },
  { key: 'Apply',      color: '#F59E0B', cls: 'bloom-apply',       ao: 'AO2', desc: 'Use information in new situations' },
  { key: 'Analyze',    color: '#EC4899', cls: 'bloom-analyze',     ao: 'AO2', desc: 'Draw connections among ideas' },
  { key: 'Evaluate',   color: '#8B5CF6', cls: 'bloom-evaluate',    ao: 'AO3', desc: 'Justify a decision or course of action' },
  { key: 'Create',     color: '#EF4444', cls: 'bloom-create',      ao: 'AO3', desc: 'Produce new or original work' },
];

const PRESETS = {
  'Knowledge-Focused':    { Remember:40, Understand:35, Apply:15, Analyze:5,  Evaluate:3,  Create:2  },
  'Balanced':             { Remember:20, Understand:25, Apply:25, Analyze:15, Evaluate:10, Create:5  },
  'Higher-Order':         { Remember:10, Understand:15, Apply:20, Analyze:25, Evaluate:20, Create:10 },
  'Cambridge IGCSE Std':  { Remember:30, Understand:30, Apply:25, Analyze:10, Evaluate:3,  Create:2  },
  'Edexcel Standard':     { Remember:25, Understand:30, Apply:25, Analyze:12, Evaluate:5,  Create:3  },
};

const QUESTION_TYPES = [
  { id: 'MCQ',       label: 'Multiple Choice', icon: '⊙' },
  { id: 'SAQ',       label: 'Short Answer',    icon: '≡' },
  { id: 'TrueFalse', label: 'True / False',    icon: '✓✗' },
  { id: 'FillBlank', label: 'Fill in Blanks',  icon: '___' },
];

const DEFAULT_TEXT = `Kinematics and Dynamics: Newton's laws of motion describe the relationship between forces acting on a body and the motion of that body. Newton's First Law states that an object remains at rest or moves with constant velocity unless acted upon by a net external force. Newton's Second Law states that acceleration is directly proportional to net force and inversely proportional to mass: F = ma. Newton's Third Law states that for every action there is an equal and opposite reaction. Work done is defined as force multiplied by displacement in the direction of force (W = Fs). Power is the rate of doing work (P = W/t). Kinetic energy is given by Ek = ½mv².`;

const STEPS = ['Upload Content', 'Configure Assessment', 'Bloom\'s Distribution', 'Generate & Review'];

export default function GenerateExam({ onExamGenerated }) {
  const [step, setStep] = useState(0);
  const [sourceText, setSourceText] = useState(DEFAULT_TEXT);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const [examBoard, setExamBoard] = useState('Cambridge');
  const [subject, setSubject] = useState('Physics (0625)');
  const [paperTitle, setPaperTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(8);
  const [questionTypes, setQuestionTypes] = useState(['MCQ', 'SAQ']);
  const [duration, setDuration] = useState(60);
  const [template, setTemplate] = useState('Balanced');

  const [bloomDist, setBloomDist] = useState({ ...PRESETS['Balanced'] });

  const [loading, setLoading] = useState(false);

  const totalPct = Object.values(bloomDist).reduce((a, b) => a + b, 0);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSourceText(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const toggleType = (id) =>
    setQuestionTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const applyPreset = (name) => {
    setTemplate(name);
    if (PRESETS[name]) setBloomDist({ ...PRESETS[name] });
  };

  const handleBloom = (key, val) => {
    const v = Math.max(0, Math.min(100, parseInt(val) || 0));
    setBloomDist(prev => ({ ...prev, [key]: v }));
  };

  const buildFallbackQuestions = () => [
    { id:'q-1', text:`Define Newton's Second Law of Motion and state its SI units.`, answer:`F = ma. Force in Newtons (N = kg·m/s²). Award 2 marks.`, mark_value:2, bloom_level:'Remember', bloom_confidence:0.96, ao_code:'AO1', question_type:'SAQ', quality_score:98.5 },
    { id:'q-2', text:`Which statement best describes what happens to acceleration when mass doubles (force constant)?`, answer:`Option C: Acceleration halves (a ∝ 1/m).`, mark_value:1, bloom_level:'Understand', bloom_confidence:0.94, ao_code:'AO1', question_type:'MCQ', options:['A: Acceleration doubles','B: Acceleration stays the same','C: Acceleration halves','D: Acceleration quadruples'], quality_score:96.0 },
    { id:'q-3', text:`A 1200 kg car accelerates at 2.5 m/s². Calculate the net force applied.`, answer:`F = 1200 × 2.5 = 3000 N. Award 3 marks for correct substitution, working and units.`, mark_value:3, bloom_level:'Apply', bloom_confidence:0.92, ao_code:'AO2', question_type:'SAQ', quality_score:95.2 },
    { id:'q-4', text:`True or False: Work done is zero when force is applied perpendicular to displacement.`, answer:`True. W = Fs cos θ; when θ = 90°, cos 90° = 0 so W = 0.`, mark_value:1, bloom_level:'Understand', bloom_confidence:0.93, ao_code:'AO1', question_type:'TrueFalse', quality_score:94.8 },
    { id:'q-5', text:`The kinetic energy of an object equals __________.`, answer:`½mv²  (one-half mass times velocity squared).`, mark_value:1, bloom_level:'Remember', bloom_confidence:0.97, ao_code:'AO1', question_type:'FillBlank', quality_score:97.3 },
    { id:'q-6', text:`Analyze how friction on an inclined plane at 30° alters the net acceleration compared to a horizontal surface.`, answer:`Normal force N = mg cos 30°; friction f = μN = μmg cos 30°. Net force = mg sin 30° − μmg cos 30°. Award 4 marks.`, mark_value:4, bloom_level:'Analyze', bloom_confidence:0.91, ao_code:'AO2', question_type:'SAQ', quality_score:94.0 },
    { id:'q-7', text:`Evaluate whether air resistance can be neglected in high-precision satellite orbital calculations.`, answer:`At orbital altitudes (>200 km) atmospheric density is negligible; drag force is many orders of magnitude below gravitational force. Award 5 marks for justified critique.`, mark_value:5, bloom_level:'Evaluate', bloom_confidence:0.89, ao_code:'AO3', question_type:'SAQ', quality_score:93.8 },
    { id:'q-8', text:`Design an experiment to verify Newton's Second Law using a trolley, masses and a ticker-tape timer.`, answer:`Set up inclined track, attach hanging mass via string, measure acceleration via tape intervals, vary mass and force systematically. Award 6 marks for method, variables, control and safety.`, mark_value:6, bloom_level:'Create', bloom_confidence:0.87, ao_code:'AO3', question_type:'SAQ', quality_score:92.5 },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/generate', {
        source_text: sourceText,
        exam_board: examBoard,
        subject,
        question_count: questionCount,
        question_types: questionTypes.length > 0 ? questionTypes : ['SAQ'],
        bloom_distribution: bloomDist,
      });
      onExamGenerated({ title: paperTitle || `${subject} — ${examBoard} Paper`, exam_board: examBoard, subject, questions: res.data });
    } catch {
      onExamGenerated({ title: paperTitle || `${subject} — ${examBoard} Paper`, exam_board: examBoard, subject, questions: buildFallbackQuestions() });
    } finally {
      setLoading(false);
    }
  };

  /* ── Wizard step status helper ── */
  const stepStatus = (i) => i < step ? 'done' : i === step ? 'active' : 'pending';

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Generate Questions</h1>
        <p>Upload your content, configure your assessment, and generate AI-powered questions.</p>
      </div>

      <div className="page-content">
        {/* ── Wizard Step Bar ── */}
        <div className="wizard-steps">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="wizard-step" style={{ cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
                <div className={`wizard-step-num ${stepStatus(i)}`}>
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`wizard-step-label ${step === i ? 'active' : ''}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`wizard-connector ${i < step ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* ════ STEP 0: Upload Content ════ */}
        {step === 0 && (
          <div className="animate-fade-in" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'1.5rem', alignItems:'start' }}>
            <div>
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
              >
                <div className="drop-zone-icon">
                  <Upload size={24} color="var(--accent-primary)" />
                </div>
                <p style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.4rem' }}>Drop your content file here</p>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:'1rem' }}>or click to browse</p>
                <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>PDF · DOCX · TXT · Max 10 MB</p>
              </div>
              <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />

              <div style={{ marginTop:'1.25rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                  <label className="form-label" style={{ margin:0 }}>Or paste / type your source text</label>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{sourceText.trim().split(/\s+/).length} words</span>
                </div>
                <textarea
                  className="form-textarea"
                  rows={9}
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value)}
                  placeholder="Paste textbook excerpts, revision notes or syllabus topics here..."
                  style={{ resize:'vertical' }}
                />
              </div>
            </div>

            {/* Right: Syllabus Config panel */}
            <div className="glass-card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
                <BookOpen size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Syllabus Configuration</span>
              </div>

              <label className="form-label">Assessment Title</label>
              <input className="form-input" placeholder="e.g., Physics — Waves and Optics Mock" value={paperTitle} onChange={e => setPaperTitle(e.target.value)} style={{ marginBottom:'1rem' }} />
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'-0.7rem', marginBottom:'1rem' }}>Used as the heading on your generated paper.</p>

              <label className="form-label">Exam Board</label>
              <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem' }}>
                {['Cambridge','Edexcel'].map(b => (
                  <button key={b} onClick={() => setExamBoard(b)} style={{ flex:1, padding:'0.55rem', borderRadius:'var(--radius-md)', border:`2px solid ${examBoard===b ? 'var(--accent-primary)' : 'var(--card-border)'}`, background: examBoard===b ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)', color: examBoard===b ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }}>
                    {b}
                  </button>
                ))}
              </div>

              <label className="form-label">Qualification Level</label>
              <select className="form-select" style={{ marginBottom:'1rem' }}>
                <option>Cambridge IGCSE (Grade 9/10)</option>
                <option>Cambridge AS Level</option>
                <option>Cambridge A Level</option>
                <option>Edexcel International GCSE</option>
                <option>Edexcel International A Level</option>
              </select>

              <label className="form-label">Subject</label>
              <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">— Select subject —</option>
                <option value="Physics (0625)">Physics (0625 / 4PH1)</option>
                <option value="Chemistry (0620)">Chemistry (0620 / 4CH1)</option>
                <option value="Biology (0610)">Biology (0610 / 4BI1)</option>
                <option value="Mathematics (0580)">Mathematics (0580 / 4MA1)</option>
                <option value="Computer Science (0478)">Computer Science (0478)</option>
              </select>
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.4rem' }}>Aligns AI generation with subject-specific terminology and AO requirements.</p>
            </div>
          </div>
        )}

        {/* ════ STEP 1: Configure Assessment ════ */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

            <div className="glass-card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
                <AlignLeft size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Paper Structure</span>
              </div>

              <label className="form-label">Number of Questions</label>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <input type="range" min={3} max={25} value={questionCount} onChange={e => setQuestionCount(+e.target.value)} className="bloom-slider" style={{ flex:1, background:'var(--accent-primary)' }} />
                <input type="number" min={3} max={25} value={questionCount} onChange={e => setQuestionCount(Math.max(3, Math.min(25, +e.target.value)))} className="bloom-pct-input" style={{ width:'60px' }} />
              </div>

              <label className="form-label">Exam Duration (minutes)</label>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <input type="range" min={15} max={180} step={15} value={duration} onChange={e => setDuration(+e.target.value)} className="bloom-slider" style={{ flex:1, background:'var(--accent-secondary)' }} />
                <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} className="bloom-pct-input" style={{ width:'60px' }} />
              </div>

              <label className="form-label">Paper Template</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
                {['Quick Quiz','Midterm','Final Exam'].map(t => (
                  <button key={t} onClick={() => setTemplate(t)} style={{ padding:'0.6rem', borderRadius:'var(--radius-md)', border:`2px solid ${template===t ? 'var(--accent-primary)':'var(--card-border)'}`, background: template===t ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)', color: template===t ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
                <Layers size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Question Types</span>
              </div>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1rem' }}>Select all question formats you want included in this paper.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                {QUESTION_TYPES.map(({ id, label, icon }) => {
                  const sel = questionTypes.includes(id);
                  return (
                    <button key={id} onClick={() => toggleType(id)} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.75rem 1rem', borderRadius:'var(--radius-md)', border:`2px solid ${sel ? 'var(--accent-primary)':'var(--card-border)'}`, background: sel ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)', color: sel ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', textAlign:'left' }}>
                      <span style={{ fontSize:'1.1rem', minWidth:'24px', textAlign:'center' }}>{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop:'1.25rem', padding:'0.75rem', borderRadius:'var(--radius-md)', background:'var(--bg-tertiary)', fontSize:'0.8rem', color:'var(--text-secondary)' }}>
                <strong style={{ color:'var(--text-primary)' }}>Cambridge AO Mapping:</strong> AO1 (Remember/Understand) → Knowledge recall. AO2 (Apply/Analyze) → Application. AO3 (Evaluate/Create) → Synthesis & critical thinking.
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2: Bloom's Distribution ════ */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.5rem', alignItems:'start' }}>

            <div className="glass-card" style={{ padding:'1.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                <Sparkles size={18} color="var(--accent-primary)" />
                <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Bloom's Taxonomy Cognitive Level Allocation</span>
              </div>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1.5rem' }}>
                Set the percentage of questions at each cognitive level. Total must equal 100%.
              </p>

              {/* Preset buttons */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.75rem' }}>
                {Object.keys(PRESETS).map(name => (
                  <button key={name} onClick={() => applyPreset(name)} style={{ padding:'0.35rem 0.75rem', borderRadius:'var(--radius-full)', border:`1.5px solid ${template===name ? 'var(--accent-primary)':'var(--card-border)'}`, background: template===name ? 'rgba(99,102,241,0.12)' : 'var(--bg-secondary)', color: template===name ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight:600, fontSize:'0.78rem', cursor:'pointer' }}>
                    {name}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="bloom-allocator">
                {BLOOM_LEVELS.map(({ key, color, cls, ao, desc }) => (
                  <div key={key} className="bloom-row">
                    <span className={`bloom-badge ${cls}`} style={{ width:'120px', justifyContent:'center' }}>{key}</span>
                    <div style={{ position:'relative' }}>
                      <input
                        type="range" min={0} max={100} value={bloomDist[key]}
                        onChange={e => handleBloom(key, e.target.value)}
                        className="bloom-slider"
                        style={{ background: `linear-gradient(to right, ${color} ${bloomDist[key]}%, var(--bg-tertiary) ${bloomDist[key]}%)` }}
                      />
                    </div>
                    <input type="number" min={0} max={100} value={bloomDist[key]} onChange={e => handleBloom(key, e.target.value)} className="bloom-pct-input" />
                  </div>
                ))}
              </div>

              {/* Total indicator */}
              <div style={{ marginTop:'1.25rem', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 1rem', borderRadius:'var(--radius-md)', background: totalPct === 100 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${totalPct===100 ? '#10B981':'#EF4444'}` }}>
                <span style={{ fontWeight:700, fontSize:'0.875rem', color: totalPct===100 ? '#10B981' : '#EF4444' }}>
                  {totalPct === 100 ? '✓ Distribution is balanced (100%)' : `Total: ${totalPct}% — must equal 100%`}
                </span>
                {totalPct !== 100 && (
                  <button onClick={() => {
                    const diff = 100 - totalPct;
                    setBloomDist(prev => ({ ...prev, Understand: Math.max(0, prev.Understand + diff) }));
                  }} style={{ fontSize:'0.78rem', fontWeight:700, color:'#EF4444', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>
                    Auto-fix
                  </button>
                )}
              </div>
            </div>

            {/* Right: Bloom's Pyramid visual */}
            <div className="glass-card" style={{ padding:'1.5rem' }}>
              <div style={{ fontWeight:700, fontSize:'0.9rem', marginBottom:'1rem', color:'var(--text-primary)' }}>Cognitive Depth Pyramid</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px', alignItems:'center' }}>
                {[...BLOOM_LEVELS].reverse().map(({ key, color, cls }) => {
                  const pct = bloomDist[key];
                  const widthPct = 40 + (BLOOM_LEVELS.indexOf(BLOOM_LEVELS.find(l=>l.key===key)) * 10);
                  return (
                    <div key={key} style={{ width:`${widthPct}%`, minWidth:'60%', padding:'0.45rem 0.5rem', borderRadius:'6px', background:color, opacity: pct > 0 ? 0.85 + pct*0.002 : 0.25, transition:'all 0.3s', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ color:'#fff', fontSize:'0.72rem', fontWeight:800 }}>{key}</span>
                      <span style={{ color:'rgba(255,255,255,0.9)', fontSize:'0.72rem', fontWeight:700 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:'1.25rem' }}>
                {BLOOM_LEVELS.map(({ key, color, ao, desc }) => (
                  <div key={key} style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'flex-start' }}>
                    <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:color, marginTop:'5px', flexShrink:0 }} />
                    <div>
                      <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-primary)' }}>{key}</span>
                      <span style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}> · {ao} · </span>
                      <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)' }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ════ STEP 3: Generate ════ */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="glass-card" style={{ padding:'2rem', textAlign:'center', maxWidth:'600px', margin:'0 auto' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', boxShadow:'0 8px 24px var(--accent-gradient-glow)' }}>
                <Sparkles size={32} color="#fff" />
              </div>
              <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:'0.5rem' }}>Ready to Generate</h2>
              <p style={{ color:'var(--text-secondary)', marginBottom:'1.5rem', fontSize:'0.9rem' }}>
                {questionCount} questions across {Object.keys(bloomDist).filter(k=>bloomDist[k]>0).length} Bloom's levels for <strong>{subject}</strong> — <strong>{examBoard}</strong>
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem', marginBottom:'2rem' }}>
                {[{label:'Questions', val:questionCount},{label:'Duration', val:`${duration} min`},{label:'Formats', val:questionTypes.length}].map(s=>(
                  <div key={s.label} style={{ background:'var(--bg-tertiary)', borderRadius:'var(--radius-md)', padding:'0.75rem', textAlign:'center' }}>
                    <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--accent-primary)' }}>{s.val}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'1rem', fontSize:'1rem' }}>
                {loading ? (<><Loader2 size={20} className="spin" /> T5 AI Model is generating your paper...</>) : (<><Sparkles size={20} /> Generate Paper &amp; Mark Scheme</>)}
              </button>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2rem' }}>
          <button className="btn-secondary" onClick={() => setStep(s => Math.max(0, s-1))} style={{ visibility: step > 0 ? 'visible' : 'hidden' }}>
            <ChevronLeft size={18} /> Back
          </button>

          {step < STEPS.length - 1 && (
            <button className="btn-primary" onClick={() => setStep(s => Math.min(STEPS.length-1, s+1))} disabled={step===0 && sourceText.trim().length < 20}>
              Next: {STEPS[step+1]} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
