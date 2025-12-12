import React, { useState, useEffect, useCallback } from "react";
import CollectionCard from "../../components/skins/CollectionCard/CollectionCard";
import SkeletonCard from "../../components/skins/Skeleton/Skeleton";
import styles from "./Collections.module.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Функция для загрузки данных
  const fetchCollections = useCallback(async (pageNum = 1, search = "", isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
        ...(search && { search })
      });

      const response = await fetch(`http://localhost:8000/crud_router/collections?${params}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (!data.collections || !Array.isArray(data.collections)) {
        throw new Error("Invalid data format");
      }

      // Обрабатываем изображения
      const collectionsWithProcessedImages = data.collections.map(collection => ({
        ...collection,
        image_url: processImageUrl(collection.image_url)
      }));

      if (isLoadMore) {
        // Добавляем к существующим коллекциям
        setCollections(prev => [...prev, ...collectionsWithProcessedImages]);
      } else {
        // Заменяем коллекции
        setCollections(collectionsWithProcessedImages);
      }

      setHasMore(data.has_more);
      setTotal(data.total);
      setPage(pageNum);

      // Предзагрузка изображений для новых коллекций
      if (collectionsWithProcessedImages.length > 0) {
        preloadImages(collectionsWithProcessedImages);
      }
      
    } catch (err) {
      console.error("Ошибка загрузки коллекций:", err);
      if (!isLoadMore) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Функция для обработки URL изображений
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-collection.jpg";
    
    if (imageUrl.startsWith('http')) return imageUrl;
    
    if (imageUrl.startsWith('/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Предзагрузка изображений
  const preloadImages = (collectionsToPreload) => {
    collectionsToPreload.forEach(collection => {
      const img = new Image();
      img.src = collection.image_url;
    });
  };

  // Первоначальная загрузка
  useEffect(() => {
    fetchCollections(1, "");
  }, [fetchCollections]);

  // Обработчик поиска с дебаунсом
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Дебаунс для поиска - 500ms
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      fetchCollections(1, value);
    }, 500));
  };

  // Функция для подгрузки еще элементов
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchCollections(page + 1, searchTerm, true);
    }
  }, [hasMore, loadingMore, page, searchTerm, fetchCollections]);

  if (loading && collections.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Коллекции скинов</h1>
        <input
          type="text"
          placeholder="Поиск коллекций..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          disabled
        />
        <div className={styles.grid}>
          {[...Array(12)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error && collections.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Ошибка загрузки: {error}</p>
          <button 
            onClick={() => fetchCollections(1, searchTerm)} 
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Коллекции скинов</h1>
      <input
        type="text"
        placeholder="Поиск коллекций..."
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />
      
      {/* Информация о результатах */}
      <div className={styles.resultsInfo}>
        {searchTerm ? (
          <>
            Найдено коллекций: {total}
            {hasMore && ` (показано ${collections.length})`}
          </>
        ) : (
          <>
            Всего коллекций: {total}
            {hasMore && ` (показано ${collections.length})`}
          </>
        )}
      </div>

      <div className={styles.grid}>
        {collections.map(({ id, display_name, image_url }) => (
          <CollectionCard
            key={id}
            id={id}
            title={display_name}
            imageUrl={image_url}
          />
        ))}
        
        {/* Скелетоны при подгрузке */}
        {loadingMore && [...Array(6)].map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>

      {/* Кнопка "Показать еще" */}
      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            onClick={loadMore}
            disabled={loadingMore}
            className={styles.loadMoreButton}
          >
            {loadingMore ? 'Загрузка...' : 'Показать еще'}
          </button>
        </div>
      )}

      {/* Сообщение когда все загружено */}
      {!hasMore && collections.length > 0 && (
        <div className={styles.allLoaded}>
          {collections.length === total ? 'Все коллекции загружены' : 'Больше коллекций нет'}
        </div>
      )}

      {/* Сообщение когда нет результатов */}
      {collections.length === 0 && !loading && (
        <div className={styles.noResults}>
          {searchTerm ? 'Коллекции по вашему запросу не найдены' : 'Коллекции не найдены'}
        </div>
      )}
    </div>
  );
};

export default Collections;