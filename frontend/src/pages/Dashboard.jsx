import NavSidebar from "../components/NavSidebar.jsx";
import KPI from "../components/KPI.jsx";
import DonutCard from "../components/DonutCard.jsx";
import BarCard from "../components/BarCard.jsx";
import LineCard from "../components/LineCard.jsx";
import TableCard from "../components/TableCard.jsx";
import LLMInsights from "../components/LLMInsights.jsx";
import { mockKPIs, mockDonut, mockBarCategories, mockTrend, mockTopActivities } from "../mockData.js";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, role, logout } = useAuth();
  const [emissionsData, setEmissionsData] = useState({
    total: 2847,
    scope1: 891,
    scope2: 1456,
    scope3: 500,
    euEtsAllowances: 2800,
    euEtsPrice: 85.50,
    carbonIntensity: 0.42,
    revenue: 6.8 // million euros
  });

  const [trends, setTrends] = useState({
    totalChange: 8.2,
    electricityChange: 12.0,
    intensityChange: -5.3
  });

  // Calculate dynamic values
  const euEtsDeficit = emissionsData.total - emissionsData.euEtsAllowances;
  const financialImpact = euEtsDeficit * emissionsData.euEtsPrice;
  const electricityPercentage = ((emissionsData.scope2 / emissionsData.total) * 100).toFixed(1);
  const intensityPerRevenue = (emissionsData.total / emissionsData.revenue).toFixed(2);

  // Simulate data updates (less frequent to avoid too much change)
  useEffect(() => {
    const interval = setInterval(() => {
      setEmissionsData(prev => ({
        ...prev,
        total: prev.total + Math.floor(Math.random() * 6 - 3),
        scope1: prev.scope1 + Math.floor(Math.random() * 3 - 1),
        scope2: prev.scope2 + Math.floor(Math.random() * 4 - 2),
        scope3: prev.scope3 + Math.floor(Math.random() * 2 - 1)
      }));
    }, 60000); // Update every 60 seconds (less frequent)

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="app-layout">
      <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
      <main className="main-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Emission Analysis</h1>
              <p className="text-lg text-secondary">Comprehensive carbon footprint monitoring and compliance tracking</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                4 Location(s) Selected
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full">
                <span className="text-xs">📅</span>
                January 2025 - December 2025
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <KPI
            title="Total Emissions (tCO₂e)"
            value={emissionsData.total.toLocaleString()}
            suffix=" tCO₂e"
            color="from-green-500 to-emerald-500"
            story={`Acme Group's annual carbon footprint across 4 facilities. Represents combined Scope 1 (${emissionsData.scope1.toLocaleString()} tCO₂e), Scope 2 (${emissionsData.scope2.toLocaleString()} tCO₂e), and Scope 3 (${emissionsData.scope3.toLocaleString()} tCO₂e) emissions from manufacturing and logistics operations.`}
            trend={`↗️ +${trends.totalChange}% vs last year`}
            aiExplanation={`This metric represents the total carbon dioxide equivalent emissions across all scopes. The ${emissionsData.total.toLocaleString()} tCO₂e figure indicates ${euEtsDeficit > 0 ? 'a carbon footprint that exceeds EU ETS allowances' : 'compliance with regulatory limits'}. The ${trends.totalChange}% change year-over-year suggests ${trends.totalChange > 0 ? 'growing operational intensity requiring attention' : 'positive progress in emission reduction'}.`}
          />
          <KPI
            title="Main Emission Category"
            value="Electricity"
            suffix={` (${electricityPercentage}%)`}
            color="from-yellow-500 to-orange-500"
            story={`Electricity consumption dominates our carbon footprint at ${electricityPercentage}% of total emissions. Turkish grid mix and high industrial demand drive significant Scope 2 emissions of ${emissionsData.scope2.toLocaleString()} tCO₂e.`}
            trend={`↗️ +${trends.electricityChange}% vs last year`}
            aiExplanation={`Electricity represents the largest emission source at ${electricityPercentage}% of total emissions. This dominance indicates heavy reliance on grid electricity with high carbon intensity. The ${trends.electricityChange}% increase suggests growing energy demand. Strategic focus should be on renewable energy procurement, energy efficiency, and on-site generation to reduce this critical dependency.`}
          />
          <KPI
            title="EU ETS Allowances"
            value={emissionsData.euEtsAllowances.toLocaleString()}
            suffix=" tCO₂e"
            color="from-blue-500 to-cyan-500"
            story={`Annual EU ETS allocation for 2025. ${euEtsDeficit > 0 ? `Currently ${euEtsDeficit} tCO₂e over limit` : `${Math.abs(euEtsDeficit)} tCO₂e buffer remaining`}. Strategic carbon management ${euEtsDeficit > 0 ? 'urgently required' : 'maintained'}.`}
            trend="→ Stable allocation"
            aiExplanation={`The EU ETS allocation of ${emissionsData.euEtsAllowances.toLocaleString()} tCO₂e represents the regulatory limit for covered emissions. ${euEtsDeficit > 0 ? `With current usage at ${emissionsData.total.toLocaleString()} tCO₂e, there's a ${euEtsDeficit} tCO₂e deficit requiring immediate action.` : `Current usage is within limits with ${Math.abs(euEtsDeficit)} tCO₂e buffer.`} This situation indicates the need for ${euEtsDeficit > 0 ? 'immediate carbon reduction strategies' : 'continued monitoring and optimization'}.`}
          />
          <KPI
            title="EU ETS Financial Impact"
            value={`€${financialImpact.toLocaleString()}`}
            suffix=""
            color="from-purple-500 to-pink-500"
            story={`${euEtsDeficit > 0 ? 'Additional cost for exceeding' : 'Savings from staying within'} EU ETS allowances. Represents ${euEtsDeficit > 0 ? 'immediate financial exposure' : 'cost avoidance'} from carbon market compliance.`}
            trend={`↗️ €${emissionsData.euEtsPrice}/tCO₂e`}
            aiExplanation={`The €${financialImpact.toLocaleString()} financial impact represents the ${euEtsDeficit > 0 ? 'cost of exceeding' : 'savings from staying within'} EU ETS allowances at current market prices. This translates to €${emissionsData.euEtsPrice} per tCO₂e, indicating ${euEtsDeficit > 0 ? 'significant financial exposure requiring attention' : 'positive financial performance'}. With carbon prices trending upward, this ${euEtsDeficit > 0 ? 'cost will likely increase' : 'savings will grow'}.`}
          />
          <KPI
            title="Carbon Intensity"
            value={intensityPerRevenue}
            suffix=" tCO₂e/€M"
            color="from-indigo-500 to-blue-500"
            story={`Carbon intensity per million euros of revenue (€${emissionsData.revenue}M). Measures operational efficiency and carbon productivity across the business.`}
            trend={`↘️ ${trends.intensityChange}% vs last year`}
            aiExplanation={`Carbon intensity of ${intensityPerRevenue} tCO₂e per million euros of revenue indicates ${parseFloat(intensityPerRevenue) < 0.5 ? 'excellent' : 'moderate'} carbon productivity. The ${trends.intensityChange}% improvement year-over-year shows positive decoupling of emissions from revenue growth. This metric should be benchmarked against industry peers to identify further improvement opportunities.`}
          />
        </div>

        {/* Charts Section */}
        <div className="chart-grid">
          <DonutCard data={mockDonut} />
          <BarCard data={mockBarCategories} />
        </div>

        {/* Trend Chart */}
        <LineCard data={mockTrend} />

        {/* Activities Table */}
        <TableCard rows={mockTopActivities} />

        {/* LLM Insights */}
        <LLMInsights />
      </main>
    </div>
  );
}

