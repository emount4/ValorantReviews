import React, { useState, useEffect } from "react";
import CollectionCard from "../../components/skins/CollectionCard/CollectionCard";
import SkeletonCard from "../../components/skins/Skeleton/Skeleton";
import styles from "./Collections.module.css";

// Компонент для обработки ошибок загрузки изображений
const ImageWithFallback = ({ src, alt, className, fallbackSrc = "/placeholder-collection.jpg" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  return (
    <>
      {loading && <div className={styles.imageLoading}>Загрузка...</div>}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </>
  );
};

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/crud_router/collections");
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        // Предзагрузка первых нескольких изображений
        const collectionsWithProcessedImages = data.map(collection => ({
          ...collection,
          image_url: processImageUrl(collection.image_url)
        }));

        setCollections(collectionsWithProcessedImages);
        preloadImportantImages(collectionsWithProcessedImages.slice(0, 4));
        
      } catch (err) {
        console.error("Ошибка загрузки коллекций:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
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

  // Предзагрузка важных изображений
  const preloadImportantImages = (importantCollections) => {
    importantCollections.forEach(collection => {
      const img = new Image();
      img.src = collection.image_url;
    });
  };

  const filteredCollections = collections.filter((collection) =>
    collection.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Коллекции скинов</h1>
        <input
          type="text"
          placeholder="Поиск коллекций..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          disabled
        />
        <div className={styles.grid}>
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Ошибка загрузки: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Попробовать снова
        </button>
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
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.grid}>
        {filteredCollections.map(({ id, display_name, image_url }) => (
          <CollectionCard
            key={id}
            id={id}
            title={display_name}
            imageUrl={image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;