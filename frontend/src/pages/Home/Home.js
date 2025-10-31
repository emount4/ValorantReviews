import React from 'react';
import './Home.css';  // импорт стилей

const Home = () => {
  return (
    <div className="home-container">
      <section className="intro-section">
        <h1>Оценка скинов Valorant</h1>
        <p className="intro-text">
          Изучите коллекции скинов, оценивайте их по 5 критериям и делитесь
          развернутыми рецензиями с сообществом. Найдите лучшие скины для своего арсенала.
        </p>
      </section>

      <section className="ratings-section">
        <h2>Критерии оценки</h2>
        <ul>
          <li>Внешний вид</li>
          <li>Эффекты</li>
          <li>Звуки</li>
          <li>Анимации</li>
          <li>Общее впечатление</li>
        </ul>
      </section>

      <section className="reviews-section">
        <h2>Последние отзывы</h2>
        <p>Пока нет отзывов, будьте первым!</p>
      </section>
    </div>
  );
};

export default Home;
