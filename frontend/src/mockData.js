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
  { name: "Jan", scope1: 100, scope2: 95, scope3: 35 },
  { name: "Feb", scope1: 105, scope2: 98, scope3: 38 },
  { name: "Mar", scope1: 110, scope2: 102, scope3: 42 },
  { name: "Apr", scope1: 115, scope2: 105, scope3: 45 },
  { name: "May", scope1: 120, scope2: 108, scope3: 48 },
  { name: "Jun", scope1: 125, scope2: 112, scope3: 52 }
];

export const mockTrend = [
  { month: "Jan", emissions: 230 },
  { month: "Feb", emissions: 241 },
  { month: "Mar", emissions: 254 },
  { month: "Apr", emissions: 265 },
  { month: "May", emissions: 276 },
  { month: "Jun", emissions: 289 }
];

export const mockTopActivities = [
  { name: "Natural Gas Consumption", emissions: 800, percentage: 28.1 },
  { name: "Electricity Usage", emissions: 1200, percentage: 42.2 },
  { name: "Business Travel", emissions: 300, percentage: 10.5 },
  { name: "Waste Disposal", emissions: 147, percentage: 5.2 },
  { name: "Vehicle Fleet", emissions: 400, percentage: 14.0 }
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
  executiveSummary: "Total emissions of 2,847 tCO₂e detected. EU ETS compliance status needs evaluation.",
  recommendations: [
    {
      title: "Energy Efficiency",
      description: "Implement LED lighting and smart HVAC systems",
      impact: "High",
      cost: "Medium"
    },
    {
      title: "Renewable Energy",
      description: "Switch to 100% renewable electricity",
      impact: "Very High",
      cost: "High"
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