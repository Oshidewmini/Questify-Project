import os

class Settings:
    PROJECT_NAME: str = "Questify AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "questify-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./questify.db"  # Fallback to local SQLite if Postgres container is not running
    )
    
    # Model configs
    T5_MODEL_NAME: str = "t5-base"
    BERT_MODEL_NAME: str = "bert-base-uncased"

settings = Settings()
