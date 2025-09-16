import { useState } from 'react';

export default function KPI({ title, value, suffix = "", color = "from-blue-500 to-cyan-500", story = null, trend = null, status = null, aiExplanation = null }) {
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

  const getTrendClass = (trendText) => {
    if (!trendText) return 'neutral';
    if (trendText.includes('↗️') || trendText.includes('+')) return 'positive';
    if (trendText.includes('↘️') || trendText.includes('-')) return 'negative';
    return 'neutral';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return null;
    }
  };

  return (
    <div className="kpi-card">
      {/* Header */}
      <div className="kpi-card-header">
        <div className="kpi-title">{title}</div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          {status && (
            <div className={`kpi-status ${getStatusClass(status)}`}>
              {status}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="kpi-value">
        {value}
        <span className="kpi-suffix">{suffix}</span>
      </div>

      {/* Trend */}
      {trend && (
        <div className={`kpi-trend ${getTrendClass(trend)}`}>
          <span>{trend}</span>
        </div>
      )}

      {/* Story */}
      {story && (
        <div className="kpi-story">
          {story}
        </div>
      )}

      {/* AI Explanation Button */}
      <div className="mt-4 pt-4 border-t border-light">
        <button 
          className="btn btn-ghost btn-sm w-full"
          onClick={handleAIExplain}
          disabled={isLoading}
        >
          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
          {isLoading ? 'Analyzing...' : 'AI Explain'}
        </button>
      </div>

      {/* AI Explanation Panel */}
      {showExplanation && (
        <div className="mt-4 p-4 bg-secondary rounded-lg border border-light">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span className="font-semibold text-sm">AI Analysis</span>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowExplanation(false)}
            >
              <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
                <div className="w-2 h-0.5 bg-white"></div>
              </div>
            </button>
          </div>
          <div className="text-sm text-secondary leading-relaxed">
            {aiExplanation || `This KPI represents ${title.toLowerCase()}. The value of ${value}${suffix} indicates ${status === 'warning' ? 'a situation requiring attention' : 'normal operational parameters'}. ${trend ? `The trend shows ${trend.replace('↗️', 'an increase').replace('↘️', 'a decrease').replace('→', 'stability')}.` : ''} This metric is crucial for monitoring carbon emissions and ensuring compliance with environmental regulations.`}
          </div>
        </div>
      )}
    </div>
  );
}

