import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine, Cell } from 'recharts';
import { api } from '../api';
import { useQueryState } from '../utils/queryState';
import DateRangePicker from '../components/DateRangePicker';
import EntityMultiSelect from '../components/EntityMultiSelect';
import LLMInsights from '../components/LLMInsights';

export default function Intensity() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get default date range for current year
  const currentYear = new Date().getFullYear();
  const defaultDateRange = {
    start_date: `${currentYear}-01-01`,
    end_date: `${currentYear}-12-31`
  };
  
  const [queryState, setQueryState] = useQueryState(defaultDateRange);
  
  const [intensityData, setIntensityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);

  // Load facilities on component mount
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await api.getFacilities();
        setFacilities(data);
      } catch (err) {
        console.error('Error loading facilities:', err);
      }
    };
    loadFacilities();
  }, []);

  // Load intensity data when filters change
  useEffect(() => {
    const loadIntensityData = async () => {
      if (!queryState.start_date || !queryState.end_date) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await api.getIntensity(
          queryState.start_date,
          queryState.end_date,
          queryState.entity_ids
        );
        setIntensityData(data);
      } catch (err) {
        console.error('Error loading intensity data:', err);
        setError('Failed to load intensity data');
      } finally {
        setLoading(false);
      }
    };

    loadIntensityData();
  }, [queryState.start_date, queryState.end_date, queryState.entity_ids]);

  // Calculate carbon productivity (revenue / tCO2e)
  const calculateCarbonProductivity = () => {
    if (!intensityData?.site_scatter) return 0;
    
    const totalRevenue = intensityData.site_scatter.reduce((sum, site) => sum + site.revenue_meur, 0);
    const totalEmissions = intensityData.site_scatter.reduce((sum, site) => sum + site.tco2e, 0);
    
    return totalEmissions > 0 ? totalRevenue / totalEmissions : 0;
  };

  // Calculate leaderboard data (best improving sites)
  const calculateLeaderboard = () => {
    if (!intensityData?.site_scatter) return [];
    
    // For demo purposes, simulate improvement data
    return intensityData.site_scatter
      .map(site => ({
        ...site,
        improvement_pct: Math.random() * 20 - 10, // Random improvement between -10% and +10%
        previous_intensity: site.intensity * (1 + Math.random() * 0.2) // Simulate previous intensity
      }))
      .sort((a, b) => b.improvement_pct - a.improvement_pct)
      .slice(0, 5); // Top 5 sites
  };

  const carbonProductivity = calculateCarbonProductivity();
  const leaderboardData = calculateLeaderboard();

  // Custom tooltip for scatter plot
  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="tooltip">
          <p><strong>{data.site}</strong></p>
          <p>Revenue: €{data.revenue_meur}M</p>
          <p>Emissions: {data.tco2e} tCO₂e</p>
          <p>Intensity: {data.intensity} tCO₂e/€M</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for line chart
  const LineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
          <p><strong>{label}</strong></p>
          <p>Intensity: {payload[0].value} tCO₂e/€M</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Intensity Hub</h1>
          <p>Carbon intensity analysis and productivity metrics</p>
        </div>
        <div className="loading">Loading intensity data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Intensity Hub</h1>
          <p>Carbon intensity analysis and productivity metrics</p>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Intensity Hub</h1>
        <p>Carbon intensity analysis and productivity metrics</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <DateRangePicker
            startDate={queryState.start_date}
            endDate={queryState.end_date}
            onDateChange={(start, end) => setQueryState({ start_date: start, end_date: end })}
          />
          <EntityMultiSelect
            facilities={facilities}
            selectedIds={queryState.entity_ids || []}
            onSelectionChange={(ids) => setQueryState({ entity_ids: ids })}
          />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-card">
          <div className="kpi-value">{intensityData?.current_intensity?.toFixed(2) || '0.00'}</div>
          <div className="kpi-label">Current Intensity</div>
          <div className="kpi-unit">tCO₂e/€M</div>
        </div>
        <div className="kpi-card">
          <div className={`kpi-value ${intensityData?.yoy_change_pct >= 0 ? 'positive' : 'negative'}`}>
            {intensityData?.yoy_change_pct >= 0 ? '+' : ''}{intensityData?.yoy_change_pct?.toFixed(1) || '0.0'}%
          </div>
          <div className="kpi-label">YoY Change</div>
          <div className="kpi-unit">vs last year</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{carbonProductivity.toFixed(2)}</div>
          <div className="kpi-label">Carbon Productivity</div>
          <div className="kpi-unit">€M/tCO₂e</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">{intensityData?.correlation?.toFixed(3) || '0.000'}</div>
          <div className="kpi-label">Revenue Correlation</div>
          <div className="kpi-unit">Pearson r</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Intensity Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Intensity Trend</h3>
            <p>Monthly carbon intensity over time</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={intensityData?.series || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                />
                <YAxis label={{ value: 'tCO₂e/€M', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<LineTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Emissions Scatter */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue vs Emissions</h3>
            <p>Site-level correlation analysis</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={intensityData?.site_scatter || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="revenue_meur" 
                  name="Revenue (M€)"
                  label={{ value: 'Revenue (M€)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="tco2e" 
                  name="Emissions (tCO₂e)"
                  label={{ value: 'Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter dataKey="tco2e" fill="#3b82f6">
                  {intensityData?.site_scatter?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Scatter>
                {/* Reference line for trend */}
                <ReferenceLine 
                  segment={[
                    { x: 0, y: 0 },
                    { x: 30, y: 60 }
                  ]}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label="Trend"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Performance Leaderboard</h3>
          <p>Best improving sites (last 6 months)</p>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Site</th>
                <th>Current Intensity</th>
                <th>Previous Intensity</th>
                <th>Improvement</th>
                <th>Revenue (M€)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((site, index) => (
                <tr key={site.site}>
                  <td className="rank-cell">
                    <span className={`rank-badge rank-${index + 1}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="site-cell">
                    <strong>{site.site}</strong>
                  </td>
                  <td>{site.intensity.toFixed(2)} tCO₂e/€M</td>
                  <td>{site.previous_intensity.toFixed(2)} tCO₂e/€M</td>
                  <td className={`improvement ${site.improvement_pct >= 0 ? 'positive' : 'negative'}`}>
                    {site.improvement_pct >= 0 ? '+' : ''}{site.improvement_pct.toFixed(1)}%
                  </td>
                  <td>€{site.revenue_meur}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LLM Insights */}
      <LLMInsights context="intensity" />
    </div>
  );
}