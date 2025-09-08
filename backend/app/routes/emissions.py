from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from ..db.database import get_db
from ..models.activity import UploadedActivity
from ..models.emission import EmissionRecord
from ..models.factors import EmissionFactor
from ..services.calc import compute_emissions_for_activity


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


@router.get("")
def list_emissions(
    entity_id: int | None = None,
    period: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(25, ge=1, le=200),
    db: Session = Depends(get_db),
):
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

