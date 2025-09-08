from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..schemas.allowance import AllowanceAdjustRequest, TransferRequest
from ..services.budget import allowance_summary, perform_transfer
from ..models.allowance import EUETSAllowanceLedger


router = APIRouter(prefix="/allowances", tags=["allowances"])


@router.post("/adjust")
def adjust_allowances(payload: AllowanceAdjustRequest, db: Session = Depends(get_db)):
    entry = EUETSAllowanceLedger(
        entity_id=payload.entity_id,
        delta_allowances=payload.delta_allowances,
        note=payload.note,
    )
    db.add(entry)
    db.commit()
    return allowance_summary(db, payload.entity_id)


@router.post("/transfer")
def transfer_allowances(payload: TransferRequest, db: Session = Depends(get_db)):
    return perform_transfer(db, payload.from_entity_id, payload.to_entity_id, payload.allowances, payload.note)


@router.get("/summary")
def get_summary(entity_id: int, db: Session = Depends(get_db)):
    return allowance_summary(db, entity_id)

