import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
