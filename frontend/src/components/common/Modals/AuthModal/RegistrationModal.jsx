import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../Modal.module.css'; 

const RegistrationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.modalCloseBtn} onClick={onClose}>×</button> {/* Исправлено */}

        <h2>Регистрация</h2>
        <form>
          <label>Отображаемое имя: <input type="username" required /></label>
          <label>Email: <input type="email" required /></label>
          <label>Пароль: <input type="password" required /></label>
          <button type="submit">Зарегестрироваться</button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RegistrationModal;