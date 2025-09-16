from datetime import date
from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel

T = TypeVar('T')

class DateRange(BaseModel):
    start: date
    end: date

class Paginated(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int

class EntityRef(BaseModel):
    id: int
    name: str

class KPI(BaseModel):
    name: str
    value: float
    unit: str
    change_percent: Optional[float] = None
    trend: Optional[str] = None  # 'up', 'down', 'stable'

class ScopeShare(BaseModel):
    scope: str  # 'Scope 1', 'Scope 2', 'Scope 3'
    percentage: float
    emissions: float
    color: str

class CategoryEmission(BaseModel):
    category: str
    emissions: float
    percentage: float
    scope: str
    trend: Optional[str] = None

class Allowance(BaseModel):
    entity_id: int
    entity_name: str
    allocated: float
    used: float
    remaining: float
    price: float
    value: float

class IntensityPoint(BaseModel):
    date: date
    intensity: float
    revenue: float
    emissions: float

class AIExplainRequest(BaseModel):
    context: str
    params: dict
    question: Optional[str] = None

class AIExplainResponse(BaseModel):
    explanation: str
    confidence: float
    sources: List[str]
    recommendations: List[str]