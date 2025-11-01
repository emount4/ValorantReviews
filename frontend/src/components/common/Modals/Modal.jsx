import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.modalCloseBtn} onClick={onClose}>×</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
