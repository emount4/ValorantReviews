
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CircularCollectionCard.module.css';

const CircularCollectionCard = ({ title, imageUrl, id }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageQuality, setImageQuality] = useState('standard');

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

    const handleImageLoad = (e) => {
        setImageLoading(false);
        setImageError(false);
        
        const img = e.target;
        if (img.naturalWidth >= 200 && img.naturalHeight >= 200) {
            setImageQuality('highQuality');
        }
    };

    const getOptimizedImageUrl = () => {
        if (imageError || !imageUrl) {
            return "/placeholder-collection.jpg";
        }
        
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        return imageUrl;
    };

    return (
        <div className={styles.cardContainer} onClick={handleCardClick}>
            <div className={styles.card}>
                <div className={styles.imageBox}>
                    {imageLoading && (
                        <div className={styles.imageLoading}>Загрузка...</div>
                    )}
                    <img 
                        src={getOptimizedImageUrl()} 
                        alt={title} 
                        className={`${styles.image} ${imageQuality === 'highQuality' ? styles.highQuality : ''} ${imageLoading ? styles.hidden : ''}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="lazy"
                        decoding="async"
                        width="100"
                        height="100"
                    />
                </div>
            </div>
            <div className={styles.title}>{title}</div>
        </div>
    );
};

export default CircularCollectionCard;
