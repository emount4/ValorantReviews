import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Reviews.module.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/reviews/user/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === "success" && result.data) {
        const reviewsWithCollectionData = await Promise.all(
          result.data.map(async (review) => {
            try {
              const collectionResponse = await fetch(
                `http://localhost:8000/crud_router/table-data/Collections/column/${review.collection_id}?column=id&limit=1`
              );
              
              if (collectionResponse.ok) {
                const collectionData = await collectionResponse.json();
                if (collectionData.data && collectionData.data.length > 0) {
                  const collection = collectionData.data[0];
                  console.log("Collection data:", collection); // Отладка
                  return {
                    ...review,
                    collection: {
                      ...collection,
                      image_url: collection.image_url
                    }
                  };
                }
              }
              return review;
            } catch (error) {
              console.error("Ошибка загрузки коллекции:", error);
              return review;
            }
          })
        );
        
        setReviews(reviewsWithCollectionData);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки рецензий:", error);
      setError("Не удалось загрузить рецензии");
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return "Дата не указана";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Функция для получения URL изображения - ТАК ЖЕ КАК В CircularCollectionCard
  const getOptimizedImageUrl = (imageUrl, reviewId) => {
    console.log("Getting image URL:", imageUrl, "for review:", reviewId); // Отладка
    
    if (imageErrors.has(reviewId) || !imageUrl) {
      return "/placeholder-collection.jpg";
    }
    
    // Для внешних URL возвращаем как есть
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Если это относительный путь, добавляем базовый URL
    if (imageUrl.startsWith('/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    
    return imageUrl;
  };

  const handleImageError = (reviewId) => {
    console.log("Image error for review:", reviewId);
    setImageErrors(prev => new Set(prev).add(reviewId));
  };

  // Функция для разворачивания/сворачивания текста рецензии
  const toggleReviewExpansion = (reviewId, e) => {
    e.stopPropagation();
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  // Функция для перехода на страницу рецензии
  const handleReviewClick = (collectionId) => {
    navigate(`/reviews/${collectionId}`);
  };

  // Функция для проверки, нужно ли показывать кнопку "Развернуть"
  const shouldShowExpandButton = (content) => {
    return content && content.length > 200;
  };

  // Функция для получения укороченного текста
  const getShortenedText = (text) => {
    if (!text) return "";
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка рецензий...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button 
          onClick={fetchUserReviews}
          className={styles.retryButton}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Вы еще не написали ни одной рецензии</p>
          <p className={styles.emptySubtitle}>
            Напишите свою первую рецензию к любой коллекции!
          </p>
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map(review => (
            <div 
              key={review.id} 
              className={styles.reviewCard}
              onClick={() => handleReviewClick(review.collection_id)}
            >
              <div className={styles.reviewHeader}>
                <div className={styles.collectionInfo}>
                  <img 
                    src={getOptimizedImageUrl(review.collection?.image_url, review.id)}
                    alt={review.collection?.display_name || "Коллекция"}
                    className={styles.collectionImage}
                    onError={() => handleImageError(review.id)}
                    loading="lazy"
                    decoding="async"
                    width="60"
                    height="60"
                  />
                  <div className={styles.collectionDetails}>
                    <h3 className={styles.collectionName}>
                      {review.collection?.display_name || "Неизвестная коллекция"}
                    </h3>
                    <span className={styles.reviewDate}>
                      {formatDate(review.created_at)}
                      {review.is_edited && " (ред.)"}
                    </span>
                    {!review.is_approved && (
                      <span className={styles.pendingBadge}>На модерации</span>
                    )}
                  </div>
                </div>
                
                {/* Блок с рейтингом и всплывающими категориями */}
                <div className={styles.scoreContainer}>
                  <div className={styles.scoreBadge}>
                    <span className={styles.score}>{review.total_score}</span>
                    <span className={styles.scoreTotal}>/90</span>
                  </div>
                  
                  {/* Всплывающий блок с категориями */}
                  <div className={styles.categoriesTooltip}>
                    <div className={styles.categoryItem}>
                      <span className={styles.categoryLabel}>Дизайн:</span>
                      <span className={styles.categoryValue}>{review.design}</span>
                    </div>
                    <div className={styles.categoryItem}>
                      <span className={styles.categoryLabel}>Звук:</span>
                      <span className={styles.categoryValue}>{review.sound}</span>
                    </div>
                    <div className={styles.categoryItem}>
                      <span className={styles.categoryLabel}>Анимации:</span>
                      <span className={styles.categoryValue}>{review.animations}</span>
                    </div>
                    <div className={styles.categoryItem}>
                      <span className={styles.categoryLabel}>Эффекты:</span>
                      <span className={styles.categoryValue}>{review.sfx}</span>
                    </div>
                    <div className={styles.categoryItem}>
                      <span className={styles.categoryLabel}>Вайб:</span>
                      <span className={styles.categoryValue}>{review.vibe}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.reviewContent}>
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <div className={styles.reviewTextContainer}>
                  <p className={styles.reviewText}>
                    {expandedReviews.has(review.id) 
                      ? review.content 
                      : getShortenedText(review.content)
                    }
                  </p>
                  {shouldShowExpandButton(review.content) && (
                    <button
                      className={styles.expandButton}
                      onClick={(e) => toggleReviewExpansion(review.id, e)}
                    >
                      {expandedReviews.has(review.id) ? 'Свернуть' : 'Развернуть'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className={styles.reviewFooter}>
                <div className={styles.reviewStats}>
                  <span className={styles.likesCount}>❤️ {review.likes_count}</span>
                </div>
                <div className={styles.clickHint}>
                  Нажмите для просмотра на странице коллекции
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;