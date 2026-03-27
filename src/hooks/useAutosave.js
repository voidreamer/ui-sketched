import { useEffect } from 'react';

const STORAGE_KEY = 'ui-sketched-canvas';

export function useAutosave(widgets) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
      } catch (err) {
        console.error('Failed to autosave to localStorage:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [widgets]);
}
