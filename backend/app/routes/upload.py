from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..models.org import Entity, Facility
from ..models.activity import UploadedActivity
from ..services.parser import parse_activity_file


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    df, missing = parse_activity_file(content, file.filename)
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

    inserted = 0
    errors: list[dict] = []
    for idx, row in df.iterrows():
        try:
            entity = db.query(Entity).filter(Entity.name == str(row["entity"]).strip()).first()
            facility = (
                db.query(Facility)
                .filter(Facility.name == str(row["facility"]).strip())
                .first()
            )
            if not entity or not facility:
                raise ValueError("Entity or Facility not found")
            obj = UploadedActivity(
                entity_id=entity.id,
                facility_id=facility.id,
                scope=str(row["scope"]).strip(),
                activity_name=str(row["activity_name"]).strip(),
                unit=str(row["unit"]).strip(),
                amount=float(row["amount"]),
                factor_code=str(row["factor_code"]).strip(),
                period=str(row["period"]).strip(),
            )
            db.add(obj)
            inserted += 1
        except Exception as exc:  # noqa: BLE001
            errors.append({"row": int(idx), "error": str(exc)})

    db.commit()

    return {"status": "ok", "inserted": inserted, "errors": errors, "total_rows": len(df)}

