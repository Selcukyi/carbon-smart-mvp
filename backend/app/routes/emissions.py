from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from typing import List, Optional

from ..db.database import get_db
from ..models.activity import UploadedActivity
from ..models.emission import EmissionRecord
from ..models.factors import EmissionFactor
from ..services.calc import compute_emissions_for_activity, calc_emissions
from ..schemas.emission import EmissionsResponse


router = APIRouter(prefix="/emissions", tags=["emissions"])


@router.post("/recalculate")
def recalculate_emissions(period: str | None = None, db: Session = Depends(get_db)):
    q = db.query(UploadedActivity)
    if period:
        q = q.filter(UploadedActivity.period == period)
    activities = q.all()
    factors = {f.code: f for f in db.query(EmissionFactor).all()}

    inserted = 0
    for act in activities:
        factor = factors.get(act.factor_code)
        if not factor:
            # skip unknown factor rows
            continue
        co2e_kg = compute_emissions_for_activity(act.amount, factor.factor_kgco2_per_unit)
        rec = EmissionRecord(activity_id=act.id, co2e_kg=co2e_kg, scope=act.scope, period=act.period)
        db.add(rec)
        inserted += 1
    db.commit()
    return {"status": "ok", "inserted": inserted}


@router.get("", response_model=EmissionsResponse)
def get_emissions(
    start: Optional[date] = Query(None, description="Start date for emissions data"),
    end: Optional[date] = Query(None, description="End date for emissions data"),
    entities: Optional[str] = Query(None, description="Comma-separated list of entity IDs"),
    pareto: bool = Query(False, description="Apply 80/20 Pareto analysis to categories"),
):
    """
    Get emissions data with summary, time series, scope breakdown, and top categories.
    
    Query Parameters:
    - start: Start date (defaults to beginning of current year)
    - end: End date (defaults to end of current year)
    - entities: Comma-separated entity IDs to filter by
    - pareto: Whether to apply 80/20 Pareto analysis to categories
    """
    # Set default date range if not provided
    if not start:
        start = date(2025, 1, 1)
    if not end:
        end = date(2025, 12, 31)
    
    # Parse entity IDs
    entity_ids = None
    if entities:
        try:
            entity_ids = [int(id.strip()) for id in entities.split(',') if id.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity IDs format")
    
    # Calculate emissions using the service
    try:
        emissions_response = calc_emissions(
            date_range=(start, end),
            entities=entity_ids,
            pareto=pareto
        )
        return emissions_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating emissions: {str(e)}")


@router.get("/legacy")
def list_emissions_legacy(
    entity_id: int | None = None,
    period: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(25, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Legacy endpoint for backward compatibility."""
    q = db.query(EmissionRecord)
    if period:
        q = q.filter(EmissionRecord.period == period)
    if entity_id:
        # join via UploadedActivity
        q = q.join(UploadedActivity, UploadedActivity.id == EmissionRecord.activity_id).filter(
            UploadedActivity.entity_id == entity_id
        )

    total = q.count()
    items = q.offset((page - 1) * size).limit(size).all()

    # totals by scope
    totals_by_scope: dict[str, float] = {}
    total_kg = 0.0
    for rec in items:
        totals_by_scope[rec.scope] = totals_by_scope.get(rec.scope, 0.0) + rec.co2e_kg
        total_kg += rec.co2e_kg

    return {
        "page": page,
        "size": size,
        "total": total,
        "items": [
            {"id": r.id, "activity_id": r.activity_id, "co2e_kg": r.co2e_kg, "scope": r.scope, "period": r.period}
            for r in items
        ],
        "totals_by_scope": totals_by_scope,
        "total_kg": total_kg,
    }

