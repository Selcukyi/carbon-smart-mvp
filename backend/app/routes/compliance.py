from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from datetime import date
from ..schemas.compliance import ComplianceResponse
from ..services.calc import calc_compliance

router = APIRouter()


@router.get("/compliance", response_model=ComplianceResponse)
async def get_compliance(
    start: date = Query(..., description="Start date (YYYY-MM-DD)"),
    end: date = Query(..., description="End date (YYYY-MM-DD)"),
    entities: Optional[str] = Query(None, description="Comma-separated entity IDs"),
    prices: Optional[str] = Query(None, description="Comma-separated price scenarios in EUR/tCO2e")
):
    """
    Get compliance data for EU ETS allowances and cost scenarios.
    
    Args:
        start: Start date for the compliance period
        end: End date for the compliance period
        entities: Comma-separated list of entity IDs to filter by
        prices: Comma-separated list of price scenarios in EUR per tCO2e
    
    Returns:
        ComplianceResponse with overshoot, costs, allowances, and scenarios
    """
    try:
        # Parse entities
        entity_list = None
        if entities:
            entity_list = [int(e.strip()) for e in entities.split(",")]
        
        # Parse price scenarios
        price_inputs = [90, 120, 150]  # Default scenarios
        if prices:
            try:
                price_inputs = [float(p.strip()) for p in prices.split(",")]
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid price format. Use comma-separated numbers.")
        
        # Calculate compliance data
        compliance_data = calc_compliance(
            date_range=(start, end),
            entities=entity_list,
            price_inputs=price_inputs
        )
        
        return compliance_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating compliance data: {str(e)}")