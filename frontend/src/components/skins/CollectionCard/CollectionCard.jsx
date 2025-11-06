import React from 'react';
import styles from './CollectionCard.module.css';

const CollectionCard = ({ title, imageUrl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageBox}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <div className={styles.bottomBar}>
          <div className={styles.ratingBox}>4.5</div>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
