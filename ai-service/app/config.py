import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "CareerSetu AI Intelligence Engine"
    API_V1_STR: str = "/api/v1/ai"
    PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    HOST: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_AI_PROVIDER", "gemini")
    
    # Security & DPDP Compliance
    ENABLE_PII_MASKING: bool = os.getenv("ENABLE_PII_MASKING", "true").lower() == "true"
    ENABLE_PROMPT_INJECTION_DEFENSE: bool = True
    MAX_PROMPT_LENGTH: int = 4000

settings = Settings()
