from typing import Dict, Any


def compute_emissions_for_activity(amount: float, factor_kgco2_per_unit: float) -> float:
    if amount is None or factor_kgco2_per_unit is None:
        return 0.0
    return float(amount) * float(factor_kgco2_per_unit)


def aggregate_emissions(records: list[dict]) -> Dict[str, Any]:
    totals_by_scope: Dict[str, float] = {}
    total_kg = 0.0
    for rec in records:
        scope = rec.get("scope", "Unknown")
        kg = float(rec.get("co2e_kg", 0.0))
        totals_by_scope[scope] = totals_by_scope.get(scope, 0.0) + kg
        total_kg += kg
    return {
        "total_kg": total_kg,
        "totals_by_scope": totals_by_scope,
    }

