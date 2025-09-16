from datetime import date, timedelta
from typing import List, Dict, Any
from ..schemas.common import KPI, ScopeShare, CategoryEmission, Allowance, IntensityPoint

# Mock facilities
FACILITIES = [
    {"id": 1, "name": "Istanbul Headquarters", "city": "Istanbul", "country": "Turkey"},
    {"id": 2, "name": "Izmir Manufacturing", "city": "Izmir", "country": "Turkey"},
    {"id": 3, "name": "Ankara Office", "city": "Ankara", "country": "Turkey"},
    {"id": 4, "name": "Bursa Factory", "city": "Bursa", "country": "Turkey"},
    {"id": 5, "name": "Antalya Branch", "city": "Antalya", "country": "Turkey"},
]

# Mock time series data for 2025
def generate_time_series(start_date: date, end_date: date) -> List[Dict[str, Any]]:
    """Generate mock time series data for the given date range"""
    data = []
    current_date = start_date
    
    while current_date <= end_date:
        # Generate realistic daily emissions with some variation
        base_emissions = 100
        seasonal_factor = 1 + 0.3 * abs((current_date.month - 6) / 6)  # Higher in summer/winter
        daily_variation = 0.8 + 0.4 * (hash(str(current_date)) % 100) / 100
        
        daily_emissions = base_emissions * seasonal_factor * daily_variation
        
        data.append({
            "date": current_date,
            "emissions": round(daily_emissions, 2),
            "scope_1": round(daily_emissions * 0.4, 2),
            "scope_2": round(daily_emissions * 0.35, 2),
            "scope_3": round(daily_emissions * 0.25, 2),
            "revenue": round(50000 + (hash(str(current_date)) % 20000), 2),
        })
        current_date += timedelta(days=1)
    
    return data

def get_mock_kpis() -> List[KPI]:
    """Get mock KPI data"""
    return [
        KPI(name="Total CO₂e", value=2847.5, unit="tCO₂e", change_percent=12.3, trend="up"),
        KPI(name="Scope 1", value=1139.0, unit="tCO₂e", change_percent=8.7, trend="up"),
        KPI(name="Scope 2", value=996.6, unit="tCO₂e", change_percent=15.2, trend="up"),
        KPI(name="Scope 3", value=711.9, unit="tCO₂e", change_percent=5.1, trend="down"),
        KPI(name="EU ETS Deficit", value=47.0, unit="tCO₂e", change_percent=-23.4, trend="down"),
        KPI(name="Cost Savings", value=4015.0, unit="€", change_percent=18.9, trend="up"),
        KPI(name="Efficiency Gain", value=51.1, unit="%", change_percent=12.5, trend="up"),
    ]

def get_mock_scope_shares() -> List[ScopeShare]:
    """Get mock scope share data"""
    return [
        ScopeShare(scope="Scope 1", percentage=40.0, emissions=1139.0, color="#ff6b6b"),
        ScopeShare(scope="Scope 2", percentage=35.0, emissions=996.6, color="#4ecdc4"),
        ScopeShare(scope="Scope 3", percentage=25.0, emissions=711.9, color="#45b7d1"),
    ]

def get_mock_category_emissions() -> List[CategoryEmission]:
    """Get mock category emission data"""
    return [
        CategoryEmission(category="Energy Consumption", emissions=1200.5, percentage=42.1, scope="Scope 2", trend="up"),
        CategoryEmission(category="Transportation", emissions=800.3, percentage=28.1, scope="Scope 1", trend="down"),
        CategoryEmission(category="Manufacturing", emissions=600.7, percentage=21.1, scope="Scope 1", trend="stable"),
        CategoryEmission(category="Waste Disposal", emissions=147.0, percentage=5.2, scope="Scope 3", trend="down"),
        CategoryEmission(category="Business Travel", emissions=99.0, percentage=3.5, scope="Scope 3", trend="up"),
    ]

def get_mock_allowances() -> List[Allowance]:
    """Get mock allowance data"""
    return [
        Allowance(entity_id=1, entity_name="CarbonLens Group", allocated=2800.0, used=2847.0, remaining=-47.0, price=85.50, value=243019.50),
        Allowance(entity_id=2, entity_name="Manufacturing Division", allocated=1500.0, used=1200.0, remaining=300.0, price=85.50, value=102600.0),
        Allowance(entity_id=3, entity_name="Services Division", allocated=800.0, used=600.0, remaining=200.0, price=85.50, value=51300.0),
    ]

def get_mock_intensity_data(start_date: date, end_date: date) -> List[IntensityPoint]:
    """Get mock intensity data for the given date range"""
    time_series = generate_time_series(start_date, end_date)
    intensity_data = []
    
    for point in time_series:
        intensity = point["emissions"] / (point["revenue"] / 1000000) if point["revenue"] > 0 else 0
        intensity_data.append(IntensityPoint(
            date=point["date"],
            intensity=round(intensity, 4),
            revenue=point["revenue"],
            emissions=point["emissions"]
        ))
    
    return intensity_data

def get_mock_emissions_data(start_date: date, end_date: date) -> List[Dict[str, Any]]:
    """Get mock emissions data for the given date range"""
    return generate_time_series(start_date, end_date)

def get_mock_compliance_data() -> Dict[str, Any]:
    """Get mock compliance data"""
    return {
        "eu_ets_status": "over_limit",
        "eu_ets_deficit": 47.0,
        "iso_14064_status": "compliant",
        "ghg_protocol_status": "compliant",
        "next_audit_date": "2025-06-15",
        "compliance_score": 85.5,
        "risks": [
            {"type": "regulatory", "severity": "medium", "description": "EU ETS allowance deficit"},
            {"type": "operational", "severity": "low", "description": "Energy efficiency opportunities"},
        ]
    }

def get_mock_ai_explain(context: str, params: dict) -> Dict[str, Any]:
    """Get mock AI explanation data"""
    return {
        "explanation": f"Based on the {context} data, your carbon emissions show a {params.get('trend', 'stable')} trend. Key insights include energy efficiency opportunities and potential cost savings through renewable energy adoption.",
        "confidence": 0.87,
        "sources": ["EU ETS Database", "GHG Protocol Guidelines", "Internal Energy Reports"],
        "recommendations": [
            "Implement LED lighting systems",
            "Switch to renewable energy sources",
            "Optimize transportation routes",
            "Invest in energy-efficient equipment"
        ]
    }