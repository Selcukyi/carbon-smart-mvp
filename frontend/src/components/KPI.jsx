import { useState } from 'react';

export default function KPI({ title, value, suffix = "", icon = null, story = null, trend = null, status = null, aiExplanation = null }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAIExplain = async () => {
    if (aiExplanation) {
      setShowExplanation(!showExplanation);
      return;
    }

    setIsLoading(true);
    // Simulate AI explanation generation
    setTimeout(() => {
      setIsLoading(false);
      setShowExplanation(true);
    }, 1500);
  };

  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="kpi-title">{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon ? <div style={{ color: '#16a34a' }}>{icon}</div> : null}
          <button 
            className="ai-explain-btn"
            onClick={handleAIExplain}
            disabled={isLoading}
          >
            {isLoading ? '🤖' : '🧠'} {isLoading ? 'Analyzing...' : 'AI Explain'}
          </button>
        </div>
      </div>
      <div className="kpi-value">
        {value}
        {suffix}
      </div>
      {story && (
        <div className="kpi-story">
          {story}
        </div>
      )}
      {trend && (
        <div className="kpi-trend">
          {trend}
        </div>
      )}
      {showExplanation && (
        <div className="ai-explanation">
          <div className="ai-explanation-header">
            <span className="ai-icon">🤖</span>
            <span className="ai-title">AI Analysis</span>
            <button 
              className="close-btn"
              onClick={() => setShowExplanation(false)}
            >
              ✕
            </button>
          </div>
          <div className="ai-explanation-content">
            {aiExplanation || `This KPI represents ${title.toLowerCase()}. The value of ${value}${suffix} indicates ${status === 'warning' ? 'a situation requiring attention' : 'normal operational parameters'}. ${trend ? `The trend shows ${trend.replace('↗️', 'an increase').replace('↘️', 'a decrease').replace('→', 'stability')}.` : ''} This metric is crucial for monitoring carbon emissions and ensuring compliance with environmental regulations.`}
          </div>
        </div>
      )}
    </div>
  );
}

