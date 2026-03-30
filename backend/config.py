from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    gemini_api_key: str
    pinecone_api_key: str
    pinecone_index: str = "preplace-resumes"
    admin_email: str
    admin_password: str

    class Config:
        env_file = ".env"

settings = Settings()