
import React, { useState, useEffect } from "react";
import styles from "./favorites.module.css";
import CircularCollectionCard from "./CircularCollectionCard";

const Favorites = () => {
  const [favoriteCollections, setFavoriteCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const mockFavorites = [
          {
            id: 1,
            display_name: "RGX",
            image_url: "https://media.valorant-api.com/bundles/35815cab-429d-79e4-43f5-e0af8fdac22b/displayicon.png"
          },
          {
            id: 2,
            display_name: "Высота",
            image_url: "https://media.valorant-api.com/bundles/a4937ee9-4148-8ff2-2c11-c28891880306/displayicon.png"
          },
          {
            id: 3,
            display_name: "Герои с картонок", 
            image_url: "https://media.valorant-api.com/bundles/5c8b9297-465f-080c-3c0d-c9b9811432ed/displayicon.png"
          },
          {
            id: 4,
            display_name: "Китай",
            image_url: "https://media.valorant-api.com/bundles/3bd7465d-4257-8583-c563-188ae47cc7c6/displayicon.png"
          },
          {
            id: 5,
            display_name: "Champions 2021",
            image_url: "https://media.valorant-api.com/bundles/bf987f36-4a33-45e4-3c49-1ab9a2502607/displayicon.png"
          }
        ];
        
        setFavoriteCollections(mockFavorites);
      } catch (error) {
        console.error("Ошибка загрузки избранных коллекций:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className={styles.favoritesContainer}>
        <h3>Избранные коллекции</h3>
        <div className={styles.loadingMessage}>Загрузка избранных коллекций...</div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesContainer}>
      <h3>Избранные коллекции</h3>
      <div className={styles.favoritesGrid}>
        {favoriteCollections.length > 0 ? (
          favoriteCollections.map((collection) => (
            <CircularCollectionCard
              key={collection.id}
              id={collection.id}
              title={collection.display_name}
              imageUrl={collection.image_url}
            />
          ))
        ) : (
          <div className={styles.emptyMessage}>
            У вас пока нет избранных коллекций
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
