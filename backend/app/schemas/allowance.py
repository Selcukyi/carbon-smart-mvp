from pydantic import BaseModel


class AllowanceAdjustRequest(BaseModel):
    entity_id: int
    delta_allowances: float
    note: str | None = None


class TransferRequest(BaseModel):
    from_entity_id: int
    to_entity_id: int
    allowances: float
    note: str | None = None


class AllowanceSummary(BaseModel):
    entity_id: int
    owned: float
    committed: float
    available: float

