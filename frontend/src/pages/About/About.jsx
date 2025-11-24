
import React from "react";
import styles from "./About.module.css";
import telegramIcon from "../../../public/Telegram SVG Icon.svg";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      {/* Основное описание */}
      <section className={styles.introSection}>
        <h1 className={styles.mainTitle}>Оценка скинов Valorant - Valorant Reviews</h1>
        
        <div className={styles.aboutContent}>
          <p className={styles.aboutText}>
            Это первый подобный проект в моей жизни и реализовывается он в первую
            очередь в целях получения опыта подобного рода разработки.
          </p>

          <p className={styles.aboutText}>
            В общий, максимально широкий концепт веб-сайта входит задача реализовать
            систему по оцениванию коллекций скинов из игры компании Riot Games
            Valorant (в ходе разработки спектр задач может как расшириться, так и
            сузиться - все-таки это мой первый проект и разрабатываю я его один).
          </p>

          <p className={styles.aboutText}>
            Соответственно, на этом сайте можно будет создать аккаунт и ставить
            оценки/писать рецензии на скины. Исходя из рецензий, будут
            формироваться рейтинги коллекций и топы лучших.
          </p>

          <p className={styles.aboutText}>
            Система во многом вдохновлена проектом РЗТ, и унаследует от него 
            90-бальную систему (в дань уважения и в качестве отсылки), 
            переосмысленную в рамках концепта.
          </p>
        </div>
      </section>

      {/* Статистика */}
      <section className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>150+</span>
          <span className={styles.statLabel}>скинов для оценки</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>90</span>
          <span className={styles.statLabel}>балльная система</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>∞</span>
          <span className={styles.statLabel}>возможностей для творчества</span>
        </div>
      </section>

      {/* Основные возможности */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Основные возможности</h2>
        <ul className={styles.aboutList}>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>⭐</span>
            Система оценок скинов по 90-балльной шкале
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📝</span>
            Написание развернутых рецензий
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🏆</span>
            Рейтинги и топы коллекций
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>👤</span>
            Персональные профили пользователей
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            Детальная статистика и аналитика
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>💬</span>
            Сообщество единомышленников
          </li>
        </ul>
      </section>

      {/* Как это работает */}
      <section className={styles.previewSection}>
        <h2 className={styles.sectionTitle}>Как это работает?</h2>
        <div className={styles.previewGrid}>
          <div className={styles.previewItem}>
            <div className={styles.previewIcon}>1</div>
            <h3 className={styles.previewTitle}>Регистрируйтесь</h3>
            <p className={styles.previewText}>Создайте аккаунт и настройте профиль</p>
          </div>
          <div className={styles.previewItem}>
            <div className={styles.previewIcon}>2</div>
            <h3 className={styles.previewTitle}>Оценивайте</h3>
            <p className={styles.previewText}>Используйте 90-балльную систему оценок</p>
          </div>
          <div className={styles.previewItem}>
            <div className={styles.previewIcon}>3</div>
            <h3 className={styles.previewTitle}>Пишите рецензии</h3>
            <p className={styles.previewText}>Делитесь подробным мнением о скинах</p>
          </div>
          <div className={styles.previewItem}>
            <div className={styles.previewIcon}>4</div>
            <h3 className={styles.previewTitle}>Соревнуйтесь</h3>
            <p className={styles.previewText}>Поднимайтесь в топах рейтинга</p>
          </div>
        </div>
      </section>

      {/* Планы развития */}
      <section className={styles.roadmapSection}>
        <h2 className={styles.sectionTitle}>Планы развития</h2>
        <div className={styles.roadmapList}>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapStatus}>✅</span>
            <span className={styles.roadmapText}>Базовая система оценок</span>
          </div>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapStatus}>🔄</span>
            <span className={styles.roadmapText}>Система рейтингов пользователей</span>
          </div>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapStatus}>⏳</span>
            <span className={styles.roadmapText}>Мобильное приложение</span>
          </div>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapStatus}>⏳</span>
            <span className={styles.roadmapText}>Интеграция с трекерами статистики</span>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Присоединяйтесь к сообществу!</h2>
        <p className={styles.ctaText}>Начните оценивать скины и делиться своим мнением</p>
        <button className={styles.ctaButton}>Начать обзор</button>
      </section>

      {/* Контакты */}
      <section className={styles.telegramSection}>
        <div className={styles.contactInfo}>
          <h3 className={styles.contactTitle}>Свяжитесь с нами</h3>
          <p className={styles.contactText}>Есть вопросы или предложения? Пишите в Telegram!</p>
        </div>
        <a
          href="https://t.me/ValorantReviewProject"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.telegramButton}
          aria-label="Telegram"
        >
          <img
            src={telegramIcon}
            alt="Telegram"
            className={styles.telegramIcon}
          />
        </a>
      </section>
    </div>
  );
};

export default About;
