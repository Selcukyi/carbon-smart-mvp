// Mock data for development and demo purposes

export const mockEntities = [
  {
    id: 1,
    name: "CarbonSmart Group",
    type: "GROUP",
    parentId: null,
    children: [
      {
        id: 2,
        name: "Manufacturing Division",
        type: "ENTITY",
        parentId: 1,
        children: [
          {
            id: 3,
            name: "Factory A",
            type: "FACILITY",
            parentId: 2,
            children: []
          },
          {
            id: 4,
            name: "Factory B",
            type: "FACILITY",
            parentId: 2,
            children: []
          }
        ]
      },
      {
        id: 5,
        name: "Services Division",
        type: "ENTITY",
        parentId: 1,
        children: [
          {
            id: 6,
            name: "Office Complex",
            type: "FACILITY",
            parentId: 5,
            children: []
          }
        ]
      }
    ]
  }
];

export const mockEmissions = {
  total: 2847,
  scope1: 1200,
  scope2: 1200,
  scope3: 447,
  euEtsUsed: 2847,
  euEtsAllowances: 2800,
  carbonIntensity: 0.45
};

export const mockActivities = [
  { id: 1, name: "Natural Gas Consumption", emissions: 800, scope: "Scope 1" },
  { id: 2, name: "Electricity Usage", emissions: 1200, scope: "Scope 2" },
  { id: 3, name: "Business Travel", emissions: 300, scope: "Scope 3" },
  { id: 4, name: "Waste Disposal", emissions: 147, scope: "Scope 3" },
  { id: 5, name: "Vehicle Fleet", emissions: 400, scope: "Scope 1" }
];

export const mockAllowances = [
  { id: 1, entityId: 1, entityName: "CarbonSmart Group", balance: 2800, used: 2847 },
  { id: 2, entityId: 2, entityName: "Manufacturing Division", balance: 1500, used: 1200 },
  { id: 3, entityId: 5, entityName: "Services Division", balance: 800, used: 600 }
];

export const mockFactors = [
  { id: 1, name: "Natural Gas", factor: 0.202, unit: "kg CO2e/kWh" },
  { id: 2, name: "Electricity Grid", factor: 0.350, unit: "kg CO2e/kWh" },
  { id: 3, name: "Business Travel", factor: 0.285, unit: "kg CO2e/km" },
  { id: 4, name: "Waste Disposal", factor: 0.5, unit: "kg CO2e/kg" }
];

// Dashboard mock data
export const mockKPIs = [
  {
    title: "Total CO2e",
    value: "2,847",
    unit: "tCO₂e",
    story: "Total carbon emissions across all scopes",
    trend: "+2.3%",
    status: "good"
  },
  {
    title: "Scope 1",
    value: "1,200",
    unit: "tCO₂e",
    story: "Direct emissions from owned sources",
    trend: "+1.8%",
    status: "good"
  },
  {
    title: "Scope 2",
    value: "1,200",
    unit: "tCO₂e",
    story: "Indirect emissions from purchased energy",
    trend: "+0.5%",
    status: "good"
  },
  {
    title: "EU ETS Impact",
    value: "€47",
    unit: "k",
    story: "Financial impact of EU ETS compliance",
    trend: "+12.5%",
    status: "warning"
  },
  {
    title: "Carbon Intensity",
    value: "0.45",
    unit: "tCO₂e/€M",
    story: "Emissions per million euros revenue",
    trend: "-3.2%",
    status: "good"
  }
];

export const mockDonut = {
  data: [
    { name: "Scope 1", value: 1200, color: "#8884d8" },
    { name: "Scope 2", value: 1200, color: "#82ca9d" },
    { name: "Scope 3", value: 447, color: "#ffc658" }
  ]
};

export const mockBarCategories = [
  { name: "Natural Gas", value: 800 },
  { name: "Electricity", value: 1200 },
  { name: "Business Travel", value: 300 },
  { name: "Waste Disposal", value: 147 },
  { name: "Vehicle Fleet", value: 400 }
];

export const mockTrend = [
  { period: "Jan", value: 230 },
  { period: "Feb", value: 241 },
  { period: "Mar", value: 254 },
  { period: "Apr", value: 265 },
  { period: "May", value: 276 },
  { period: "Jun", value: 289 }
];

export const mockTopActivities = [
  { activity: "Natural Gas Consumption", entity: "Manufacturing Division", facility: "Factory A", scope: "Scope 1", co2e: 800, period: "2025-Q3" },
  { activity: "Electricity Usage", entity: "Manufacturing Division", facility: "Factory A", scope: "Scope 2", co2e: 1200, period: "2025-Q3" },
  { activity: "Business Travel", entity: "Services Division", facility: "Office Complex", scope: "Scope 3", co2e: 300, period: "2025-Q3" },
  { activity: "Waste Disposal", entity: "Manufacturing Division", facility: "Factory B", scope: "Scope 3", co2e: 147, period: "2025-Q3" },
  { activity: "Vehicle Fleet", entity: "Services Division", facility: "Office Complex", scope: "Scope 1", co2e: 400, period: "2025-Q3" }
];

// Upload page mock data
export const mockEmissionFactors = [
  { id: 1, name: "Natural Gas", factor: 0.202, unit: "kg CO2e/kWh", category: "Energy" },
  { id: 2, name: "Electricity Grid", factor: 0.350, unit: "kg CO2e/kWh", category: "Energy" },
  { id: 3, name: "Business Travel - Air", factor: 0.285, unit: "kg CO2e/km", category: "Transport" },
  { id: 4, name: "Business Travel - Car", factor: 0.192, unit: "kg CO2e/km", category: "Transport" },
  { id: 5, name: "Waste Disposal", factor: 0.5, unit: "kg CO2e/kg", category: "Waste" },
  { id: 6, name: "Water Consumption", factor: 0.0003, unit: "kg CO2e/liter", category: "Utilities" }
];

// Allowances page mock data
export const mockBudgetScenarios = [
  { id: 1, name: "Conservative", reduction: 5, cost: 50000, feasibility: "High" },
  { id: 2, name: "Moderate", reduction: 15, cost: 150000, feasibility: "Medium" },
  { id: 3, name: "Aggressive", reduction: 30, cost: 400000, feasibility: "Low" }
];

// LLM Insights mock data
export const mockLLMInsights = {
  executiveSummary: "Total emissions of 2,847 tCO₂e detected. EU ETS compliance status needs evaluation. Current carbon intensity is 0.45 tCO₂e/€M, showing moderate efficiency. Immediate action required for EU ETS compliance.",
  financialImpact: "€47,000 additional cost for exceeding EU ETS allowances",
  recommendations: [
    {
      title: "Energy Efficiency",
      description: "Implement LED lighting and smart HVAC systems",
      impact: "High",
      cost: "Medium",
      savings: "€25,000",
      annual_savings: "€25,000",
      timeline: "3-6 months",
      priority: "High"
    },
    {
      title: "Renewable Energy",
      description: "Switch to 100% renewable electricity",
      impact: "Very High",
      cost: "High",
      savings: "€35,000",
      annual_savings: "€35,000",
      timeline: "6-12 months",
      priority: "Medium"
    }
  ],
  riskAnalysis: [
    {
      title: "Regulatory Risk",
      description: "EU ETS allowance deficit of 47 tCO₂e",
      severity: "Medium",
      probability: "High"
    }
  ],
  performanceMetrics: {
    carbonIntensity: 0.45,
    reductionTarget: 20,
    currentProgress: 12
  }
};