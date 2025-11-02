from typing import Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.dialects.postgresql import Any
from sqlalchemy.orm import Session
from starlette import status

from app.database import db, get_db
from app.database_methods.crud import CRUD
router = APIRouter()
crud = CRUD(db)

@router.get("/health")
async def health_check(db_session: Session = Depends(get_db)):
    # код health check
    pass

@router.get("/database-info")
async def database_info():
    return db.test_connection()

@router.get("/test-db")
async def test_database(db_session: Session = Depends(get_db)):
    # код test database
    pass
#получение таблицы целиком
