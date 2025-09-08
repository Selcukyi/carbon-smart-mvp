from fastapi import APIRouter

from ..services.eu_ets import price_feed


router = APIRouter(prefix="/eu-ets", tags=["eu-ets"])


@router.get("/price")
def get_price():
    return {"price_eur_per_tco2": price_feed()}

