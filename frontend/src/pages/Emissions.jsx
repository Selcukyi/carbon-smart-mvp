import React, { useState, useEffect } from 'react';
import { useQueryState } from '../utils/queryState';
import { api } from '../api';
import DateRangePicker from '../components/DateRangePicker';
import EntityMultiSelect from '../components/EntityMultiSelect';
import LineCard from '../components/LineCard';
import DonutCard from '../components/DonutCard';
import BarCard from '../components/BarCard';
import TableCard from '../components/TableCard';
import DownloadMenu from '../components/DownloadMenu';
import LLMInsights from '../components/LLMInsights';
import NavSidebar from "../components/NavSidebar.jsx";
import { useAuth } from "../contexts/AuthContext";

export default function Emissions() {
  const { role, logout } = useAuth();
  const [queryState, setQueryState] = useQueryState({
    start: '2025-01-01',
    end: '2025-12-31',
    entities: '1,2',
    tab: 'total',
    pareto: 'false'
  });

  const [data, setData] = useState(null);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeepDive, setShowDeepDive] = useState(false);

  // Fetch entities data
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.getFacilities();
        setEntities(response);
      } catch (err) {
        console.error('Failed to fetch entities:', err);
        // Set mock entities as fallback
        setEntities([
          { id: 1, name: 'CarbonLens Group', city: 'Istanbul', country: 'Turkey' },
          { id: 2, name: 'Manufacturing Division', city: 'Izmir', country: 'Turkey' },
          { id: 3, name: 'Services Division', city: 'Ankara', country: 'Turkey' }
        ]);
      }
    };

    fetchEntities();
  }, []);

  // Fetch emissions data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          start: queryState.start,
          end: queryState.end,
          entities: queryState.entities,
          pareto: queryState.pareto === 'true'
        };
        
        const response = await api.getEmissions(params);
        setData(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch emissions data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryState.start, queryState.end, queryState.entities, queryState.pareto]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setQueryState({ [key]: value });
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setQueryState({ tab });
  };

  // Handle Pareto toggle
  const handleParetoToggle = () => {
    setQueryState({ pareto: queryState.pareto === 'true' ? 'false' : 'true' });
  };

  // Prepare data for different views
  const prepareLineData = () => {
    if (!data?.series) return [];
    return data.series.map(point => ({
      period: point.date,
      value: point.tco2e
    }));
  };

  const prepareDonutData = () => {
    if (!data?.scopes) return { data: [] };
    return {
      data: data.scopes.map(scope => ({
        name: scope.scope,
        value: scope.tco2e
      }))
    };
  };

  const prepareBarData = () => {
    if (!data?.top_categories) return [];
    return data.top_categories.map(cat => ({
      name: cat.category,
      value: cat.tco2e
    }));
  };

  const prepareTableData = () => {
    if (!data?.top_categories) return [];
    return data.top_categories.map((cat, index) => ({
      id: index + 1,
      activity: cat.category,
      entity: 'CarbonLens Group',
      facility: 'All Facilities',
      scope: 'Mixed',
      co2e: cat.tco2e,
      period: '2025'
    }));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
        <main className="main-content">
          <div className="page-container">
            <div className="page-header">
              <h1>Emissions Analysis</h1>
              <div className="filters">
                <div className="skeleton skeleton-filter"></div>
                <div className="skeleton skeleton-filter"></div>
                <div className="skeleton skeleton-toggle"></div>
              </div>
            </div>
            <div className="tabs">
              <div className="skeleton skeleton-tab"></div>
              <div className="skeleton skeleton-tab"></div>
              <div className="skeleton skeleton-tab"></div>
            </div>
            <div className="content">
              <div className="skeleton skeleton-chart"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
        <main className="main-content">
          <div className="page-container">
            <div className="page-header">
              <h1>Emissions Analysis</h1>
            </div>
            <div className="error-banner">
              <div className="error-icon">⚠️</div>
              <div className="error-message">{error}</div>
              <button 
                className="btn btn-sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="flex min-h-screen">
        <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
        <main className="main-content">
          <div className="page-container">
            <div className="page-header">
              <h1>Emissions Analysis</h1>
            </div>
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-message">No emissions data available</div>
              <div className="empty-description">Try adjusting your date range or entity selection</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
      <main className="main-content">
      <div className="page-container">
      {/* Header with Filters */}
      <div className="page-header">
        <div>
          <h1>Emissions Analysis</h1>
          <div className="page-subtitle">Track and analyze organizational emissions across time, scopes and categories</div>
        </div>
        <div className="toolbar">
          <button className="btn">Export</button>
          <button className="btn btn-primary">New Report</button>
        </div>
      </div>
      <div className="filters">
          <div className="filter-section">
            <label className="filter-label">📅 Date Range</label>
            <div className="date-range-container">
              <div className="date-inputs">
                <div className="date-input-group">
                  <input
                    type="date"
                    className="date-input"
                    value={queryState.start}
                    onChange={(e) => handleFilterChange('start', e.target.value)}
                  />
                </div>
                <div className="date-separator">to</div>
                <div className="date-input-group">
                  <input
                    type="date"
                    className="date-input"
                    value={queryState.end}
                    onChange={(e) => handleFilterChange('end', e.target.value)}
                  />
                </div>
              </div>
              <div className="quick-date-buttons">
                <button 
                  className="quick-date-btn"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    handleFilterChange('start', today);
                    handleFilterChange('end', today);
                  }}
                >
                  Today
                </button>
                <button 
                  className="quick-date-btn"
                  onClick={() => {
                    const end = new Date().toISOString().split('T')[0];
                    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    handleFilterChange('start', start);
                    handleFilterChange('end', end);
                  }}
                >
                  Last 7 days
                </button>
                <button 
                  className="quick-date-btn"
                  onClick={() => {
                    const now = new Date();
                    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                    handleFilterChange('start', start);
                    handleFilterChange('end', end);
                  }}
                >
                  This month
                </button>
                <button 
                  className="quick-date-btn"
                  onClick={() => {
                    const now = new Date();
                    const quarter = Math.floor(now.getMonth() / 3);
                    const start = new Date(now.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
                    const end = new Date(now.getFullYear(), quarter * 3 + 3, 0).toISOString().split('T')[0];
                    handleFilterChange('start', start);
                    handleFilterChange('end', end);
                  }}
                >
                  This quarter
                </button>
                <button 
                  className="quick-date-btn"
                  onClick={() => {
                    const now = new Date();
                    const start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    const end = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
                    handleFilterChange('start', start);
                    handleFilterChange('end', end);
                  }}
                >
                  This year
                </button>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">🏢 Select Entities</label>
            <EntityMultiSelect
              entities={entities}
              selectedIds={queryState.entities.split(',').map(Number)}
              onSelectionChange={(selectedIds) => handleFilterChange('entities', selectedIds.join(','))}
            />
          </div>

          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={queryState.pareto === 'true'}
                onChange={handleParetoToggle}
              />
              <div>
                <span className="toggle-text">Pareto 80/20 Analysis</span>
                <div className="toggle-description">Focus on top 20% of emission sources</div>
              </div>
            </label>
          </div>
        </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${queryState.tab === 'total' ? 'active' : ''}`}
          onClick={() => handleTabChange('total')}
        >
          Total & Trend
        </button>
        <button
          className={`tab ${queryState.tab === 'scopes' ? 'active' : ''}`}
          onClick={() => handleTabChange('scopes')}
        >
          Scopes
        </button>
        <button
          className={`tab ${queryState.tab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          Top Categories
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="content">
        {queryState.tab === 'total' && (
          <div className="tab-content">
            {/* KPI Strip */}
            <div className="kpi-strip">
              <div className="kpi-item">
                <div className="kpi-label">Total Emissions</div>
                <div className="kpi-value">{data.summary?.total_tco2e || 0} tCO₂e</div>
              </div>
              <div className="kpi-item">
                <div className="kpi-label">YoY Change</div>
                <div className={`kpi-value ${(data.summary?.yoy_pct || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {data.summary?.yoy_pct ? `${data.summary.yoy_pct > 0 ? '+' : ''}${data.summary.yoy_pct}%` : 'N/A'}
                </div>
              </div>
            </div>
            
            {/* Line Chart */}
            <div className="chart-container">
              <LineCard data={prepareLineData()} />
            </div>
          </div>
        )}

        {queryState.tab === 'scopes' && (
          <div className="tab-content">
            <div className="chart-grid">
              <div className="chart-item">
                <DonutCard data={prepareDonutData()} />
              </div>
              <div className="chart-item">
                <TableCard 
                  data={data.scopes?.map((scope, index) => ({
                    id: index + 1,
                    activity: scope.scope,
                    entity: 'CarbonLens Group',
                    facility: 'All Facilities',
                    scope: scope.scope,
                    co2e: scope.tco2e,
                    period: '2025'
                  })) || []}
                />
              </div>
            </div>
          </div>
        )}

        {queryState.tab === 'categories' && (
          <div className="tab-content">
            <div className="chart-container">
              <BarCard data={prepareBarData()} />
            </div>
            <div className="chart-actions">
              <button
                className="btn btn-primary"
                onClick={() => setShowDeepDive(true)}
              >
                Deep Dive
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deep Dive Modal */}
      {showDeepDive && (
        <div className="modal-overlay" onClick={() => setShowDeepDive(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Deep Dive Analysis</h3>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowDeepDive(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <TableCard data={prepareTableData()} />
              <div className="download-actions">
                <DownloadMenu
                  data={prepareTableData()}
                  filename="emissions-deep-dive"
                  formats={['csv', 'png']}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LLM Insights */}
      <div className="insights-section">
        <LLMInsights
          context="emissions"
          data={data}
        />
      </div>
      </div>
      </main>
    </div>
  );
}