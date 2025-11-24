from datetime import datetime
from typing import Optional, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, validator

from app.database import db
from app.database_methods.crud import CRUD
from app.routers.auth import get_current_user

router = APIRouter()
crud = CRUD(db)


# Модели данных для валидации (соответствуют вашей схеме БД)
class ReviewCreate(BaseModel):
    collection_id: int = Field(..., gt=0, description="ID коллекции")
    title: str = Field(..., min_length=1, max_length=255, description="Заголовок рецензии")
    content: str = Field(..., min_length=300, max_length=10000, description="Текст рецензии")
    total_score: int = Field(..., ge=0, le=90, description="Общий балл")
    design: int = Field(..., ge=0, le=10, description="Дизайн")
    sound: int = Field(..., ge=0, le=10, description="Звук")
    animations: int = Field(..., ge=0, le=10, description="Анимации")
    sfx: int = Field(..., ge=0, le=10, description="Эффекты")
    vibe: int = Field(..., ge=0, le=10, description="Вайб")


# Эндпоинты
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_review(
        review: ReviewCreate,
        current_user: dict = Depends(get_current_user)
):
    """
    Создание новой рецензии
    """
    # Проверяем существование коллекции
    collection_check = crud.get_table_data_by_column(
        "Collections", "id", review.collection_id, 1
    )
    if collection_check["status"] != "success" or collection_check.get("row_count", 0) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Коллекция не найдена"
        )

    # Проверяем, не оставлял ли пользователь уже рецензию на эту коллекцию
    existing_review = crud.get_table_data_by_filters("Reviews", {
        "user_id": current_user["id"],
        "collection_id": review.collection_id
    }, 1)

    if existing_review["status"] == "success" and existing_review.get("row_count", 0) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы уже оставляли рецензию на эту коллекцию"
        )

    # Подготавливаем данные для вставки (соответствуют структуре таблицы Reviews)
    review_data = {
        "user_id": current_user["id"],
        "collection_id": review.collection_id,
        "title": review.title,
        "content": review.content,
        "total_score": review.total_score,
        "design": review.design,
        "sound": review.sound,
        "animations": review.animations,
        "sfx": review.sfx,
        "vibe": review.vibe,
        "is_approved": False,  # по умолчанию не одобрена
        "is_edited": False,  # по умолчанию не редактировалась
        "likes_count": 0,  # по умолчанию 0 лайков
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    # Создаем рецензию
    result = crud.insert_data("Reviews", review_data)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ошибка при создании рецензии: {result['message']}"
        )

    # Обновляем агрегированные рейтинги коллекции
    await update_collection_ratings(review.collection_id)

    return {
        "status": "success",
        "message": "Рецензия успешно создана",
        "review_id": result.get("inserted_id"),
        "data": review_data
    }


@router.get("/")
async def get_reviews(
        collection_id: Optional[int] = None,
        user_id: Optional[int] = None,
        is_approved: Optional[bool] = True,  # по умолчанию только одобренные
        limit: int = 100
):
    """
    Получение списка рецензий с фильтрацией
    """
    filters = {"is_approved": is_approved}
    if collection_id:
        filters["collection_id"] = collection_id
    if user_id:
        filters["user_id"] = user_id

    result = crud.get_table_data_by_filters("Reviews", filters, limit)
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )

    return result


@router.get("/{review_id}")
async def get_review(review_id: int):
    """
    Получение конкретной рецензии по ID
    """
    result = crud.get_table_data_by_column("Reviews", "id", review_id, 1)
    if result["status"] == "error" or result.get("row_count", 0) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Рецензия не найдена"
        )

    return result


@router.get("/collection/{collection_id}")
async def get_collection_reviews(
        collection_id: int,
        limit: int = 50
):
    """
    Получение рецензий для конкретной коллекции
    """
    result = crud.get_table_data_by_filters("Reviews", {
        "collection_id": collection_id,
        "is_approved": True  # только одобренные
    }, limit)

    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )

    return result


@router.get("/user/me")
async def get_my_reviews(
        limit: int = 50,
        current_user: dict = Depends(get_current_user)
):
    """
    Получение рецензий текущего пользователя
    """
    result = crud.get_table_data_by_filters("Reviews", {
        "user_id": current_user["id"]
    }, limit)

    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )

    return result


@router.delete("/{review_id}")
async def delete_review(
        review_id: int,
        current_user: dict = Depends(get_current_user)
):
    """
    Удаление рецензии (только своей)
    """
    # Сначала проверяем существование рецензии и права доступа
    review_result = crud.get_table_data_by_column("Reviews", "id", review_id, 1)
    if review_result["status"] != "success" or review_result.get("row_count", 0) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Рецензия не найдена"
        )

    review = review_result["data"][0]
    if review["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для удаления этой рецензии"
        )

    # Сохраняем collection_id для обновления рейтингов
    collection_id = review["collection_id"]

    # Удаляем рецензию
    result = crud.delete_data("Reviews", {"id": review_id})
    if result["status"] == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )

    # Обновляем агрегированные рейтинги коллекции
    await update_collection_ratings(collection_id)

    return {
        "status": "success",
        "message": "Рецензия успешно удалена"
    }


# Вспомогательная функция для обновления агрегированных рейтингов
async def update_collection_ratings(collection_id: int):
    """
    Обновление агрегированных рейтингов коллекции
    """
    try:
        # Получаем все одобренные рецензии для коллекции
        reviews_result = crud.get_table_data_by_filters("Reviews", {
            "collection_id": collection_id,
            "is_approved": True
        }, 1000)

        if reviews_result["status"] != "success" or not reviews_result.get("data"):
            return

        reviews = reviews_result["data"]
        reviews_count = len(reviews)

        # Вычисляем средние значения
        avg_total_score = sum(r["total_score"] for r in reviews) / reviews_count
        avg_design = sum(r["design"] for r in reviews) / reviews_count
        avg_sound = sum(r["sound"] for r in reviews) / reviews_count
        avg_animations = sum(r["animations"] for r in reviews) / reviews_count
        avg_sfx = sum(r["sfx"] for r in reviews) / reviews_count
        avg_vibe = sum(r["vibe"] for r in reviews) / reviews_count

        # Проверяем существование записи в CollectionRatings
        existing_rating = crud.get_table_data_by_filters("CollectionRatings", {
            "collection_id": collection_id
        }, 1)

        rating_data = {
            "collection_id": collection_id,
            "reviews_count": reviews_count,
            "average_total_score": round(avg_total_score, 1),
            "average_design": round(avg_design, 1),
            "average_sound": round(avg_sound, 1),
            "average_animations": round(avg_animations, 1),
            "average_sfx": round(avg_sfx, 1),
            "average_vibe": round(avg_vibe, 1),
            "last_calculated": datetime.utcnow()
        }

        if existing_rating["status"] == "success" and existing_rating.get("row_count", 0) > 0:
            # Обновляем существующую запись
            crud.update_data("CollectionRatings", {"collection_id": collection_id}, rating_data)
        else:
            # Создаем новую запись
            crud.insert_data("CollectionRatings", rating_data)

    except Exception as e:
        print(f"Ошибка при обновлении рейтингов коллекции: {e}")


# Эндпоинт для лайков рецензий
@router.post("/{review_id}/like")
async def like_review(
        review_id: int,
        current_user: dict = Depends(get_current_user)
):
    """
    Поставить/убрать лайк рецензии
    """
    # Проверяем существование рецензии
    review_result = crud.get_table_data_by_column("Reviews", "id", review_id, 1)
    if review_result["status"] != "success" or review_result.get("row_count", 0) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Рецензия не найдена"
        )

    # Проверяем, не лайкал ли уже пользователь
    existing_like = crud.get_table_data_by_filters("ReviewLikes", {
        "user_id": current_user["id"],
        "review_id": review_id
    }, 1)

    if existing_like["status"] == "success" and existing_like.get("row_count", 0) > 0:
        # Убираем лайк
        crud.delete_data("ReviewLikes", {
            "user_id": current_user["id"],
            "review_id": review_id
        })
        # Уменьшаем счетчик лайков
        crud.update_data("Reviews", {"id": review_id}, {
            "likes_count": review_result["data"][0]["likes_count"] - 1
        })
        return {"status": "success", "message": "Лайк убран", "liked": False}
    else:
        # Ставим лайк
        like_data = {
            "user_id": current_user["id"],
            "review_id": review_id,
            "created_at": datetime.utcnow()
        }
        crud.insert_data("ReviewLikes", like_data)
        # Увеличиваем счетчик лайков
        crud.update_data("Reviews", {"id": review_id}, {
            "likes_count": review_result["data"][0]["likes_count"] + 1
        })
        return {"status": "success", "message": "Лайк поставлен", "liked": True}