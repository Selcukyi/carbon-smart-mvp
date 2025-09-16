from fastapi import APIRouter, Query
from datetime import date
from typing import Optional
from ..schemas.common import Paginated
from ..services.mock_data import get_mock_compliance_data

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

@router.get("/")
def get_compliance_status(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    entity_ids: Optional[str] = Query(None)
):
    """Get compliance status and risks"""
    return get_mock_compliance_data()

@router.get("/risks")
def get_compliance_risks():
    """Get compliance risks and recommendations"""
    compliance_data = get_mock_compliance_data()
    return {
        "risks": compliance_data["risks"],
        "recommendations": [
            "Monitor EU ETS allowance usage closely",
            "Implement energy efficiency measures",
            "Consider renewable energy investments"
        ]
    }