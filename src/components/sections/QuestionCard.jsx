import React, { useState } from 'react';
import { Check, Edit2, Trash2, MoreVertical, Eye, EyeOff, RefreshCw } from 'lucide-react';
import './QuestionCard.css';

const QuestionCard = ({ number, type, bloom, ao, quality, status, text, options, answerIndex, answer, marks }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="question-card">
      <div className="card-top">
        <div className="meta-left">
          <span className="q-number">Q{number}</span>
          <span className="badge badge-bloom">Bloom: {bloom}</span>
          <span className="badge badge-success">{ao}</span>
          <span className="badge badge-primary">Quality: {quality}%</span>
        </div>
        <div className="meta-right">
          {marks && <span className="marks-badge">[{marks} marks]</span>}
        </div>
      </div>

      <div className="question-body">
        <p className="question-text">{text}</p>
        
        {options && (
          <div className="mcq-options">
            {options.map((opt, idx) => (
              <div key={idx} className={`mcq-option ${idx === answerIndex ? 'correct' : ''}`}>
                <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                <span className="option-text">{opt}</span>
                {idx === answerIndex && <span className="correct-check">✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="answer-section">
        <button className="view-answer-btn" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {showAnswer && (
          <div className="answer-content">
            <strong>{options ? 'Correct Option:' : 'Expected Answer:'}</strong>
            <p>{options ? options[answerIndex] : answer}</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn"><Edit2 size={16} /> Edit</button>
        <button className="action-btn"><RefreshCw size={16} /> Regenerate</button>
        <button className="action-btn text-danger"><Trash2 size={16} /> Delete</button>
        <button className="action-btn btn-primary" style={{ marginLeft: 'auto', background: 'var(--color-primary-dark)', color: 'white', padding: '6px 12px', borderRadius: '4px' }}>Keep</button>
      </div>
    </div>
  );
};

export default QuestionCard;
