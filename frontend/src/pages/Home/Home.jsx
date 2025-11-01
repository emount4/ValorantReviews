import React from 'react';
import styles from './Home.module.css';
import HorizontalScrollSection from '../../components/skins/HorizontalScrollSection/HorizontalScrollSection';

const Home = () => {
  return (
    <>
      <div className={styles.homeContainer}>
        <section className={styles.introSection}>
          <h1>Оценка скинов Valorant</h1>
          <p className={styles.introText}>
            Изучите коллекции скинов, оценивайте их по 5 критериям и делитесь
            развернутыми рецензиями с сообществом. Найдите лучшие скины для своего арсенала.
          </p>
        </section>
      </div>

      <div className={styles.homeContainer}>
        <section className={styles.scrollSection}>
          <h2 className={styles.sectionTitle}>Новые коллекции</h2>
          <HorizontalScrollSection type="new" />
        </section>
      </div>

      <div className={styles.homeContainer}>
        <section className={styles.scrollSection}>
          <h2 className={styles.sectionTitle}>Лучшие коллекции</h2>
          <HorizontalScrollSection type="top" />
        </section>
      </div>
    </>
  );
};

export default Home;