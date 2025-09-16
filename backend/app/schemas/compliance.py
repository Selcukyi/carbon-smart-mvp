from pydantic import BaseModel
from typing import List


class AllowancePoint(BaseModel):
    year: int
    allocated: float
    actual: float
    over_by: float


class PriceScenario(BaseModel):
    price_eur: float
    exposure_eur: float


class ComplianceResponse(BaseModel):
    current_overshoot_tco2e: float
    ytd_cost_eur: float
    allowances: List[AllowancePoint]
    scenarios: List[PriceScenario]