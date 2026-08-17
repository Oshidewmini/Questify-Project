import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle2, Award, ArrowUpRight, BarChart2, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({
    total_papers: 14,
    total_questions: 184,
    hours_saved: 105.0,
    avg_quality_score: 96.4
  });

  const bloomData = [
    { name: 'Remember', value: 22, color: '#3B82F6' },
    { name: 'Understand', value: 31, color: '#10B981' },
    { name: 'Apply', value: 28, color: '#F59E0B' },
    { name: 'Analyze', value: 11, color: '#EC4899' },
    { name: 'Evaluate', value: 5, color: '#8B5CF6' },
    { name: 'Create', value: 3, color: '#EF4444' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem 2rem 1rem' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
            <Zap size={14} /> Cambridge & Edexcel AI Engine Active
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Welcome back, Teacher! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.5' }}>
            Questify reduces exam preparation time from 8–10 hours to 45–60 minutes while enforcing Bloom's Taxonomy cognitive alignment for Sri Lankan international schools.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setActiveTab('generate')} style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
          <Sparkles size={20} />
          Create Exam Paper Now
        </button>
      </div>

      {/* 4 Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Preparation Saved</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <Clock size={20} color="#10B981" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#10B981' }}>88% Saved</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            ~{stats.hours_saved} hours saved total
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Generated Questions</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 size={20} color="#3B82F6" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stats.total_questions}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Mapped across 14 exam papers
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Bloom's Accuracy</span>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <Award size={20} color="#8B5CF6" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#8B5CF6' }}>{stats.avg_quality_score}%</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            T5 & BERT cognitive score
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Exam Boards</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <BarChart2 size={20} color="#F59E0B" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>CAIE & Edexcel</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            AO1, AO2, AO3 structure
          </p>
        </div>

      </div>

      {/* Visual Analytics Chart Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Bloom's Distribution Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} color="var(--accent-primary)" />
            Bloom's Taxonomy Cognitive Level Distribution
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Breakdown of generated questions by cognitive complexity. Standardized for Cambridge IGCSE & Edexcel.
          </p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloomData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {bloomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cognitive Proportions Pie Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', width: '100%', textAlign: 'left' }}>
            Cognitive Depth
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {bloomData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            {bloomData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
