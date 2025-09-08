from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any
from app.services.llm_service import llm_service
from app.db.database import get_db
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/llm", tags=["LLM Analysis"])

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