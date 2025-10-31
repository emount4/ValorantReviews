import React from 'react';
import ReactDOM from 'react-dom';
import '../Modal.css'; // или '../Modal.css' в зависимости от структуры папок

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onClose}>×</button> {/* Исправлено */}
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