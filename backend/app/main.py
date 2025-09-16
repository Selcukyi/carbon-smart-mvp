from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import health
from .routes import factors as factors_routes
from .routes import org as org_routes
from .routes import upload as upload_routes
from .routes import emissions as emissions_routes
from .routes import allowances as allowances_routes
from .routes import eu_ets as eu_ets_routes
from .routes import llm as llm_routes
from .routes import compliance as compliance_routes
from .routes import intensity as intensity_routes


def create_app() -> FastAPI:
    app = FastAPI(title="CarbonLens API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "https://carbon-smart-mvp.vercel.app"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(factors_routes.router)
    app.include_router(org_routes.router)
    app.include_router(upload_routes.router)
    app.include_router(emissions_routes.router)
    app.include_router(allowances_routes.router)
    app.include_router(eu_ets_routes.router)
    app.include_router(llm_routes.router)
    app.include_router(compliance_routes.router)
    app.include_router(intensity_routes.router)

    return app


app = create_app()

