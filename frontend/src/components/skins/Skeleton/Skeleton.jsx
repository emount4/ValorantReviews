import React from 'react';
import styles from './Skeleton.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonBottomBar}>
          <div className={styles.skeletonRating}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;