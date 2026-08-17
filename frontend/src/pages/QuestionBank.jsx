import React, { useState } from 'react';
import { Database, Search, Filter, Trash2, Plus } from 'lucide-react';

export default function QuestionBank() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloom, setSelectedBloom] = useState('All');

  const [questions, setQuestions] = useState([
    { id: 1, text: "State Newton's Second Law of Motion and its mathematical expression.", bloom: "Remember", subject: "Physics", ao: "AO1", marks: 2, timesUsed: 12 },
    { id: 2, text: "Calculate the force required to accelerate a 5kg mass at 3m/s².", bloom: "Apply", subject: "Physics", ao: "AO2", marks: 3, timesUsed: 8 },
    { id: 3, text: "Explain the mechanism of enzyme denaturation at high temperatures.", bloom: "Understand", subject: "Biology", ao: "AO1", marks: 3, timesUsed: 15 },
    { id: 4, text: "Evaluate the environmental impact of plastic polymer degradation.", bloom: "Evaluate", subject: "Chemistry", ao: "AO3", marks: 5, timesUsed: 6 },
    { id: 5, text: "Design a circuit diagram to measure resistance using Ohm's Law.", bloom: "Create", subject: "Physics", ao: "AO3", marks: 6, timesUsed: 4 }
  ]);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) || q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloom = selectedBloom === 'All' || q.bloom === selectedBloom;
    return matchesSearch && matchesBloom;
  });

  const handleDelete = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem 2rem 1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>Syllabus Question Bank</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Browse and filter past AI-generated and human-validated questions.
          </p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        {/* Search input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search questions by keyword or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.65rem 0.65rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Bloom filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <select
            value={selectedBloom}
            onChange={(e) => setSelectedBloom(e.target.value)}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontWeight: '600'
            }}
          >
            <option value="All">All Bloom's Levels</option>
            <option value="Remember">Remember</option>
            <option value="Understand">Understand</option>
            <option value="Apply">Apply</option>
            <option value="Analyze">Analyze</option>
            <option value="Evaluate">Evaluate</option>
            <option value="Create">Create</option>
          </select>
        </div>

      </div>

      {/* Questions Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem' }}>Question Wording</th>
              <th style={{ padding: '1rem' }}>Subject</th>
              <th style={{ padding: '1rem' }}>Bloom's Level</th>
              <th style={{ padding: '1rem' }}>AO Objective</th>
              <th style={{ padding: '1rem' }}>Marks</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-primary)', maxWidth: '400px' }}>
                  {q.text}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{q.subject}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`bloom-badge bloom-${q.bloom.toLowerCase()}`}>
                    {q.bloom}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: '600' }}>{q.ao}</td>
                <td style={{ padding: '1rem' }}>{q.marks} Marks</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleDelete(q.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
