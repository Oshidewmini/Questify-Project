import React, { useState } from 'react';
import Sidebar from '../sections/Sidebar';
import StepIndicator from '../sections/StepIndicator';
import { FileText, Save, Download, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useNavigate } from 'react-router-dom';
import './ExportPage.css';

const FormatCard = ({ id, type, description, selected, onClick }) => (
  <div className={`format-card ${selected ? 'selected' : ''}`} onClick={() => onClick(id)}>
    <div className="format-icon">
      {type === 'docx' ? <FileText size={48} /> : <FileText size={48} color="#e74c3c" />}
    </div>
    <div className="format-info">
      <h4>{type === 'docx' ? 'Word Document (.DOCX)' : type === 'pdf' ? 'PDF Document (.PDF)' : 'Both Formats'}</h4>
      <p className="text-small text-medium">{description}</p>
    </div>
    <div className="format-select">
      <div className={`radio-circle ${selected ? 'checked' : ''}`} />
    </div>
  </div>
);

const ExportPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState('docx');
  const [template, setTemplate] = useState('modern');

  const templates = [
    { id: 'modern', name: 'Modern', desc: 'Clean, spacious with Lato font', preview: '📄' },
    { id: 'classic', name: 'Classic', desc: 'Standard Academic Layout (Times)', preview: '📜' },
    { id: 'professional', name: 'Professional', desc: 'Two-column business style', preview: '🏢' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Export & Finalize</h1>
          <p className="screen-subtitle">Choose your format and customize the final output</p>
        </header>

        <section className="export-flow">
          <StepIndicator currentStep={step} steps={['Format', 'Template', 'Details', 'Download']} />

          <div className="wizard-step">
            {step === 1 && (
              <div className="step-content">
                <h3>Step 1: Choose Export Format</h3>
                <div className="formats-grid">
                  <div className={`format-card ${format === 'docx' ? 'selected' : ''}`} onClick={() => setFormat('docx')}>
                    <FileText size={48} />
                    <div className="format-info">
                      <h4>Word Document (.DOCX)</h4>
                      <p className="text-small text-medium">Editable format ideal for final customization.</p>
                    </div>
                  </div>
                  <div className={`format-card ${format === 'pdf' ? 'selected' : ''}`} onClick={() => setFormat('pdf')}>
                    <FileText size={48} color="#e74c3c" />
                    <div className="format-info">
                      <h4>PDF Document (.PDF)</h4>
                      <p className="text-small text-medium">Locked format for secure exam distribution.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-content">
                <h3>Step 2: Choose Paper Template</h3>
                <div className="template-grid">
                  {templates.map((tpl) => (
                    <div 
                      key={tpl.id}
                      className={`template-card ${template === tpl.id ? 'active' : ''}`}
                      onClick={() => setTemplate(tpl.id)}
                    >
                      <div className="tpl-preview">{tpl.preview}</div>
                      <h4>{tpl.name}</h4>
                      <p className="text-small text-medium">{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-content">
                <h3>Step 3: Examination Details</h3>
                <div className="details-form">
                  <Input label="Exam Title" placeholder="Mathematics Final Examination" />
                  <div className="form-row">
                    <Input label="School Name" placeholder="Questify Academy" />
                    <Input label="Exam board" value="Cambridge IGCSE" disabled />
                  </div>
                  <div className="form-row">
                    <Input label="Duration (mins)" type="number" defaultValue="90" />
                    <Input label="Total Marks" type="number" defaultValue="50" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-content download-step">
                <div className="success-banner">
                  <CheckCircle size={64} color="var(--color-success)" />
                  <h3>Your paper is ready!</h3>
                  <p className="text-medium">Download your formatted question paper and mark scheme.</p>
                </div>
                
                <div className="download-options">
                  <div className="download-card">
                    <FileText size={24} />
                    <div className="dl-info">
                      <strong>Question Paper</strong>
                      <p className="caption text-medium">biology_paper_v1.{format}</p>
                    </div>
                    <Button variant="success" icon={Download}>Download</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="step-actions">
              {step > 1 && (
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(step - 1)}>Back</Button>
              )}
              {step < 4 ? (
                <Button variant="primary" icon={ArrowRight} onClick={() => setStep(step + 1)}>Next Step</Button>
              ) : (
                <Button variant="primary" icon={Save} onClick={() => navigate('/dashboard')}>Complete & Exit</Button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExportPage;
