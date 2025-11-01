import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <section className={styles.introSection}>
        <h1>Оценка скинов Valorant - Valorant Reviews</h1>
      </section>

      <section className={styles.introSection}>
        <p className={styles.aboutText}>
          Это первый подобный проект в моей жизни и реализовывается он в первую очередь в целях получения опыта подобного рода разработки.
          В общий, максимально широкий концепт веб-сайта входит задача реализовать систему по оцениванию коллекций скинов из игры компании Riot Games Valorant (в ходе разработки спектр задач может как расшириться, так и сузиться - все-таки это мой первый проект и разрабатываю я его один). Соответственно, на этом сайте можно будет создать аккаунт и ставить оценки/писать рецензии на скины. Исходя из рецензий, будут формироваться рейтинги коллекций и топы лучших. Система во многом вдохновлена проектом РЗТ, и унаследует от него 90-бальную систему (в дань уважения и в качестве отсылки), переосмысленную в рамках концепта. 
        </p>
      </section>

      {/* Дополнительная секция с фичами (опционально) */}
      <section className={styles.introSection}>
        <h2>Основные возможности:</h2>
        <ul className={styles.aboutList}>
          <li className={styles.featureItem}>Система оценок скинов по 90-балльной шкале</li>
          <li className={styles.featureItem}>Написание развернутых рецензий</li>
          <li className={styles.featureItem}>Рейтинги и топы коллекций</li>
          <li className={styles.featureItem}>Персональные профили пользователей</li>
        </ul>
      </section>
    </div>
  );
};

export default About;