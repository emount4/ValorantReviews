import React, { useState } from 'react';
import styles from './Collections.module.css';

const collections = [
  { id: 1, title: 'Коллекция 1', imageUrl: '/images/collection1.jpg' },
  { id: 2, title: 'Коллекция 2', imageUrl: '/images/collection2.jpg' },
  { id: 3, title: 'Коллекция 3', imageUrl: '/images/collection3.jpg' },
  { id: 4, title: 'Коллекция 4', imageUrl: '/images/collection4.jpg' },
  { id: 5, title: 'Коллекция 5', imageUrl: '/images/collection5.jpg' },
  { id: 6, title: 'Коллекция 6', imageUrl: '/images/collection6.jpg' },
];

const Collections = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

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
      <div className={styles.grid}>
        {filteredCollections.map(({ id, title, imageUrl }) => (
          <div key={id} className={styles.card}>
            <img src={imageUrl} alt={title} className={styles.cardImage} />
            <h2 className={styles.cardTitle}>{title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;