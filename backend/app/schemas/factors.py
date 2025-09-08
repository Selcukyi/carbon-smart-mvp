from pydantic import BaseModel


class EmissionFactorRead(BaseModel):
    id: int
    code: str
    name: str
    unit: str
    factor_kgco2_per_unit: float
    scope_hint: str

    class Config:
        from_attributes = True


class GasGWPRead(BaseModel):
    id: int
    gas: str
    gwp100: float

    class Config:
        from_attributes = True

