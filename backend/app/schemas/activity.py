from pydantic import BaseModel


class UploadedActivityBase(BaseModel):
    entity_id: int
    facility_id: int
    scope: str
    activity_name: str
    unit: str
    amount: float
    factor_code: str
    period: str


class UploadedActivityCreate(UploadedActivityBase):
    pass


class UploadedActivityRead(UploadedActivityBase):
    id: int

    class Config:
        from_attributes = True

