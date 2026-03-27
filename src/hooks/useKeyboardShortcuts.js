import { useEffect } from 'react';
import { useCanvas } from '../state/CanvasContext';

export function useKeyboardShortcuts() {
  const { state, dispatch, undo, redo } = useCanvas();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing in form fields
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Cmd+Z / Ctrl+Z (without Shift)
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Cmd+Shift+Z / Ctrl+Shift+Z
      if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
        return;
      }

      // Duplicate: Cmd+D / Ctrl+D
      if (isMod && e.key === 'd') {
        e.preventDefault();
        if (state.selection.length > 0) {
          dispatch({ type: 'DUPLICATE_SELECTED' });
        }
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selection.length > 0) {
          e.preventDefault();
          dispatch({ type: 'DELETE_SELECTED' });
        }
        return;
      }

      // Escape: deselect
      if (e.key === 'Escape') {
        dispatch({ type: 'DESELECT_ALL' });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selection, dispatch, undo, redo]);
}
