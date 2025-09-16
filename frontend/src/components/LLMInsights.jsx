import { useState, useEffect } from "react";
import { api } from "../api.js";
import { mockLLMInsights } from "../mockData.js";

export default function LLMInsights({ context = "general" }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRisk, setExpandedRisk] = useState(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      // Use different mock data based on context
      const contextInsights = context === "compliance" 
        ? getComplianceInsights() 
        : context === "intensity" 
        ? getIntensityInsights() 
        : mockLLMInsights;
      setInsights(contextInsights);
      setLoading(false);
      setError(null);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(timer);
  }, [context]);

  // Handle both real API response (snake_case) and mock data (camelCase)
  const executiveSummary = insights?.executive_summary || insights?.executiveSummary;
  const keyRecommendations = insights?.recommendations || insights?.keyRecommendations;
  const riskAnalysis = insights?.risk_analysis || insights?.riskAnalysis;
  const performanceMetrics = insights?.performance_metrics || insights?.performanceMetrics;

  // Show loading state
  if (loading) {
    return (
      <div className="llm-insights">
        <div className="insight-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.125rem', color: '#16a34a', marginBottom: '0.5rem' }}>
              🤖 AI analizi yapılıyor...
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              LLM verilerinizi analiz ediyor ve öneriler hazırlıyor
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#16a34a',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#16a34a',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#16a34a',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="llm-insights">
        <div className="insight-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#f59e0b', fontWeight: '600', marginBottom: '0.5rem' }}>
            ⚠️ AI Analizi Uyarısı
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="llm-insights">

              {/* Executive Summary */}
              <div className="insight-card priority-high">
                <div className="insight-header">
                  <h3>{executiveSummary?.title || "Executive Summary"}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => {}}
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

// Compliance-specific insights
function getComplianceInsights() {
  return {
    executiveSummary: {
      title: "Compliance Summary",
      content: "Current EU ETS compliance status shows significant overshoot of 329.82 tCO₂e, resulting in €28,199.61 in additional costs. Immediate action required to address allowance deficit and optimize carbon pricing strategy.",
      impact: "€28,199.61 additional cost for exceeding EU ETS allowances"
    },
    recommendations: [
      {
        title: "Immediate Allowance Purchase",
        description: "Purchase additional EU ETS allowances to cover current deficit",
        impact: "High",
        cost: "High",
        savings: "€0",
        annual_savings: "€0",
        timeline: "1-2 weeks",
        priority: "High"
      },
      {
        title: "Emission Reduction Program",
        description: "Implement rapid emission reduction measures to minimize future overshoot",
        impact: "Very High",
        cost: "Medium",
        savings: "€15,000",
        annual_savings: "€15,000",
        timeline: "3-6 months",
        priority: "High"
      },
      {
        title: "Carbon Price Hedging",
        description: "Implement hedging strategy to manage carbon price volatility",
        impact: "Medium",
        cost: "Low",
        savings: "€5,000",
        annual_savings: "€5,000",
        timeline: "1-3 months",
        priority: "Medium"
      }
    ],
    riskAnalysis: {
      title: "Compliance Risk Analysis",
      content: "High-risk compliance situation with multiple financial and regulatory exposures requiring immediate attention.",
      risks: [
        {
          risk: "EU ETS Penalty Risk",
          probability: "High",
          impact: "€28,199.61 immediate cost",
          mitigation: "Purchase allowances immediately",
          details: "Current overshoot of 329.82 tCO₂e exceeds allocated allowances, triggering immediate financial penalties at current market rates."
        },
        {
          risk: "Price Volatility Exposure",
          probability: "Medium",
          impact: "€10,000-50,000 additional cost",
          mitigation: "Implement hedging strategy",
          details: "Carbon prices are volatile and could increase significantly, amplifying financial exposure beyond current estimates."
        },
        {
          risk: "Regulatory Scrutiny",
          probability: "Medium",
          impact: "Increased compliance requirements",
          mitigation: "Proactive compliance reporting",
          details: "Persistent overshoot may trigger additional regulatory oversight and stricter compliance requirements."
        }
      ]
    },
    performanceMetrics: {
      title: "Compliance Performance Metrics",
      content: "Current compliance metrics compared to EU ETS requirements and industry benchmarks.",
      metrics: [
        {
          metric: "Allowance Utilization",
          value: "113.2%",
          benchmark: "100%",
          status: "above"
        },
        {
          metric: "Cost per tCO₂e",
          value: "€85.50",
          benchmark: "€75.00",
          status: "above"
        },
        {
          metric: "Compliance Score",
          value: "65%",
          benchmark: "90%",
          status: "below"
        },
        {
          metric: "Risk Level",
          value: "High",
          benchmark: "Low",
          status: "above"
        }
      ]
    }
  };
}

// Intensity-specific insights
function getIntensityInsights() {
  return {
    executiveSummary: {
      title: "Carbon Intensity Analysis",
      content: "Current carbon intensity stands at 2.28 tCO₂e/€M with a 5.2% year-over-year improvement. Revenue-emissions correlation of 0.894 indicates strong positive relationship, suggesting growth-driven emissions. Focus on decoupling strategies recommended.",
      impact: "5.2% intensity improvement achieved year-over-year"
    },
    recommendations: [
      {
        title: "Implement Energy Efficiency Programs",
        description: "Deploy smart building technologies and renewable energy systems across all facilities to reduce energy-related emissions per revenue unit.",
        priority: "high",
        effort: "medium",
        impact: "high",
        details: "Focus on Munich HQ and Hamburg Plant which show highest intensity values. Expected 15-20% reduction in energy-related emissions."
      },
      {
        title: "Optimize Supply Chain Operations",
        description: "Review and optimize logistics routes, supplier selection, and transportation methods to reduce Scope 3 emissions intensity.",
        priority: "medium",
        effort: "high",
        impact: "medium",
        details: "Analyze current supplier carbon footprints and implement green procurement policies. Target 10-15% reduction in logistics emissions."
      },
      {
        title: "Revenue Growth Decoupling",
        description: "Develop strategies to grow revenue while maintaining or reducing absolute emissions through digital transformation and process optimization.",
        priority: "high",
        effort: "high",
        impact: "high",
        details: "Implement digital solutions, automation, and circular economy principles to achieve negative intensity growth despite revenue increases."
      }
    ],
    riskAnalysis: {
      title: "Intensity Risk Assessment",
      content: "Moderate risk level due to strong revenue-emissions correlation. Current improvement trajectory is positive but may not be sufficient for long-term climate targets. Key risks include regulatory changes and market pressure for carbon-neutral operations.",
      level: "moderate",
      factors: [
        "Strong revenue-emissions correlation (0.894) limits decoupling flexibility",
        "Seasonal intensity variations indicate weather dependency",
        "Site-level performance varies significantly (1.86-2.94 tCO₂e/€M range)",
        "Limited historical data for trend analysis"
      ]
    },
    performanceMetrics: {
      title: "Performance Metrics",
      content: "Carbon productivity of 0.44 €M/tCO₂e shows room for improvement. Leaderboard analysis reveals top performers achieving 15-20% intensity reductions. Focus on replicating best practices across all sites.",
      metrics: [
        {
          metric: "Current Intensity",
          value: "2.28 tCO₂e/€M",
          benchmark: "2.0 tCO₂e/€M",
          status: "above"
        },
        {
          metric: "YoY Improvement",
          value: "5.2%",
          benchmark: "10%",
          status: "below"
        },
        {
          metric: "Carbon Productivity",
          value: "0.44 €M/tCO₂e",
          benchmark: "0.50 €M/tCO₂e",
          status: "below"
        },
        {
          metric: "Site Performance Range",
          value: "1.86-2.94",
          benchmark: "<1.0 range",
          status: "above"
        }
      ]
    }
  };
}