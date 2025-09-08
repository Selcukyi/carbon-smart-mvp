from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..models.org import Group, Entity, Facility
from ..schemas.org import (
    GroupCreate,
    GroupRead,
    EntityCreate,
    EntityRead,
    FacilityCreate,
    FacilityRead,
)


router = APIRouter(prefix="/org", tags=["org"])


@router.post("/groups", response_model=GroupRead)
def create_group(payload: GroupCreate, db: Session = Depends(get_db)):
    obj = Group(name=payload.name)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/groups", response_model=list[GroupRead])
def list_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()


@router.post("/entities", response_model=EntityRead)
def create_entity(payload: EntityCreate, db: Session = Depends(get_db)):
    if not db.get(Group, payload.group_id):
        raise HTTPException(status_code=404, detail="Group not found")
    obj = Entity(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/entities", response_model=list[EntityRead])
def list_entities(db: Session = Depends(get_db)):
    return db.query(Entity).all()


@router.post("/facilities", response_model=FacilityRead)
def create_facility(payload: FacilityCreate, db: Session = Depends(get_db)):
    if not db.get(Entity, payload.entity_id):
        raise HTTPException(status_code=404, detail="Entity not found")
    obj = Facility(**payload.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/facilities", response_model=list[FacilityRead])
def list_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()

