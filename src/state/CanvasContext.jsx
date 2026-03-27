import React, { createContext, useContext, useEffect, useRef } from 'react';
import { canvasReducer, initialState } from './canvasReducer';
import { useHistoryReducer } from './history';
import { syncIdCounter } from '../utils/idGenerator';

const CanvasContext = createContext(null);

const STORAGE_KEY = 'ui-sketched-canvas';

export function CanvasProvider({ children }) {
  const [state, dispatch, { canUndo, canRedo, undo, redo }] = useHistoryReducer(
    canvasReducer,
    initialState
  );

  const loaded = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const widgets = JSON.parse(raw);
        if (Array.isArray(widgets) && widgets.length > 0) {
          syncIdCounter(widgets);
          dispatch({ type: 'LOAD_CANVAS', widgets });
        }
      }
    } catch (err) {
      console.error('Failed to load canvas from localStorage:', err);
    }
  }, [dispatch]);

  // Debounced autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.widgets));
      } catch (err) {
        console.error('Failed to save canvas to localStorage:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [state.widgets]);

  const value = { state, dispatch, undo, redo, canUndo, canRedo };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return ctx;
}
