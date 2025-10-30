from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/table-data/{table_name}")
async def get_data(table_name: str, limit: int = 100):
    data = crud.get_table_data(table_name, limit)
    if data["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Error getting data from table '{table_name}': {data['message']}"
        )
    return data

@router.post("/table-data/{table_name}")
async def insert_data(table_name: str, data: dict):
    result = crud.insert_data(table_name, data)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    return result

@router.get("/table-data/{table_name}/column/{data}")
async def get_by_column(table_name: str, data: str, column: str, limit: int = 100):
    result = crud.get_table_data_by_column(table_name, column, data, limit)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )
    return result