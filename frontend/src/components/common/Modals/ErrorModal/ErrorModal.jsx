import React from "react";
import styles from "./ErrorModal.module.css";

const ErrorModal = ({ isOpen, onClose, title, message, type = "error" }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.modalHeader} ${styles[type]}`}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.okButton} onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;