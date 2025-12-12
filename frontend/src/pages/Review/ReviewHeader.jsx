import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./ReviewHeader.module.css";

const ReviewHeader = () => {
  const [collection, setCollection] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { collectionId } = useParams(); 
  const location = useLocation();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const navigationData = location.state?.collectionData;

  useEffect(() => {
    if (navigationData) {
      setCollection(navigationData);
    } else if (collectionId) { 
      fetch(`http://localhost:8000/crud_router/table-data/Collections/column/${collectionId}?column=id&limit=1`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data && data.data.length > 0) {
            setCollection(data.data[0]);
          }
        })
        .catch((err) => console.error("Ошибка загрузки коллекции:", err));
    }
  }, [collectionId, navigationData]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.jpg";
    
    if (imagePath.startsWith('http')) return imagePath;
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:8000${imagePath}`;
    }
    
    return imagePath;
  };

  const contentTypes = ["image", "video", "other"];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % contentTypes.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + contentTypes.length) % contentTypes.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!collection) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.headerContainer}>
      <div 
        className={styles.mediaSection}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          onClick={prev} 
          aria-label="Previous media" 
          className={`${styles.navButton} ${styles.desktopOnly}`}
        >{`<`}</button>

        {currentIndex === 0 && (
          <img
            src={getImageUrl(collection.image_url)}
            alt={collection.display_name}
            className={styles.collectionImage}
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />
        )}

        {currentIndex === 1 && (
          <video
            src={collection.video_url || "/placeholder-video.mp4"}
            controls
            className={styles.collectionVideo}
          />
        )}

        {currentIndex === 2 && (
          <div className={styles.otherMaterials}>
            <p>Другие материалы коллекции</p>
          </div>
        )}

        <button 
          onClick={next} 
          aria-label="Next media" 
          className={`${styles.navButton} ${styles.desktopOnly}`}
        >{`>`}</button>
      </div>
      
      <div className={styles.collectionTitle}>
        <h1>{collection.display_name}</h1>
      </div>

      <div className={styles.swipeIndicators}>
        <span className={styles.swipeHint}>← Свайп для навигации →</span>
      </div>
    </div>
  );
};

export default ReviewHeader;