import React from "react";
import styles from "./Account.module.css";
import DataCard from "../../components/common/Account/DataCard/dataCard";

const AccountPage = ({ user }) => {
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

  return (
    <div className={styles.accountContainer}>
      <div className={styles.leftSection}>
        <DataCard/>
      </div>
      <div className={styles.photoSection}>
        <div className={styles.photoPlaceholder}>
          <img src="../../../public/images/Closed_Beta_Promo.png" alt="Фото профиля" />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;