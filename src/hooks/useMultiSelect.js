import { useCallback } from 'react';
import { useCanvas } from '../state/CanvasContext';

export function useMultiSelect(canvasRef) {
  const { dispatch } = useCanvas();

  const startSelectionRect = useCallback(
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const startX = e.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
      const startY = e.clientY - rect.top + (canvasRef.current?.scrollTop || 0);

      const onMouseMove = (moveEvent) => {
        const currentX = moveEvent.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
        const currentY = moveEvent.clientY - rect.top + (canvasRef.current?.scrollTop || 0);

        const selectionRect = {
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          w: Math.abs(currentX - startX),
          h: Math.abs(currentY - startY),
        };

        dispatch({ type: 'SET_SELECTION_RECT', rect: selectionRect });
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        // Get the final rect from the last move event
        // We need to read it from state, but since dispatch is async,
        // we compute it one final time here
        const finalX = startX;
        const finalY = startY;

        // If we never moved, just deselect
        dispatch({ type: 'SET_SELECTION_RECT', rect: null });
      };

      // Attach a modified mouseup that captures the final rect
      const onMouseUpWithSelect = (upEvent) => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUpWithSelect);

        const endX = upEvent.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
        const endY = upEvent.clientY - rect.top + (canvasRef.current?.scrollTop || 0);

        const finalRect = {
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          w: Math.abs(endX - startX),
          h: Math.abs(endY - startY),
        };

        // Only select if the rect has some size (avoid accidental clicks)
        if (finalRect.w > 2 || finalRect.h > 2) {
          dispatch({ type: 'SELECT_RECT', rect: finalRect });
        } else {
          dispatch({ type: 'DESELECT_ALL' });
        }

        dispatch({ type: 'SET_SELECTION_RECT', rect: null });
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUpWithSelect);
    },
    [canvasRef, dispatch]
  );

  return startSelectionRect;
}
