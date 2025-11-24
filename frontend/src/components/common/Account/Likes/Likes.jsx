import React from "react";
import styles from "./Likes.module.css";

const Likes = () => {
  // Заглушка данных
  const mockLikedReviews = [
    {
      id: 1,
      title: "Отличный разбор коллекции",
      text: "Очень подробный и качественный анализ всех аспектов коллекции...",
      score: 88,
      collection: {
        name: "Коллекция 'Омега'",
        image: "https://media.valorant-api.com/bundles/afa6651a-4b93-b7f8-b136-b6b081fc3258/displayicon.png"
      },
      author: "Аbobik322",
      date: "20.12.2023",
      likedAt: "21.12.2023"
    },
    {
      id: 2,
      title: "Интересные замечания",
      text: "Автор подметил много важных деталей, которые я упустил...",
      score: 76,
      collection: {
        name: "Коллекция 'Неон'",
        image: "https://media.valorant-api.com/bundles/2ed936df-4959-acc7-9aca-358d34a50619/displayicon.png"
      },
      author: "alena822",
      date: "18.12.2023",
      likedAt: "19.12.2023"
    }
  ];

  return (
    <div className={styles.likesContainer}>
      
      {mockLikedReviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Вы еще не поставили ни одного лайка</p>
        </div>
      ) : (
        <div className={styles.likesList}>
          {mockLikedReviews.map(review => (
            <div key={review.id} className={styles.likedReviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.collectionInfo}>
                  <img 
                    src={review.collection.image} 
                    alt={review.collection.name}
                    className={styles.collectionImage}
                  />
                  <div className={styles.collectionDetails}>
                    <h3 className={styles.collectionName}>{review.collection.name}</h3>
                    <span className={styles.reviewDate}>
                      Рецензия от {review.date} • Лайк поставлен {review.likedAt}
                    </span>
                  </div>
                </div>
                <div className={styles.scoreBadge}>
                  <span className={styles.score}>{review.score}</span>
                  <span className={styles.scoreTotal}>/90</span>
                </div>
              </div>
              
              <div className={styles.reviewContent}>
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <p className={styles.reviewText}>{review.text}</p>
              </div>
              
              <div className={styles.reviewFooter}>
                <span className={styles.author}>Автор: {review.author}</span>
                <span className={styles.likeIndicator}>❤️ Ваш лайк</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Likes;