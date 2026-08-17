import React, { useState, useEffect } from 'react';
import Sidebar from '../sections/Sidebar';
import { Search, Filter, FileText, Download, MoreVertical } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { getPapers } from '../../services/api';
import './LibraryPage.css';

const LibraryPage = () => {
  const [savedPapers, setSavedPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const papers = await getPapers();
        setSavedPapers(papers);
      } catch (error) {
        console.error("Failed to load papers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1 className="screen-title">Question Bank</h1>
          <p className="screen-subtitle">Browse and reuse your generated assessment materials</p>
        </header>

        <section className="library-controls">
          <div className="search-bar">
            <Input placeholder="Search papers, questions, or subjects..." icon={Search} />
          </div>
          <div className="control-actions">
            <select className="select-input sort-select">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Highest Quality</option>
            </select>
            <Button variant="secondary" icon={Filter}>Filter</Button>
          </div>
        </section>

        <section className="papers-list">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Loading papers...</p>
          ) : savedPapers.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} color="var(--color-border)" />
              <p>No papers generated yet. Head to the Dashboard to create one!</p>
            </div>
          ) : (
            savedPapers.map((paper) => (
              <div key={paper.id} className="paper-library-card">
                <div className="paper-card-main">
                  <div className="paper-icon">
                    <FileText size={32} color="var(--color-primary-dark)" />
                  </div>
                  <div className="paper-info">
                    <h4>{paper.title}</h4>
                    <p className="text-small text-medium">
                      Created {new Date(paper.created_at).toLocaleDateString()}
                    </p>
                    <div className="paper-badges">
                      <span className="badge badge-info">{paper.total_marks} Marks</span>
                      <span className="badge badge-success">{paper.subject || 'Mixed'}</span>
                      <span className="badge badge-primary">{paper.duration_minutes} Min</span>
                    </div>
                  </div>
                </div>
                <div className="paper-card-actions">
                  <Button variant="secondary" size="small" icon={Download}>Download</Button>
                  <button className="icon-btn"><MoreVertical size={20} /></button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default LibraryPage;
