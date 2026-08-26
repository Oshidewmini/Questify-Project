import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './QuestionCard.css';

const optionEntries = (options) => {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((text, idx) => ({ letter: String.fromCharCode(65 + idx), text }));
  }
  return Object.entries(options).map(([letter, text]) => ({ letter, text }));
};

const QuestionCard = ({
  number, type, bloom, ao, topic, text, options, answerIndex, correctOption,
  answer, marks, parts, marking_scheme,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const entries = optionEntries(options);
  const correctLetter = correctOption
    || (typeof answerIndex === 'number' ? String.fromCharCode(65 + answerIndex) : null);

  return (
    <div className="question-card">
      <div className="card-top">
        <div className="meta-left">
          {number !== '' && number != null && <span className="q-number">Q{number}</span>}
          {type && <span className="badge badge-type">{type}</span>}
          {bloom && <span className="badge badge-bloom">Bloom: {bloom}</span>}
          {ao && <span className="badge badge-success">{ao}</span>}
          {topic && <span className="badge badge-primary">{topic}</span>}
        </div>
        <div className="meta-right">
          {marks != null && <span className="marks-badge">[{marks} marks]</span>}
        </div>
      </div>

      <div className="question-body">
        <p className="question-text">{text}</p>

        {type === 'True/False' && (
          <div className="mcq-options">
            {['True', 'False'].map((opt) => (
              <div key={opt} className={`mcq-option ${correctLetter === opt ? 'correct' : ''}`}>
                <span className="option-text">{opt}</span>
                {correctLetter === opt && <span className="correct-check">✓</span>}
              </div>
            ))}
          </div>
        )}

        {type === 'MCQ' && entries.length > 0 && (
          <div className="mcq-options">
            {entries.map(({ letter, text: optText }) => (
              <div key={letter} className={`mcq-option ${letter === correctLetter ? 'correct' : ''}`}>
                <span className="option-letter">{letter}.</span>
                <span className="option-text">{optText}</span>
                {letter === correctLetter && <span className="correct-check">✓</span>}
              </div>
            ))}
          </div>
        )}

        {type === 'Structured' && Array.isArray(parts) && (
          <div className="structured-parts">
            {parts.map((part) => (
              <div key={part.label} className="structured-part">
                <p>
                  <strong>({part.label})</strong> {part.question}
                  <span className="marks-badge"> [{part.marks || 1} marks]</span>
                </p>
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
            {type === 'Structured' && Array.isArray(parts) ? (
              parts.map((part) => (
                <div key={part.label} className="structured-answer">
                  <strong>({part.label})</strong>
                  <ul>
                    {(part.marking_scheme || []).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : marking_scheme?.length ? (
              <>
                <strong>Marking scheme:</strong>
                <ul>
                  {marking_scheme.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </>
            ) : (
              <>
                <strong>{entries.length ? 'Correct Option:' : 'Expected Answer:'}</strong>
                <p>{answer}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
