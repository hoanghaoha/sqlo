from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str
    anthropic_api_key: str
    sqlite_base_path: str = "/tmp/datasets"
    environment: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()  # type: ignore[call-arg]
