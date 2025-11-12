import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CollectionCard.module.css';

const CollectionCard = ({ title, imageUrl, id }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/reviews/${id}`)
    }
  
    return (
    <div className={styles.card} onClick={handleCardClick}>
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
