
import React from "react";
import styles from "./UserStats.module.css";

const UserStats = ({ user }) => {
  const userStats = {
    reviewsCount: 24,
    ratingsWithoutReview: 156,
    likesReceived: 89,
    likesGiven: 156
  };

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.statsTitle}>Статистика</h3>
      
      <div className={styles.statsList}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Рецензий:</span>
          <span className={styles.statValue}>{userStats.reviewsCount}</span>
        </div>
        
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Оценок без рецензии:</span>
          <span className={styles.statValue}>{userStats.ratingsWithoutReview}</span>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Лайков получено:</span>
          <span className={styles.statValue}>{userStats.likesReceived}</span>
        </div>
        
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Лайков поставлено:</span>
          <span className={styles.statValue}>{userStats.likesGiven}</span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
