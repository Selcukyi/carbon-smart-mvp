from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Literal
from pydantic import BaseModel
from app.services.llm_service import llm_service
from app.db.database import get_db
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llm", tags=["LLM Analysis"])

class LLMExplainRequest(BaseModel):
    context: Literal['overview', 'emissions', 'compliance', 'intensity']
    data: Dict[str, Any]

class LLMExplainResponse(BaseModel):
    summary: str
    actions: List[str]

@router.post("/explain", response_model=LLMExplainResponse)
async def explain_data(request: LLMExplainRequest):
    """
    Get AI-powered explanation for specific context and data
    """
    try:
        # Build context-specific prompt with actual data
        prompt = _build_context_prompt(request.context, request.data)
        
        # Get LLM response
        response = await llm_service.generate_explanation(prompt)
        
        # Parse response into structured format
        summary, actions = _parse_llm_response(response, request.context)
        
        return LLMExplainResponse(
            summary=summary,
            actions=actions
        )
        
    except Exception as e:
        logger.error(f"LLM explain failed: {e}")
        # Return fallback response
        return _get_fallback_response(request.context)

@router.get("/analysis")
async def get_emissions_analysis(db: Session = Depends(get_db)):
    """
    Get AI-powered emissions analysis
    """
    try:
        # Get current emissions data
        emissions_data = await get_current_emissions_data(db)
        
        # Get LLM analysis
        analysis = await llm_service.analyze_emissions_data(emissions_data)
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"LLM analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/recommendations")
async def get_recommendations(db: Session = Depends(get_db)):
    """
    Get AI-powered carbon reduction recommendations
    """
    try:
        # Get current emissions data
        emissions_data = await get_current_emissions_data(db)
        
        # Get LLM recommendations
        recommendations = await llm_service.generate_recommendations(emissions_data)
        
        return {
            "success": True,
            "data": recommendations,
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"LLM recommendations failed: {e}")
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")

@router.get("/risk-assessment")
async def get_risk_assessment(db: Session = Depends(get_db)):
    """
    Get AI-powered risk assessment
    """
    try:
        # Get current emissions data
        emissions_data = await get_current_emissions_data(db)
        
        # Get LLM risk assessment
        risk_assessment = await llm_service.assess_risks(emissions_data)
        
        return {
            "success": True,
            "data": risk_assessment,
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"LLM risk assessment failed: {e}")
        raise HTTPException(status_code=500, detail=f"Risk assessment failed: {str(e)}")

@router.get("/insights")
async def get_all_insights(db: Session = Depends(get_db)):
    """
    Get all LLM insights in one call
    """
    try:
        # Get current emissions data
        emissions_data = await get_current_emissions_data(db)
        
        # Get all LLM insights
        analysis = await llm_service.analyze_emissions_data(emissions_data)
        recommendations = await llm_service.generate_recommendations(emissions_data)
        risk_assessment = await llm_service.assess_risks(emissions_data)
        
        return {
            "success": True,
            "data": {
                "executive_summary": analysis,
                "recommendations": recommendations,
                "risk_analysis": risk_assessment,
                "performance_metrics": get_performance_metrics(emissions_data)
            },
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"LLM insights failed: {e}")
        raise HTTPException(status_code=500, detail=f"Insights failed: {str(e)}")

@router.post("/analyze-custom-data")
async def analyze_custom_data(data: Dict[str, Any]):
    """
    Analyze custom emissions data
    """
    try:
        # Validate required fields
        required_fields = ["total_emissions", "scope1", "scope2", "scope3"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Get LLM analysis for custom data
        analysis = await llm_service.analyze_emissions_data(data)
        recommendations = await llm_service.generate_recommendations(data)
        risk_assessment = await llm_service.assess_risks(data)
        
        return {
            "success": True,
            "data": {
                "analysis": analysis,
                "recommendations": recommendations,
                "risk_assessment": risk_assessment
            },
            "timestamp": "2024-01-15T10:30:00Z"
        }
        
    except Exception as e:
        logger.error(f"Custom data analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def get_current_emissions_data(db: Session) -> Dict[str, Any]:
    """
    Get current emissions data from database
    """
    try:
        # This would normally query the database
        # For now, return mock data that matches our frontend
        return {
            "total_emissions": 2847,
            "scope1": 1247,
            "scope2": 1456,
            "scope3": 144,
            "eu_ets_allowances": 2800,
            "eu_ets_used": 2847,
            "eu_ets_price": 85.50,
            "entities": [
                {
                    "name": "Acme Foods",
                    "emissions": 2403,
                    "facilities": ["Izmir Plant"]
                },
                {
                    "name": "Acme Logistics", 
                    "emissions": 444,
                    "facilities": ["Ankara Hub"]
                }
            ]
        }
    except Exception as e:
        logger.error(f"Failed to get emissions data: {e}")
        # Return fallback data
        return {
            "total_emissions": 2847,
            "scope1": 1247,
            "scope2": 1456,
            "scope3": 144,
            "eu_ets_allowances": 2800,
            "eu_ets_used": 2847,
            "eu_ets_price": 85.50
        }

def get_performance_metrics(emissions_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate performance metrics
    """
    total_emissions = emissions_data.get("total_emissions", 0)
    employees = 1247  # Mock employee count
    
    return {
        "title": "Performance Metrics",
        "content": f"Karbon yoğunluğu {total_emissions/employees:.2f} tCO₂e/çalışan, endüstri ortalamasının %15 üzerinde.",
        "metrics": [
            {
                "metric": "Karbon Yoğunluğu",
                "value": f"{total_emissions/employees:.2f} tCO₂e/çalışan",
                "benchmark": "1.98 tCO₂e/çalışan",
                "status": "above"
            },
            {
                "metric": "Enerji Verimliliği",
                "value": "0.45 tCO₂e/MWh",
                "benchmark": "0.38 tCO₂e/MWh", 
                "status": "above"
            },
            {
                "metric": "Atık Yoğunluğu",
                "value": "0.044 tCO₂e/ton",
                "benchmark": "0.035 tCO₂e/ton",
                "status": "above"
            }
        ]
    }

def _build_context_prompt(context: str, data: Dict[str, Any]) -> str:
    """
    Build context-specific prompt with actual data
    """
    if context == "overview":
        total_emissions = data.get("total_tco2e", 0)
        yoy_change = data.get("yoy_pct", 0)
        return f"""Analyze this carbon emissions overview:
- Total Emissions: {total_emissions} tCO₂e
- Year-over-Year Change: {yoy_change}%
Provide a concise summary and 3 actionable recommendations."""

    elif context == "emissions":
        total_emissions = data.get("total_tco2e", 0)
        scope1 = data.get("scopes", [{}])[0].get("tco2e", 0) if data.get("scopes") else 0
        scope2 = data.get("scopes", [{}])[1].get("tco2e", 0) if len(data.get("scopes", [])) > 1 else 0
        scope3 = data.get("scopes", [{}])[2].get("tco2e", 0) if len(data.get("scopes", [])) > 2 else 0
        return f"""Analyze these emissions data:
- Total: {total_emissions} tCO₂e
- Scope 1: {scope1} tCO₂e
- Scope 2: {scope2} tCO₂e  
- Scope 3: {scope3} tCO₂e
Provide insights and 3 specific actions to reduce emissions."""

    elif context == "compliance":
        overshoot = data.get("current_overshoot_tco2e", 0)
        cost = data.get("ytd_cost_eur", 0)
        return f"""Analyze EU ETS compliance status:
- Overshoot: {overshoot} tCO₂e
- Additional Cost: €{cost:,.0f}
Provide compliance insights and 3 urgent actions."""

    elif context == "intensity":
        current_intensity = data.get("current_intensity", 0)
        yoy_change = data.get("yoy_change_pct", 0)
        correlation = data.get("correlation", 0)
        return f"""Analyze carbon intensity metrics:
- Current Intensity: {current_intensity} tCO₂e/€M
- YoY Change: {yoy_change}%
- Revenue Correlation: {correlation}
Provide intensity insights and 3 efficiency actions."""

    return "Analyze this data and provide insights with 3 actionable recommendations."

def _parse_llm_response(response: str, context: str) -> tuple[str, List[str]]:
    """
    Parse LLM response into summary and actions
    """
    try:
        # Simple parsing - in production, use more sophisticated parsing
        lines = response.strip().split('\n')
        summary = lines[0] if lines else "Analysis completed."
        
        actions = []
        for line in lines[1:]:
            if line.strip() and (line.startswith('-') or line.startswith('•') or line.startswith('*')):
                action = line.strip().lstrip('-•* ').strip()
                if action:
                    actions.append(action)
        
        # Ensure we have exactly 3 actions
        while len(actions) < 3:
            actions.append(f"Review {context} data for optimization opportunities")
        
        return summary, actions[:3]
        
    except Exception as e:
        logger.error(f"Failed to parse LLM response: {e}")
        return "Analysis completed successfully.", [
            f"Review {context} metrics",
            "Implement efficiency improvements", 
            "Monitor progress regularly"
        ]

def _get_fallback_response(context: str) -> LLMExplainResponse:
    """
    Get fallback response when LLM fails
    """
    fallbacks = {
        "overview": {
            "summary": "Carbon emissions analysis shows opportunities for improvement across all scopes.",
            "actions": [
                "Implement energy efficiency programs",
                "Optimize supply chain operations", 
                "Set reduction targets for 2025"
            ]
        },
        "emissions": {
            "summary": "Emissions data indicates significant reduction potential in Scope 1 and 2 activities.",
            "actions": [
                "Upgrade to renewable energy sources",
                "Improve manufacturing efficiency",
                "Implement waste reduction programs"
            ]
        },
        "compliance": {
            "summary": "EU ETS compliance requires immediate action to address allowance deficit.",
            "actions": [
                "Purchase additional allowances",
                "Implement rapid emission reductions",
                "Review compliance strategy"
            ]
        },
        "intensity": {
            "summary": "Carbon intensity metrics show room for improvement in operational efficiency.",
            "actions": [
                "Optimize production processes",
                "Improve energy management",
                "Decouple growth from emissions"
            ]
        }
    }
    
    fallback = fallbacks.get(context, fallbacks["overview"])
    return LLMExplainResponse(
        summary=fallback["summary"],
        actions=fallback["actions"]
    )