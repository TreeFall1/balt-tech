'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './ModalTemplate.module.scss';

export default function ModalTemplate({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if(isOpen){
      document.body.style.overflow = "hidden";
    } else return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // 🔥 Рендерим модалку прямо в <body>
  return createPortal(
      <div className={s.overlay} onClick={handleOverlayClick}>
        <div className={s.modal}>
          <div className={s.header}>
            <h3>{title}</h3>
            <button className={s.closeBtn} onClick={onClose}>✖</button>
          </div>
          <div className={s.content}>{children}</div>
        </div>
      </div>,
      document.body
  );
}
