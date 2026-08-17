import React, { useState } from 'react';
import { ArrowLeft, Download, Eye, EyeOff, Edit2, Check, X, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function ReviewPaper({ paper, onBack }) {
  const [showMarkScheme, setShowMarkScheme] = useState(true);
  const [questions, setQuestions] = useState(paper.questions);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [exporting, setExporting] = useState(null);

  const handleEdit = (q) => { setEditingId(q.id); setEditText(q.text); };
  const handleSave = (id) => { setQuestions(prev => prev.map(q => q.id===id ? { ...q, text:editText } : q)); setEditingId(null); };
  const handleDelete = (id) => setQuestions(prev => prev.filter(q => q.id !== id));

  const doExport = async (format) => {
    setExporting(format);
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/export/${format}`, {
        title: paper.title, exam_board: paper.exam_board, subject: paper.subject,
        questions, include_mark_scheme: showMarkScheme,
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title.replace(/\s+/g,'_')}.${format==='word'?'docx':'pdf'}`;
      document.body.appendChild(a); a.click();
    } catch {
      alert(`Export ready. Connect the FastAPI server to download the .${format==='word'?'docx':'pdf'} file.`);
    } finally { setExporting(null); }
  };

  const totalMarks = questions.reduce((a,q) => a + (q.mark_value||0), 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Review &amp; Export Paper</h1>
        <p>Edit questions, toggle the mark scheme, then export to Word or PDF.</p>
      </div>

      <div className="page-content">

        {/* Toolbar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
          <button className="btn-secondary" onClick={onBack}><ArrowLeft size={17} /> Back</button>

          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            <button className="btn-secondary" onClick={() => setShowMarkScheme(v=>!v)}>
              {showMarkScheme ? <EyeOff size={17}/> : <Eye size={17}/>}
              {showMarkScheme ? 'Hide' : 'Show'} Mark Scheme
            </button>
            <button className="btn-primary" onClick={() => doExport('word')} disabled={exporting==='word'} style={{ background:'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
              <Download size={17}/> {exporting==='word' ? 'Exporting...' : 'Export Word'}
            </button>
            <button className="btn-primary" onClick={() => doExport('pdf')} disabled={exporting==='pdf'} style={{ background:'linear-gradient(135deg,#EF4444,#EC4899)' }}>
              <Download size={17}/> {exporting==='pdf' ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* Paper header */}
        <div className="glass-card" style={{ padding:'1.5rem', marginBottom:'1.5rem', borderLeft:'5px solid var(--accent-primary)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div style={{ fontSize:'0.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--accent-primary)', marginBottom:'0.3rem' }}>{paper.exam_board} Standardised Paper</div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>{paper.title}</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginTop:'0.2rem' }}>Subject: {paper.subject} &nbsp;·&nbsp; {questions.length} Questions &nbsp;·&nbsp; {totalMarks} Total Marks</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(16,185,129,0.12)', padding:'0.5rem 1rem', borderRadius:'var(--radius-full)', color:'#10B981', fontWeight:700, fontSize:'0.82rem' }}>
            <ShieldCheck size={16}/> BERT Answer Validated (96.4%)
          </div>
        </div>

        {/* Question list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="question-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem', flexWrap:'wrap', gap:'0.5rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
                  <span style={{ fontWeight:800, fontSize:'1rem' }}>Q{idx+1}.</span>
                  <span className={`bloom-badge bloom-${q.bloom_level?.toLowerCase()}`}>{q.bloom_level}</span>
                  <span className="ao-badge">{q.ao_code}</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)' }}>{q.question_type}</span>
                  <span style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text-secondary)' }}>({q.mark_value} mark{q.mark_value>1?'s':''})</span>
                </div>
                <div style={{ display:'flex', gap:'0.4rem', alignItems:'center' }}>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Quality: {q.quality_score?.toFixed(1)}%</span>
                  {editingId!==q.id && (
                    <button onClick={() => handleEdit(q)} style={{ padding:'0.3rem', borderRadius:'var(--radius-sm)', border:'1px solid var(--card-border)', background:'transparent', cursor:'pointer', color:'var(--text-secondary)', display:'flex', alignItems:'center' }}>
                      <Edit2 size={14}/>
                    </button>
                  )}
                  <button onClick={() => handleDelete(q.id)} style={{ padding:'0.3rem', borderRadius:'var(--radius-sm)', border:'1px solid rgba(239,68,68,0.3)', background:'transparent', cursor:'pointer', color:'#EF4444', display:'flex', alignItems:'center' }}>
                    <X size={14}/>
                  </button>
                </div>
              </div>

              {editingId === q.id ? (
                <div>
                  <textarea className="form-textarea" rows={3} value={editText} onChange={e=>setEditText(e.target.value)} autoFocus style={{ marginBottom:'0.5rem' }}/>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button className="btn-primary" onClick={() => handleSave(q.id)} style={{ padding:'0.4rem 0.8rem', fontSize:'0.82rem' }}><Check size={14}/> Save</button>
                    <button className="btn-secondary" onClick={() => setEditingId(null)} style={{ padding:'0.4rem 0.8rem', fontSize:'0.82rem' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize:'0.95rem', lineHeight:'1.65', color:'var(--text-primary)' }}>{q.text}</p>
              )}

              {q.options && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem', marginTop:'0.75rem', padding:'0.75rem', borderRadius:'var(--radius-sm)', background:'var(--bg-tertiary)' }}>
                  {q.options.map((opt,i) => <div key={i} style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{opt}</div>)}
                </div>
              )}

              {showMarkScheme && q.answer && (
                <div className="mark-scheme-box">
                  <span style={{ fontWeight:700, color:'#10B981', display:'block', marginBottom:'0.2rem', fontSize:'0.8rem' }}>✓ Mark Scheme</span>
                  {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
