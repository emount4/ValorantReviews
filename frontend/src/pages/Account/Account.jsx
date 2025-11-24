import React, { useState } from "react";
import styles from "./Account.module.css";
import DataCard from "../../components/common/Account/DataCard/dataCard";
import Favorites from "../../components/common/Account/Favorites/favorites";
import Reviews from "../../components/common/Account/Reviews/Reviews";
import Likes from "../../components/common/Account/Likes/Likes";

const AccountPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState("favorites");

  if (!user) {
    return (
      <div className={styles.loginMessage}>
        <h2>Пожалуйста, войдите в систему</h2>
        <p>Чтобы увидеть страницу аккаунта, необходимо авторизоваться.</p>
        <p>
          <a href="/login">Войти</a> или{" "}
          <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "reviews":
        return <Reviews />;
      case "likes":
        return <Likes />;
      case "favorites":
      default:
        return <Favorites />;
    }
  };

  return (
    <div className={styles.accountContainer}>
      {/* Десктоп версия */}
      <div className={styles.desktopLayout}>
        <div className={styles.leftSection}>
          <DataCard />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.photoSection}>
            <div className={styles.photoPlaceholder}>
              <picture>
                <source 
                  srcSet="./images/Closed_Beta_Promo.webp" 
                  type="image/webp"
                />
                <source 
                  srcSet="./images/Closed_Beta_Promo.jpg" 
                  type="image/jpeg"
                />
                <img
                  src="./images/Closed_Beta_Promo.png"
                  alt="Фото профиля"
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
          
          {/* Панель кнопок */}
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span>Избранные коллекции</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <span>Рецензии и оценки</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'likes' ? styles.active : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              <span>Понравилось</span>
            </button>
          </div>

          <div className={styles.contentSection}>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className={styles.mobileLayout}>
        <div className={styles.photoSection}>
          <div className={styles.photoPlaceholder}>
            <picture>
              <source
                media="(min-width: 1200px)"
                srcSet="./images/Closed_Beta_Promo.png"
              />
              <source
                media="(max-width: 768px)"
                srcSet="./images/hero2.jpg"
              />
              <img
                src="./images/Closed_Beta_Promo.png"
                alt="Фото профиля"
              />
            </picture>
          </div>
        </div>

        <div className={styles.infoSection}>
          <DataCard />
        </div>
        
        {/* Панель кнопок для мобильной версии */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span>Избранное</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span>Рецензии</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'likes' ? styles.active : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <span>Лайки</span>
          </button>
        </div>
        
        <div className={styles.contentSection}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;