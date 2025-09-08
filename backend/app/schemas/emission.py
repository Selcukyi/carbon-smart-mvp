from pydantic import BaseModel


class EmissionRecordRead(BaseModel):
    id: int
    activity_id: int
    co2e_kg: float
    scope: str
    period: str

    class Config:
        from_attributes = True

