from sqlalchemy import Column, Integer, String, Float

from ..db.database import Base


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    factor_kgco2_per_unit = Column(Float, nullable=False)
    scope_hint = Column(String, nullable=False)  # Scope1/Scope2/Scope3


class GasGWP(Base):
    __tablename__ = "gas_gwp"

    id = Column(Integer, primary_key=True, index=True)
    gas = Column(String, unique=True, nullable=False)
    gwp100 = Column(Float, nullable=False)

