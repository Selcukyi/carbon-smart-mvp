import { BACKEND_URL, FEATURE_FLAGS } from "./config.js";
import { mockLLMInsights } from "./mockData.js";

async function httpGet(path) {
  const res = await fetch(`${BACKEND_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

async function httpPost(path, body) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}

const mock = {
  async factors() {
    return [
      { code: "electricity_TR", name: "Electricity TR Grid", unit: "kWh", factor_kgco2_per_unit: 0.42, scope_hint: "Scope2" },
      { code: "diesel", name: "Diesel", unit: "L", factor_kgco2_per_unit: 2.68, scope_hint: "Scope1" },
      { code: "petrol", name: "Petrol", unit: "L", factor_kgco2_per_unit: 2.31, scope_hint: "Scope1" },
      { code: "natural_gas", name: "Natural Gas", unit: "m3", factor_kgco2_per_unit: 1.90, scope_hint: "Scope1" },
      { code: "road_km", name: "Road Freight", unit: "km", factor_kgco2_per_unit: 0.12, scope_hint: "Scope3" },
      { code: "air_km", name: "Business Air Travel", unit: "km", factor_kgco2_per_unit: 0.25, scope_hint: "Scope3" },
    ];
  },
  async emissionsSummary() {
    return {
      total_kg: 150000 * 0.42 + 30000 * 1.9 + 20000 * 2.68 + 120000 * 0.12,
      totals_by_scope: { Scope1: 30000 * 1.9 + 20000 * 2.68, Scope2: 150000 * 0.42, Scope3: 120000 * 0.12 },
      items: [
        { activity_id: 1, scope: "Scope2", co2e_kg: 150000 * 0.42, period: "2025-Q3" },
        { activity_id: 2, scope: "Scope1", co2e_kg: 30000 * 1.9, period: "2025-Q3" },
        { activity_id: 3, scope: "Scope1", co2e_kg: 20000 * 2.68, period: "2025-Q3" },
        { activity_id: 4, scope: "Scope3", co2e_kg: 120000 * 0.12, period: "2025-Q3" },
      ],
      page: 1,
      size: 10,
      total: 4,
    };
  },
  async euETSPrice() {
    return { price_eur_per_tco2: 85.0 };
  },
  async allowancesSummary(entityId) {
    const bases = { 1: 5000, 2: 3000 };
    const owned = bases[entityId] ?? 1000;
    return { entity_id: entityId, owned, committed: 0, available: owned };
  },
};

export const api = {
  async getFactors() {
    if (FEATURE_FLAGS.MOCK) return mock.factors();
    return httpGet("/factors/");
  },
  async getEmissions(params = { page: 1, size: 50 }) {
    if (FEATURE_FLAGS.MOCK) return mock.emissionsSummary();
    const q = new URLSearchParams(params).toString();
    return httpGet(`/emissions?${q}`);
  },
  async recalcEmissions(period) {
    if (FEATURE_FLAGS.MOCK) return { status: "ok", inserted: 4 };
    return httpPost("/emissions/recalculate", { period });
  },
  async getPrice() {
    if (FEATURE_FLAGS.MOCK) return mock.euETSPrice();
    return httpGet("/eu-ets/price");
  },
  async allowancesSummary(entityId) {
    if (FEATURE_FLAGS.MOCK) return mock.allowancesSummary(entityId);
    return httpGet(`/allowances/summary?entity_id=${entityId}`);
  },
  async transferAllowances(payload) {
    if (FEATURE_FLAGS.MOCK) return { transfer_id: 1, from_balance: {}, to_balance: {} };
    return httpPost("/allowances/transfer", payload);
  },
  async uploadFile(file) {
    if (FEATURE_FLAGS.MOCK) return { status: "ok", inserted: 4, errors: [], total_rows: 4 };
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
  
  // LLM API endpoints
  async getLLMAnalysis() {
    if (FEATURE_FLAGS.MOCK) return { success: true, data: mockLLMInsights.executiveSummary };
    return httpGet("/api/llm/analysis");
  },
  
  async getLLMRecommendations() {
    if (FEATURE_FLAGS.MOCK) return { success: true, data: mockLLMInsights.keyRecommendations };
    return httpGet("/api/llm/recommendations");
  },
  
  async getLLMRiskAssessment() {
    if (FEATURE_FLAGS.MOCK) return { success: true, data: mockLLMInsights.riskAnalysis };
    return httpGet("/api/llm/risk-assessment");
  },
  
  async getAllLLMInsights() {
    if (FEATURE_FLAGS.MOCK) return { success: true, data: mockLLMInsights };
    return httpGet("/api/llm/insights");
  },
  
  async analyzeCustomData(data) {
    if (FEATURE_FLAGS.MOCK) return { success: true, data: mockLLMInsights };
    return httpPost("/api/llm/analyze-custom-data", data);
  },

  // New API endpoints for shared groundwork
  async getEmissions(params = {}) {
    if (FEATURE_FLAGS.MOCK) return mock.emissionsSummary();
    const q = new URLSearchParams(params).toString();
    return httpGet(`/api/emissions?${q}`);
  },

  async getCompliance(params = {}) {
    if (FEATURE_FLAGS.MOCK) {
      return {
        eu_ets_status: "over_limit",
        eu_ets_deficit: 47.0,
        iso_14064_status: "compliant",
        ghg_protocol_status: "compliant",
        next_audit_date: "2025-06-15",
        compliance_score: 85.5,
        risks: [
          { type: "regulatory", severity: "medium", description: "EU ETS allowance deficit" },
          { type: "operational", severity: "low", description: "Energy efficiency opportunities" }
        ]
      };
    }
    const q = new URLSearchParams(params).toString();
    return httpGet(`/api/compliance?${q}`);
  },

  async getIntensity(params = {}) {
    if (FEATURE_FLAGS.MOCK) {
      return {
        data: [
          { date: "2025-01-01", intensity: 0.45, revenue: 50000, emissions: 100 },
          { date: "2025-01-02", intensity: 0.44, revenue: 52000, emissions: 102 },
          { date: "2025-01-03", intensity: 0.43, revenue: 48000, emissions: 98 }
        ],
        summary: {
          average_intensity: 0.44,
          trend: "decreasing",
          target: 0.3
        }
      };
    }
    const q = new URLSearchParams(params).toString();
    return httpGet(`/api/intensity?${q}`);
  },

  async getAIExplain(context, params = {}) {
    if (FEATURE_FLAGS.MOCK) {
      return {
        explanation: `Based on the ${context} data, your carbon emissions show a stable trend. Key insights include energy efficiency opportunities and potential cost savings through renewable energy adoption.`,
        confidence: 0.87,
        sources: ["EU ETS Database", "GHG Protocol Guidelines", "Internal Energy Reports"],
        recommendations: [
          "Implement LED lighting systems",
          "Switch to renewable energy sources",
          "Optimize transportation routes",
          "Invest in energy-efficient equipment"
        ]
      };
    }
    return httpPost("/api/llm/explain", { context, params });
  },

  async getFacilities() {
    if (FEATURE_FLAGS.MOCK) {
      return [
        { id: 1, name: "Istanbul Headquarters", city: "Istanbul", country: "Turkey" },
        { id: 2, name: "Izmir Manufacturing", city: "Izmir", country: "Turkey" },
        { id: 3, name: "Ankara Office", city: "Ankara", country: "Turkey" },
        { id: 4, name: "Bursa Factory", city: "Bursa", country: "Turkey" },
        { id: 5, name: "Antalya Branch", city: "Antalya", country: "Turkey" }
      ];
    }
    return httpGet("/api/facilities");
  },
};