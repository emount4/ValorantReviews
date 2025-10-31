import React from 'react';
import ReactDOM from 'react-dom';
import '../Modal.css'; // или '../Modal.css' в зависимости от структуры папок

const RegistrationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onClose}>×</button> {/* Исправлено */}

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