from pydantic import BaseModel
from typing import Optional, List

# Добавьте сюда схемы для запросов и ответов API
class HealthResponse(BaseModel):
    status: str
    database: str
    table_counts: dict
    database_info: dict
    timestamp: float