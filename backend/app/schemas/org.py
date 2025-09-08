from pydantic import BaseModel


class GroupBase(BaseModel):
    name: str


class GroupCreate(GroupBase):
    pass


class GroupRead(GroupBase):
    id: int

    class Config:
        from_attributes = True


class EntityBase(BaseModel):
    name: str
    group_id: int
    yearly_budget_tco2e: float = 0.0


class EntityCreate(EntityBase):
    pass


class EntityRead(EntityBase):
    id: int

    class Config:
        from_attributes = True


class FacilityBase(BaseModel):
    name: str
    entity_id: int


class FacilityCreate(FacilityBase):
    pass


class FacilityRead(FacilityBase):
    id: int

    class Config:
        from_attributes = True

