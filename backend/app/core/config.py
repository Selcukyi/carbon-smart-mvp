from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Carbon MVP"
    environment: str = "development"
    database_url: str = "sqlite:///./carbon_mvp.db"
    eu_ets_mock_price_eur_per_tco2: float = 85.0
    openai_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

