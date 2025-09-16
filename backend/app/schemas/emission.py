from datetime import date
from typing import List, Optional
from pydantic import BaseModel

class EmissionPoint(BaseModel):
    date: date
    tco2e: float

class ScopeShare(BaseModel):
    scope: str
    tco2e: float
    pct: float

class CategoryEmission(BaseModel):
    category: str
    tco2e: float

class EmissionsResponse(BaseModel):
    summary: dict  # total_tco2e, yoy_pct
    series: List[EmissionPoint]
    scopes: List[ScopeShare]
    top_categories: List[CategoryEmission]

class EmissionRecordRead(BaseModel):
    id: int
    activity_id: int
    co2e_kg: float
    scope: str
    period: str

    class Config:
        from_attributes = True