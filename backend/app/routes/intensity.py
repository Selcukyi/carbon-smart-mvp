"""
Carbon Intensity Hub Routes

Provides endpoints for carbon intensity analysis including:
- Time series intensity data
- Site-level scatter plot data
- Revenue vs emissions correlation analysis
"""

from fastapi import APIRouter, Query, HTTPException
from datetime import date
from typing import List, Optional
from ..schemas.intensity import IntensityResponse
from ..services.calc import calc_intensity

router = APIRouter(prefix="/intensity", tags=["intensity"])


@router.get("", response_model=IntensityResponse)
async def get_intensity(
    start: date = Query(..., description="Start date for analysis"),
    end: date = Query(..., description="End date for analysis"),
    entities: Optional[str] = Query(None, description="Comma-separated list of entity IDs")
):
    """
    Get carbon intensity analysis data.
    
    Returns:
        - Current intensity value (tCO₂e per €M revenue)
        - Year-over-year change percentage
        - Monthly intensity time series
        - Site-level scatter plot data
        - Pearson correlation between revenue and emissions
    """
    try:
        # Parse entity IDs
        entity_list = None
        if entities:
            try:
                entity_list = [int(e.strip()) for e in entities.split(",") if e.strip()]
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail="Invalid entity IDs format. Use comma-separated integers."
                )
        
        # Validate date range
        if start > end:
            raise HTTPException(
                status_code=400,
                detail="Start date must be before or equal to end date"
            )
        
        # Calculate intensity data
        intensity_data = calc_intensity((start, end), entity_list)
        
        return intensity_data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating intensity data: {str(e)}"
        )