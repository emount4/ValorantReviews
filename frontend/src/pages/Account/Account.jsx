import React from 'react';
import styles from './Account.module.css';

const AccountPage = ({ user }) => {
  if (!user) {
    return (
      <div className={styles.loginMessage}>
        <h2>Пожалуйста, войдите в систему</h2>
        <p>Чтобы увидеть страницу аккаунта, необходимо авторизоваться.</p>
        <p>
          <a href="/login">Войти</a> или <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
    );
  }

  // Заглушка для статистики пользователя
  const userStats = {
    reviews: 12,
    collections: 5,
    rating: 4.8,
    joined: '2024'
  };

  return (
    <div className={styles.accountContainer}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Добро пожаловать, {user.name}!</h1>
        <p className={styles.userEmail}>Email: {user.email}</p>
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Ваша статистика</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.reviews}</div>
            <div className={styles.statLabel}>Рецензий написано</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.collections}</div>
            <div className={styles.statLabel}>Коллекций оценено</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.rating}</div>
            <div className={styles.statLabel}>Средний рейтинг</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.joined}</div>
            <div className={styles.statLabel}>Год регистрации</div>
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Действия с аккаунтом</h2>
        <p className={styles.sectionText}>
          Управляйте настройками профиля, просматривайте историю и настраивайте предпочтения.
        </p>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>
            Редактировать профиль
          </button>
          <button className={styles.actionButton}>
            Мои рецензии
          </button>
          <button className={styles.actionButton}>
            Настройки уведомлений
          </button>
          <button className={`${styles.actionButton} ${styles.secondary}`}>
            Сменить пароль
          </button>
        </div>
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Информация об аккаунте</h2>
        <p className={styles.sectionText}>
          Дата регистрации: 15 января 2024 года<br />
          Статус: Активный пользователь<br />
          Уровень: Опытный рецензент
        </p>
      </section>
    </div>
  );
};

export default AccountPage;