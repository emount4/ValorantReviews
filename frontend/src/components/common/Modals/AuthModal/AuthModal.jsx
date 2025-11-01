import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../Modal.module.css'; 

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.modalCloseBtn} onClick={onClose}>×</button> {/* Исправлено */}
        {/* Контент авторизации */}
        <h2>Авторизация</h2>
        <form>
          <label>Email: <input type="email" required /></label>
          <label>Пароль: <input type="password" required /></label>
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;