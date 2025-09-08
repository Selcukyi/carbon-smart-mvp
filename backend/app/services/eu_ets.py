from ..core.config import settings


def price_feed() -> float:
    return float(settings.eu_ets_mock_price_eur_per_tco2)


def financial_impact(total_co2e_tons: float) -> float:
    return price_feed() * float(total_co2e_tons)

