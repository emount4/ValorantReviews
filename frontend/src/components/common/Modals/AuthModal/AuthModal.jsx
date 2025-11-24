import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '../Modal.module.css'; 
import { useAuth } from '../../../../context/AuthContext';
import { useScrollLock } from "../../../../hooks/useScrollLock";

const AuthModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Ошибка авторизации');
    }
    
    setLoading(false);
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.modalCloseBtn} onClick={onClose}>×</button>

        <h2>Авторизация</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email: 
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </label>
          <label>
            Пароль: 
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className={styles.switchAuth}>
          Нет аккаунта?{' '}
          <button 
            type="button" 
            className={styles.switchButton}
            onClick={onSwitchToRegister}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;