from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship

from ..db.database import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)

    entities = relationship("Entity", back_populates="group", cascade="all, delete-orphan")


class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    yearly_budget_tco2e = Column(Float, default=0.0)

    group = relationship("Group", back_populates="entities")
    facilities = relationship("Facility", back_populates="entity", cascade="all, delete-orphan")


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey("entities.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)

    entity = relationship("Entity", back_populates="facilities")

