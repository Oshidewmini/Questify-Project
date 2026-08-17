import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import GenerateExam from './pages/GenerateExam';
import ReviewPaper from './pages/ReviewPaper';
import QuestionBank from './pages/QuestionBank';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './styles/theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [generatedPaper, setGeneratedPaper] = useState(null);

  const handleExamGenerated = (paperData) => {
    setGeneratedPaper(paperData);
    setActiveTab('review');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard setActiveTab={setActiveTab} />;
      case 'generate':   return <GenerateExam onExamGenerated={handleExamGenerated} />;
      case 'review':     return generatedPaper
        ? <ReviewPaper paper={generatedPaper} onBack={() => setActiveTab('generate')} />
        : <GenerateExam onExamGenerated={handleExamGenerated} />;
      case 'bank':       return <QuestionBank />;
      case 'analytics':  return <Analytics />;
      case 'settings':   return <Settings />;
      default:           return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app-shell">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          {renderPage()}
        </div>
      </div>
    </ThemeProvider>
  );
}
