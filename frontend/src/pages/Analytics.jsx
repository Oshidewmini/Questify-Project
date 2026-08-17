import React from 'react';
import { Clock, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const bloomData = [
  { name: 'Remember',   value: 22, color: '#3B82F6' },
  { name: 'Understand', value: 31, color: '#10B981' },
  { name: 'Apply',      value: 28, color: '#F59E0B' },
  { name: 'Analyze',    value: 11, color: '#EC4899' },
  { name: 'Evaluate',   value: 5,  color: '#8B5CF6' },
  { name: 'Create',     value: 3,  color: '#EF4444' },
];

const timelineData = [
  { month: 'Mar', papers: 1, questions: 12 },
  { month: 'Apr', papers: 2, questions: 28 },
  { month: 'May', papers: 3, questions: 41 },
  { month: 'Jun', papers: 4, questions: 58 },
  { month: 'Jul', papers: 4, questions: 45 },
];

const stats = [
  { label: 'Time Saved',       value: '88%',   sub: '~105 hours total',        icon: Clock,         color: '#10B981' },
  { label: 'Questions Generated', value: '184', sub: 'Across 14 exam papers',   icon: CheckCircle2,  color: '#3B82F6' },
  { label: 'Bloom Accuracy',   value: '96.4%', sub: 'T5 + BERT classification', icon: Award,         color: '#8B5CF6' },
  { label: 'Avg Marks / Paper', value: '52',   sub: 'Cambridge & Edexcel',      icon: TrendingUp,    color: '#F59E0B' },
];

export default function Analytics() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Quality metrics, time saved, and Bloom's distribution insights.</p>
      </div>
      <div className="page-content">

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {stats.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</span>
                <div style={{ padding:'0.4rem', borderRadius:'var(--radius-sm)', background:`${color}18` }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div style={{ fontSize:'2rem', fontWeight:800, color }}>{value}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
          <div className="glass-card" style={{ padding:'1.5rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.25rem' }}>Bloom's Taxonomy Distribution</h3>
            <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1.25rem' }}>Percentage of questions at each cognitive level across all papers.</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={bloomData} margin={{ top:5, right:10, left:-10, bottom:0 }}>
                <XAxis dataKey="name" fontSize={12} stroke="var(--text-secondary)" />
                <YAxis fontSize={12} stroke="var(--text-secondary)" unit="%" />
                <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--card-border)', borderRadius:'8px', color:'var(--text-primary)' }} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {bloomData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding:'1.5rem', display:'flex', flexDirection:'column' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem' }}>Cognitive Depth</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={bloomData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {bloomData.map((e,i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--card-border)', borderRadius:'8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.3rem', marginTop:'0.5rem' }}>
              {bloomData.map(d => (
                <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.72rem', color:'var(--text-secondary)' }}>
                  <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:d.color, flexShrink:0 }} />
                  {d.name}: {d.value}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card" style={{ padding:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Monthly Activity — Papers &amp; Questions Generated</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="month" fontSize={12} stroke="var(--text-secondary)" />
              <YAxis fontSize={12} stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ background:'var(--bg-secondary)', border:'1px solid var(--card-border)', borderRadius:'8px', color:'var(--text-primary)' }} />
              <Legend />
              <Line type="monotone" dataKey="papers" stroke="#6366F1" strokeWidth={2} dot={{ r:4 }} name="Papers" />
              <Line type="monotone" dataKey="questions" stroke="#22D3EE" strokeWidth={2} dot={{ r:4 }} name="Questions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
