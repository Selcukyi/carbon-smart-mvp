from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..models.factors import EmissionFactor, GasGWP
from ..schemas.factors import EmissionFactorRead, GasGWPRead


router = APIRouter(prefix="/factors", tags=["factors"])


@router.get("/", response_model=list[EmissionFactorRead])
def list_factors(db: Session = Depends(get_db)):
    return db.query(EmissionFactor).all()


@router.get("/gwp", response_model=list[GasGWPRead])
def list_gwp(db: Session = Depends(get_db)):
    return db.query(GasGWP).all()

