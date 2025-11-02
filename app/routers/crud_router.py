from typing import Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.dialects.postgresql import Any
from sqlalchemy.orm import Session
from starlette import status

from app.database import db, get_db
from app.database_methods.crud import CRUD
router = APIRouter()
crud = CRUD(db)


@router.get("/table-data/{table_name}")
async def get_data(table_name: str, limit: int = 100):
    data = crud.get_table_data(table_name, limit)
    if data["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Error getting data from table '{table_name}': {data['message']}"
        )
    return data
#вставка данных
@router.post("/table-data/{table_name}")
async def insert_data(table_name: str, data: dict):
    result = crud.insert_data(table_name, data)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    return result
#получение данных по условию
@router.get("/table-data/{table_name}/column/{data}")
async def get_by_column(table_name: str, data: str, column: str, limit: int = 100):
    result = crud.get_table_data_by_column(table_name, column, data, limit)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )
    return result

#удаление данных по условию принимает список вида [ключ:значение] и удаляет подходящие под условие данные
@router.delete("/table-data/{table_name}")
async def delete_where(
    table_name: str,
    data: dict  # Теперь это body, а не path parameter
):
    result = crud.delete_data(table_name, data)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    return result

@router.post("/table/{table_name}/row-count")
async def get_table_row_count(
    table_name: str,
    filters: dict= None  # JSON body с условиями фильтрации
):
    result = crud.get_row_count(table_name, filters)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

