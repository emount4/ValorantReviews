import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CollectionCard.module.css';

const CollectionCard = ({ title, imageUrl, id }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleCardClick = () => {
        navigate(`/reviews/${id}`, { 
            state: { 
                collectionData: { 
                    id, 
                    display_name: title, 
                    image_url: imageUrl 
                } 
            } 
        });
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const getImageUrl = () => {
        if (imageError || !imageUrl) {
            return "/placeholder-collection.jpg";
        }
        return imageUrl;
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.imageBox}>
                {imageLoading && (
                    <div className={styles.imageLoading}>Загрузка...</div>
                )}
                <img 
                    src={getImageUrl()} 
                    alt={title} 
                    className={`${styles.image} ${imageLoading ? styles.hidden : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className={styles.bottomBar}>
                    <div className={styles.ratingBox}>4.5</div>
                    <div className={styles.title}>{title}</div>
                </div>
            </div>
        </div>
    );
};

export default CollectionCard;