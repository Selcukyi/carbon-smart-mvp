import { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { mockLLMInsights } from "../lib/mockData.js";

export default function LLMInsights() {
  const [insights, setInsights] = useState(mockLLMInsights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRisk, setExpandedRisk] = useState(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  useEffect(() => {
    loadLLMInsights();
  }, []);

  const loadLLMInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAllLLMInsights();
      if (response.success) {
        setInsights(response.data);
      }
    } catch (err) {
      console.error("LLM insights failed:", err);
      setError("AI analizi yüklenemedi, varsayılan veriler gösteriliyor.");
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  // Handle both real API response (snake_case) and mock data (camelCase)
  const executiveSummary = insights.executive_summary || insights.executiveSummary;
  const keyRecommendations = insights.recommendations || insights.keyRecommendations;
  const riskAnalysis = insights.risk_analysis || insights.riskAnalysis;
  const performanceMetrics = insights.performance_metrics || insights.performanceMetrics;

  return (
    <div className="llm-insights">
      {/* Loading and Error States */}
      {loading && (
        <div className="insight-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.125rem', color: '#16a34a', marginBottom: '0.5rem' }}>
              🤖 AI analizi yapılıyor...
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              LLM verilerinizi analiz ediyor ve öneriler hazırlıyor
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="insight-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '0.5rem' }}>
            ⚠️ AI Analizi Uyarısı
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {error}
          </div>
        </div>
      )}

              {/* Executive Summary */}
              <div className="insight-card priority-high">
                <div className="insight-header">
                  <h3>{executiveSummary?.title || "Executive Summary"}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={loadLLMInsights}
                      disabled={loading}
                      className="btn btn-sm"
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      {loading ? 'Yenileniyor...' : '🔄 Yenile'}
                    </button>
                    <div className="priority-badge high">High Priority</div>
                  </div>
                </div>
                <div className="insight-content">
                  <p>{executiveSummary?.content || executiveSummary?.executive_summary || "AI analizi yükleniyor..."}</p>
                  <div className="impact-highlight">
                    <strong>Financial Impact:</strong> {executiveSummary?.impact || executiveSummary?.financial_impact || "Hesaplanıyor..."}
                  </div>
                </div>
              </div>

      {/* Key Recommendations */}
      <div className="insight-card">
        <div className="insight-header">
          <h3>AI-Powered Recommendations</h3>
          <div className="ai-badge">🤖 LLM Analysis</div>
        </div>
        <div className="recommendations-grid">
          {(keyRecommendations || []).map((rec, index) => (
            <div key={index} className="recommendation-card" data-priority={rec.priority} onClick={() => setExpandedRecommendation(expandedRecommendation === index ? null : index)}>
              <div className="rec-header">
                <h4>{rec.title}</h4>
                <div className={`priority-badge ${rec.priority}`}>{rec.priority}</div>
              </div>
              <p className="rec-description">{rec.description}</p>
              <div className="rec-metrics">
                <div className="metric">
                  <span className="metric-label">Cost:</span>
                  <span className="metric-value">{rec.cost}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Annual Savings:</span>
                  <span className="metric-value savings">{rec.savings || rec.annual_savings}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Timeline:</span>
                  <span className="metric-value">{rec.timeline}</span>
                </div>
              </div>
              {expandedRecommendation === index && (
                <div className="recommendation-expanded">
                  <div className="expanded-details">
                    <h5>📊 Detailed Analysis</h5>
                    <p><strong>Emission Reduction:</strong> {rec.emission_reduction}</p>
                    <p><strong>ROI:</strong> {rec.annual_savings && rec.cost ? 
                      `%${Math.round((parseInt(rec.annual_savings.replace(/[€,]/g, '')) / parseInt(rec.cost.replace(/[€,]/g, ''))) * 100)}` : 
                      'Calculating...'}</p>
                    <p><strong>Implementation Steps:</strong></p>
                    <ul>
                      <li>Project planning and budget approval</li>
                      <li>Vendor selection and contracting</li>
                      <li>Implementation and testing process</li>
                      <li>Monitoring and optimization</li>
                    </ul>
                  </div>
                </div>
              )}
              <button className="btn btn-sm">Implement</button>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="insight-card">
        <div className="insight-header">
          <h3>{riskAnalysis?.title || "Risk Analysis"}</h3>
          <div className="ai-badge">🤖 LLM Analysis</div>
        </div>
        <div className="insight-content">
          <p>{riskAnalysis?.content || "Risk analysis loading..."}</p>
          <div className="risks-list">
            {(riskAnalysis?.risks || []).map((risk, index) => (
              <div key={index} className="risk-item" onClick={() => setExpandedRisk(expandedRisk === index ? null : index)}>
                <div className="risk-header">
                  <span className="risk-name">{risk.risk}</span>
                  <div className={`risk-probability ${risk.probability.toLowerCase()}`}>
                    {risk.probability}
                  </div>
                </div>
                <div className="risk-details">
                  <div className="risk-impact">Impact: {risk.impact}</div>
                  <div className="risk-mitigation">Mitigation: {risk.mitigation}</div>
                  {expandedRisk === index && risk.details && (
                    <div className="risk-expanded">
                      <div className="risk-details-text">
                        <strong>📋 Detailed Analysis:</strong>
                        <p>{risk.details}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="insight-card">
        <div className="insight-header">
          <h3>{performanceMetrics?.title || "Performance Metrics"}</h3>
          <div className="ai-badge">🤖 LLM Analysis</div>
        </div>
        <div className="insight-content">
          <p>{performanceMetrics?.content || "Performance metrics loading..."}</p>
          <div className="metrics-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Your Value</th>
                  <th>Industry Average</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(performanceMetrics?.metrics || []).map((metric, index) => (
                  <tr key={index}>
                    <td>{metric.metric}</td>
                    <td>{metric.value}</td>
                    <td>{metric.benchmark}</td>
                    <td>
                      <span className={`status-badge ${metric.status}`}>
                        {metric.status === 'above' ? 'Above Average' : 'Below Average'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}