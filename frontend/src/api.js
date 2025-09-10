import { BACKEND_URL, FEATURE_FLAGS } from "./lib/config.js";
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
};