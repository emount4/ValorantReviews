import React, { useState, useEffect } from 'react'; 
import ReactDOM from 'react-dom';
import styles from '../Modal.module.css'; 
import { useAuth } from '../../../../context/AuthContext';
import { useScrollLock } from "../../../../hooks/useScrollLock";

const RegistrationModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(username, email, password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSwitchToLogin();
      }, 2000);
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
    
    setLoading(false);
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button 
          className={styles.modalCloseBtn} 
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          ×
        </button>

        <h2>Регистрация</h2>
        
        {success ? (
          <div className={styles.success}>
            Аккаунт успешно создан! Перенаправляем на страницу входа...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Отображаемое имя: 
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </label>
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
                minLength={8}
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
        
        <div className={styles.switchAuth}>
          Уже есть аккаунт?{' '}
          <button 
            type="button" 
            className={styles.switchButton}
            onClick={onSwitchToLogin}
          >
            Войти
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RegistrationModal;