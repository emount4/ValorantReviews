// hooks/useScrollLock.js
import { useEffect } from 'react';

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      // Простой и эффективный способ
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};