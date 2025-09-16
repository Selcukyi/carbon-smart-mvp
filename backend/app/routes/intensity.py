from fastapi import APIRouter, Query
from datetime import date
from typing import Optional
from ..schemas.common import Paginated, IntensityPoint
from ..services.mock_data import get_mock_intensity_data

router = APIRouter(prefix="/api/intensity", tags=["intensity"])

@router.get("/")
def get_intensity_data(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    entity_ids: Optional[str] = Query(None)
):
    """Get carbon intensity data over time"""
    if not start_date:
        start_date = date(2025, 1, 1)
    if not end_date:
        end_date = date(2025, 12, 31)
    
    intensity_data = get_mock_intensity_data(start_date, end_date)
    
    return {
        "data": intensity_data,
        "summary": {
            "average_intensity": sum(point.intensity for point in intensity_data) / len(intensity_data),
            "trend": "decreasing",
            "target": 0.3
        }
    }

@router.get("/trends")
def get_intensity_trends():
    """Get carbon intensity trends and projections"""
    return {
        "current_intensity": 0.45,
        "target_intensity": 0.30,
        "projected_intensity": 0.35,
        "trend_direction": "down",
        "confidence": 0.85
    }