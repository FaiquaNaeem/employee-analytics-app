// Component to fetch, parse, and display the AI recommendation for an employee
import React, { useState } from 'react';
import api from '../utils/axiosConfig';

export default function AIRecommendation({ employee, onRecommendationUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Triggers the AI backend generation
  const generateRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/ai/recommend`, { employeeId: employee._id });
      
      // Update parent component state
      if (onRecommendationUpdated) {
        onRecommendationUpdated(employee._id, res.data.recommendation);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  // Parses the plain text AI response into structured sections
  const parseRecommendation = (text) => {
    const parsed = {
      promotion: '',
      training: [],
      feedback: '',
      ranking: ''
    };
    
    // 1. Promotion Extraction
    const promoMatch = text.match(/(?:1\.\s*)?Promotion Recommendation:?\s*(.*)(?=\n2|$)/i) || 
                       text.match(/Promotion Recommendation:?\s*(.*)/i);
    if (promoMatch) parsed.promotion = promoMatch[1].trim();

    // 2. Training Suggestions Extraction
    const trainMatch = text.match(/(?:2\.\s*)?Training Suggestions:?\s*([\s\S]*?)(?=\n3|$)/i) ||
                       text.match(/Training Suggestions:?\s*([\s\S]*?)(?=Performance Feedback|$)/i);
    if (trainMatch) {
      parsed.training = trainMatch[1].split('\n').map(s => s.replace(/^[-*•\s\d.]+/g, '').trim()).filter(Boolean);
    }

    // 3. Performance Feedback Extraction
    const feedMatch = text.match(/(?:3\.\s*)?Performance Feedback:?\s*([\s\S]*?)(?=\n4|$)/i) ||
                      text.match(/Performance Feedback:?\s*([\s\S]*?)(?=Overall Ranking|$)/i);
    if (feedMatch) parsed.feedback = feedMatch[1].trim();

    // 4. Overall Ranking Extraction
    const rankMatch = text.match(/(?:4\.\s*)?Overall Ranking:?\s*(.*)/i) ||
                      text.match(/Overall Ranking:?\s*(.*)/i);
    if (rankMatch) parsed.ranking = rankMatch[1].trim();

    // Fallback if regex completely fails to parse the new AI format
    if (!parsed.promotion && !parsed.training.length && !parsed.feedback && !parsed.ranking) {
      parsed.raw = text;
    }

    return parsed;
  };

  if (!employee) return null;

  const hasRecommendation = Boolean(employee.aiRecommendation);
  const data = hasRecommendation ? parseRecommendation(employee.aiRecommendation) : null;

  return (
    <div className="ai-recommendation-card" style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', marginTop: '15px', backgroundColor: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ marginTop: 0, color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        🤖 AI Performance Analysis
      </h3>
      
      {error && <p style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px' }}>{error}</p>}
      
      {!hasRecommendation && !loading && (
        <button 
          onClick={generateRecommendation} 
          style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Generate AI Recommendation ✨
        </button>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
          <span style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>⏳</span>
          <p>Analyzing employee data...</p>
        </div>
      )}

      {hasRecommendation && data && (
        <div className="recommendation-content" style={{ marginTop: '15px' }}>
          {data.raw ? (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#475569' }}>{data.raw}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <strong style={{ color: '#475569', display: 'block', marginBottom: '5px' }}>Promotion Status</strong>
                <span style={{ 
                  backgroundColor: data.promotion.toLowerCase().includes('yes') ? '#dcfce7' : '#fee2e2',
                  color: data.promotion.toLowerCase().includes('yes') ? '#166534' : '#991b1b',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.9em',
                  display: 'inline-block'
                }}>
                  {data.promotion}
                </span>
              </div>
              
              <div>
                <strong style={{ color: '#475569', display: 'block', marginBottom: '5px' }}>Training Suggestions</strong>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#334155' }}>
                  {data.training.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <strong style={{ color: '#475569', display: 'block', marginBottom: '5px' }}>Performance Feedback</strong>
                <p style={{ margin: '0', color: '#334155', lineHeight: '1.5', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {data.feedback}
                </p>
              </div>
              
              <div>
                <strong style={{ color: '#475569', display: 'block', marginBottom: '5px' }}>Overall Ranking</strong>
                <span style={{ 
                  backgroundColor: data.ranking.toLowerCase().includes('excellent') ? '#dcfce7' : 
                                   data.ranking.toLowerCase().includes('good') ? '#dbeafe' : 
                                   data.ranking.toLowerCase().includes('average') ? '#fef3c7' : '#fee2e2',
                  color: '#0f172a',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.9em',
                  display: 'inline-block'
                }}>
                  {data.ranking}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
