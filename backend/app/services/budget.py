from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models.allowance import EUETSAllowanceLedger, EUETSTransfer


def _balance_query(db: Session, entity_id: int) -> float:
    total = db.query(func.coalesce(func.sum(EUETSAllowanceLedger.delta_allowances), 0.0)).filter(
        EUETSAllowanceLedger.entity_id == entity_id
    ).scalar()
    return float(total or 0.0)


def allowance_summary(db: Session, entity_id: int) -> dict:
    owned = _balance_query(db, entity_id)
    # For MVP, committed=0.0; available=owned
    return {"entity_id": entity_id, "owned": owned, "committed": 0.0, "available": owned}


def perform_transfer(db: Session, from_entity_id: int, to_entity_id: int, allowances: float, note: str | None = None) -> dict:
    if allowances <= 0:
        raise ValueError("allowances must be positive")

    from_balance = _balance_query(db, from_entity_id)
    if from_balance < allowances:
        raise ValueError("insufficient allowances")

    transfer = EUETSTransfer(
        from_entity_id=from_entity_id,
        to_entity_id=to_entity_id,
        allowances=allowances,
        note=note,
    )
    db.add(transfer)
    db.flush()

    db.add_all(
        [
            EUETSAllowanceLedger(entity_id=from_entity_id, delta_allowances=-allowances, note=f"transfer_out:{transfer.id}"),
            EUETSAllowanceLedger(entity_id=to_entity_id, delta_allowances=allowances, note=f"transfer_in:{transfer.id}"),
        ]
    )
    db.commit()

    return {
        "transfer_id": transfer.id,
        "from_balance": allowance_summary(db, from_entity_id),
        "to_balance": allowance_summary(db, to_entity_id),
    }

