import React from 'react';
import styles from './SkinCard.module.css';

const SkinCard = ({ skin, onRate }) => {
  const {
    id,
    name,
    weapon,
    rarity,
    image,
    rating,
    price,
    collection
  } = skin;

  const getRarityClass = (rarity) => {
    const rarityClasses = {
      select: styles.select,
      deluxe: styles.deluxe,
      premium: styles.premium,
      ultra: styles.ultra
    };
    return rarityClasses[rarity] || '';
  };

  const renderRatingStars = (rating) => {
    const starRating = rating / 18;
    const fullStars = Math.floor(starRating);
    const halfStar = starRating % 1 >= 0.5;

    return (
      <div className={styles.ratingStars}>
        {'★'.repeat(fullStars)}
        {halfStar && '☆'}
        {'★'.repeat(5 - fullStars - (halfStar ? 1 : 0))}
      </div>
    );
  };

  return (
    <div className={styles.skinCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
        <div className={styles.ratingBadge}>
          <span>★</span>
          {rating}/90
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>

        <div className={styles.meta}>
          <span className={styles.weapon}>{weapon}</span>
          <span className={`${styles.rarity} ${getRarityClass(rarity)}`}>
            {rarity}
          </span>
        </div>

        <div className={styles.rating}>
          {renderRatingStars(rating)}
          <span className={styles.ratingValue}>{rating}%</span>
        </div>

        <div className={styles.quickRating}>
          <button
            className={styles.rateButton}
            onClick={() => onRate(id)}
          >
            Оценить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCard;