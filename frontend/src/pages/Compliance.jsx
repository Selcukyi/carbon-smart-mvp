import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from "recharts";
import { api } from "../api.js";
import { queryState } from "../utils/queryState.js";
import EntityMultiSelect from "../components/EntityMultiSelect.jsx";
import LLMInsights from "../components/LLMInsights.jsx";

export default function Compliance() {
  const location = useLocation();
  const navigate = useNavigate();
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entities, setEntities] = useState([]);
  const [priceInputs, setPriceInputs] = useState([90, 120, 150]);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [alertThreshold, setAlertThreshold] = useState(95);
  const [showAlert, setShowAlert] = useState(false);

  // Get query state
  const currentQuery = queryState(location.search);

  // Fetch entities data
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.getFacilities();
        setEntities(response);
      } catch (err) {
        console.error('Failed to fetch entities:', err);
        setEntities([
          { id: 1, name: 'CarbonLens Group', city: 'Istanbul', country: 'Turkey' },
          { id: 2, name: 'Manufacturing Division', city: 'Izmir', country: 'Turkey' },
          { id: 3, name: 'Services Division', city: 'Ankara', country: 'Turkey' }
        ]);
      }
    };

    fetchEntities();
  }, []);

  // Fetch compliance data
  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const start = currentQuery.start || "2025-01-01";
        const end = currentQuery.end || "2025-12-31";
        const entities = currentQuery.entities ? currentQuery.entities.split(',').map(Number) : null;
        
        const data = await api.getCompliance(start, end, entities, priceInputs);
        setComplianceData(data);
        
        // Check alert threshold
        if (data.allowances && data.allowances.length > 0) {
          const totalAllocated = data.allowances.reduce((sum, allowance) => sum + allowance.allocated, 0);
          const totalActual = data.allowances.reduce((sum, allowance) => sum + allowance.actual, 0);
          const percentage = (totalActual / totalAllocated) * 100;
          
          if (percentage >= alertThreshold) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000); // Hide after 5 seconds
          }
        }
      } catch (err) {
        console.error('Failed to fetch compliance data:', err);
        setError('Failed to load compliance data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [currentQuery.start, currentQuery.end, currentQuery.entities, priceInputs]);

  const handleFilterChange = (key, value) => {
    const newQuery = { ...currentQuery, [key]: value };
    const searchParams = new URLSearchParams();
    
    Object.entries(newQuery).forEach(([k, v]) => {
      if (v) searchParams.set(k, v);
    });
    
    navigate(`/compliance?${searchParams.toString()}`);
  };

  const handlePriceChange = (index, newValue) => {
    const newPrices = [...priceInputs];
    newPrices[index] = parseFloat(newValue) || 0;
    setPriceInputs(newPrices);
  };

  const addPriceInput = () => {
    if (newPrice && !isNaN(parseFloat(newPrice))) {
      setPriceInputs([...priceInputs, parseFloat(newPrice)]);
      setNewPrice("");
    }
  };

  const removePriceInput = (index) => {
    if (priceInputs.length > 1) {
      setPriceInputs(priceInputs.filter((_, i) => i !== index));
    }
  };

  const getRiskLevel = (overshoot) => {
    if (overshoot < 100) return { level: "Low", color: "green" };
    if (overshoot < 300) return { level: "Medium", color: "yellow" };
    return { level: "High", color: "red" };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-EU', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Compliance Hub</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading compliance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Compliance Hub</h1>
        </div>
        <div className="error-banner">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskLevel(complianceData?.current_overshoot_tco2e || 0);

  return (
    <div className="page">
      {/* Alert Toast */}
      {showAlert && (
        <div className="alert-toast">
          <div className="alert-content">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">Threshold reached: Actual emissions exceed {alertThreshold}% of allocation</span>
            <button className="alert-close" onClick={() => setShowAlert(false)}>×</button>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1>Compliance Hub</h1>
        <p>EU ETS allowances, actuals, and cost scenarios</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-section">
          <label className="filter-label">📅 Date Range</label>
          <div className="date-range-container">
            <div className="date-inputs">
              <div className="date-input-group">
                <input
                  type="date"
                  className="date-input"
                  value={currentQuery.start || "2025-01-01"}
                  onChange={(e) => handleFilterChange('start', e.target.value)}
                />
              </div>
              <div className="date-separator">to</div>
              <div className="date-input-group">
                <input
                  type="date"
                  className="date-input"
                  value={currentQuery.end || "2025-12-31"}
                  onChange={(e) => handleFilterChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">🏢 Select Entities</label>
          <EntityMultiSelect
            entities={entities}
            selectedIds={currentQuery.entities ? currentQuery.entities.split(',').map(Number) : []}
            onSelectionChange={(selectedIds) => handleFilterChange('entities', selectedIds.join(','))}
          />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="kpi-strip">
        <div className="kpi-card">
          <div className="kpi-label">Overshoot</div>
          <div className="kpi-value">{formatNumber(complianceData?.current_overshoot_tco2e || 0)}</div>
          <div className="kpi-unit">tCO₂e</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-label">Risk Level</div>
          <div className={`kpi-value risk-${riskInfo.color}`}>{riskInfo.level}</div>
          <div className="kpi-unit">Status</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-label">YTD Cost</div>
          <div className="kpi-value">{formatCurrency(complianceData?.ytd_cost_eur || 0)}</div>
          <div className="kpi-unit">EUR</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Allocation vs Actual Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Allocation vs Actual</h3>
            <p>Monthly comparison of allocated allowances vs actual emissions</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={complianceData?.allowances || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [formatNumber(value), name === 'allocated' ? 'Allocated' : 'Actual']}
                />
                <Bar dataKey="allocated" fill="#22c55e" name="allocated" />
                <Bar dataKey="actual" fill="#ef4444" name="actual" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Price Scenarios Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Carbon Price Scenarios</h3>
            <p>Financial exposure under different carbon price scenarios</p>
          </div>
          <div className="price-inputs">
            <div className="price-chips">
              {priceInputs.map((price, index) => (
                <div key={index} className="price-chip">
                  {editingPrice === index ? (
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      onBlur={() => setEditingPrice(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingPrice(null)}
                      className="price-input"
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => setEditingPrice(index)} className="price-value">
                      €{price}
                    </span>
                  )}
                  <button 
                    onClick={() => removePriceInput(index)}
                    className="price-remove"
                    disabled={priceInputs.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="price-add">
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPriceInput()}
                  placeholder="Add price"
                  className="price-input-small"
                />
                <button onClick={addPriceInput} className="price-add-btn">+</button>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData?.scenarios || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price_eur" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Exposure']}
                  labelFormatter={(value) => `Price: €${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="exposure_eur" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alert Controls */}
      <div className="alert-controls">
        <div className="alert-setting">
          <label htmlFor="alert-threshold">Set Alert Threshold:</label>
          <div className="threshold-input">
            <input
              id="alert-threshold"
              type="range"
              min="80"
              max="100"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              className="threshold-slider"
            />
            <span className="threshold-value">{alertThreshold}%</span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            if (complianceData?.allowances && complianceData.allowances.length > 0) {
              const totalAllocated = complianceData.allowances.reduce((sum, allowance) => sum + allowance.allocated, 0);
              const totalActual = complianceData.allowances.reduce((sum, allowance) => sum + allowance.actual, 0);
              const percentage = (totalActual / totalAllocated) * 100;
              
              if (percentage >= alertThreshold) {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
              } else {
                alert(`Current usage: ${percentage.toFixed(1)}% - Below threshold`);
              }
            }
          }}
        >
          Test Alert
        </button>
      </div>

      {/* LLM Insights */}
      <LLMInsights context="compliance" />
    </div>
  );
}