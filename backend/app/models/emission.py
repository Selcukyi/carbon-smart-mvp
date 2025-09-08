from sqlalchemy import Column, Integer, String, Float, ForeignKey

from ..db.database import Base


class EmissionRecord(Base):
    __tablename__ = "emission_records"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("uploaded_activities.id"), nullable=False, index=True)
    co2e_kg = Column(Float, nullable=False)
    scope = Column(String, nullable=False)
    period = Column(String, nullable=False)

