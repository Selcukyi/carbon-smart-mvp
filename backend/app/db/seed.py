from sqlalchemy.orm import Session

from ..db.database import Base, engine, SessionLocal
from ..models import (
    Group,
    Entity,
    Facility,
    EmissionFactor,
    GasGWP,
    UploadedActivity,
    EUETSAllowanceLedger,
)


def seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Group and Entities
        group = Group(name="Acme Group")
        db.add(group)
        db.flush()

        foods = Entity(name="Acme Foods", group_id=group.id, yearly_budget_tco2e=10000)
        logistics = Entity(name="Acme Logistics", group_id=group.id, yearly_budget_tco2e=7000)
        db.add_all([foods, logistics])
        db.flush()

        izmir = Facility(name="Izmir Plant", entity_id=foods.id)
        ankara = Facility(name="Ankara Hub", entity_id=logistics.id)
        db.add_all([izmir, ankara])
        db.flush()

        # Factors
        factors = [
            ("electricity_TR", "Electricity TR Grid", "kWh", 0.42, "Scope2"),
            ("diesel", "Diesel", "L", 2.68, "Scope1"),
            ("petrol", "Petrol", "L", 2.31, "Scope1"),
            ("natural_gas", "Natural Gas", "m3", 1.90, "Scope1"),
            ("road_km", "Road Freight", "km", 0.12, "Scope3"),
            ("air_km", "Business Air Travel", "km", 0.25, "Scope3"),
        ]
        db.add_all(
            [
                EmissionFactor(
                    code=c, name=n, unit=u, factor_kgco2_per_unit=f, scope_hint=s
                )
                for (c, n, u, f, s) in factors
            ]
        )

        # GWP
        db.add_all([GasGWP(gas="CH4", gwp100=28), GasGWP(gas="N2O", gwp100=265)])

        # Activities (2025-Q3)
        db.add_all(
            [
                UploadedActivity(
                    entity_id=foods.id,
                    facility_id=izmir.id,
                    scope="Scope2",
                    activity_name="Electricity consumption",
                    unit="kWh",
                    amount=150000,
                    factor_code="electricity_TR",
                    period="2025-Q3",
                ),
                UploadedActivity(
                    entity_id=foods.id,
                    facility_id=izmir.id,
                    scope="Scope1",
                    activity_name="Boiler natural gas",
                    unit="m3",
                    amount=30000,
                    factor_code="natural_gas",
                    period="2025-Q3",
                ),
                UploadedActivity(
                    entity_id=logistics.id,
                    facility_id=ankara.id,
                    scope="Scope1",
                    activity_name="Diesel for fleet",
                    unit="L",
                    amount=20000,
                    factor_code="diesel",
                    period="2025-Q3",
                ),
                UploadedActivity(
                    entity_id=logistics.id,
                    facility_id=ankara.id,
                    scope="Scope3",
                    activity_name="Freight distance",
                    unit="km",
                    amount=120000,
                    factor_code="road_km",
                    period="2025-Q3",
                ),
            ]
        )

        # EU ETS ledger starting allowances
        db.add_all(
            [
                EUETSAllowanceLedger(entity_id=foods.id, delta_allowances=5000, note="seed"),
                EUETSAllowanceLedger(entity_id=logistics.id, delta_allowances=3000, note="seed"),
            ]
        )

        db.commit()
        print("Seed completed.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

