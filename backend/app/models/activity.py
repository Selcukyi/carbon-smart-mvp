from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from ..db.database import Base


class UploadedActivity(Base):
    __tablename__ = "uploaded_activities"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=False, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False, index=True)
    scope = Column(String, nullable=False)
    activity_name = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    factor_code = Column(String, nullable=False)
    period = Column(String, nullable=False)

