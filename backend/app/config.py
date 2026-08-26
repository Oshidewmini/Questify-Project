import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)


class Settings:
    PROJECT_NAME: str = "Questify AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "questify-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./questify.db",
    )

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
    GEMINI_REQUEST_DELAY: float = float(os.getenv("GEMINI_REQUEST_DELAY", "2"))

    T5_MODEL_NAME: str = "t5-base"
    BERT_MODEL_NAME: str = "bert-base-uncased"


settings = Settings()
