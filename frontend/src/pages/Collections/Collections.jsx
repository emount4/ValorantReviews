import React, { useState, useEffect } from 'react';
import CollectionCard from '../../components/skins/CollectionCard/CollectionCard';
import SkeletonCard from '../../components/skins/Skeleton/Skeleton';
import styles from './Collections.module.css';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/crud_router/collections')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        // Проверяем, что data — массив
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }
        setCollections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки коллекций:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCollections = collections.filter(collection =>
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
          onChange={e => setSearchTerm(e.target.value)}
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

  if (error) return <div className={styles.error}>Ошибка загрузки: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Коллекции скинов</h1>
      
      <input
        type="text"
        placeholder="Поиск коллекций..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.grid}>
        {filteredCollections.map(({ id, display_name, image_url }) => (
          <CollectionCard
            key={id}
            title={display_name}
            imageUrl={image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;