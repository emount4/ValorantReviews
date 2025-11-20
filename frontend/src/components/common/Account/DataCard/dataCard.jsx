import React from "react";
import styles from "./dataCard.module.css";
import { useAuth } from "../../../../context/AuthContext";

const DataCard = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const getInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.dataContainer}>
      {/* Первая карточка с аватаром */}
      <div className={`${styles.card} ${styles.cardWithAvatar}`}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>{getInitials(user.username)}</div>
        </div>
        <h2 className={styles.cardHeader}>{user.username}</h2>
        <p className={styles.registrationDate}>
          Дата регистрации {formatDate(user.created_at)}
        </p>
        <p className={styles.description}>
          Тут будет описание. Тут будет описание. Тут будет описание. Тут будет
          описание. Тут будет описание.
        </p>
      </div>

      {/* Вторая карточка без аватара */}
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>Уровень профиля</h2>
        <div className={styles.level}>
          <p>Баллов: здесь будут баллы сообщества</p>
        </div>
      </div>
    </div>
  );
};

export default DataCard;