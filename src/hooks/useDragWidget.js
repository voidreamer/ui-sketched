import { useCallback, useRef } from 'react';
import { useCanvas } from '../state/CanvasContext';
import { snapToGrid, computeAlignmentGuides } from '../utils/geometry';

export function useDragWidget(canvasRef) {
  const { state, dispatch } = useCanvas();
  const stateRef = useRef(state);
  stateRef.current = state;

  const startDrag = useCallback(
    (e, widgetId) => {
      const currentState = stateRef.current;
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      // Determine which widgets are being dragged
      const isInSelection = currentState.selection.includes(widgetId);
      const dragIds = isInSelection && currentState.selection.length > 0
        ? [...currentState.selection]
        : [widgetId];

      // Compute offsets: distance from mouse to each widget's position
      const offsets = {};
      for (const id of dragIds) {
        const widget = currentState.widgets.find((w) => w.id === id);
        if (widget) {
          offsets[id] = {
            dx: e.clientX - canvasRect.left - widget.x,
            dy: e.clientY - canvasRect.top - widget.y,
          };
        }
      }

      dispatch({ type: 'DRAG_START', widgetIds: dragIds, offsets });

      // Track final positions so we can dispatch UPDATE_WIDGETS on mouseup
      let finalPositions = null;

      const onMouseMove = (moveEvent) => {
        const currentWidgets = stateRef.current.widgets;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = moveEvent.clientX - rect.left;
        const mouseY = moveEvent.clientY - rect.top;

        // Compute raw positions for all dragged widgets
        const rawPositions = dragIds.map((id) => {
          const off = offsets[id];
          return {
            id,
            x: mouseX - off.dx,
            y: mouseY - off.dy,
          };
        });

        // Apply snap-to-grid on the first widget, then offset the rest
        const primary = rawPositions[0];
        const primaryWidget = currentWidgets.find((w) => w.id === primary.id);
        if (!primaryWidget) return;

        const snappedPrimaryX = snapToGrid(primary.x);
        const snappedPrimaryY = snapToGrid(primary.y);

        // Compute alignment guides using the primary widget's bounding rect
        const movingRect = {
          x: snappedPrimaryX,
          y: snappedPrimaryY,
          w: primaryWidget.w,
          h: primaryWidget.h,
        };

        const dragIdSet = new Set(dragIds);
        const otherRects = currentWidgets
          .filter((w) => !dragIdSet.has(w.id))
          .map((w) => ({ x: w.x, y: w.y, w: w.w, h: w.h }));

        const { snappedX, snappedY, guides } = computeAlignmentGuides(
          movingRect,
          otherRects
        );

        // Compute delta from primary's raw position to snapped position
        const deltaX = snappedX - primary.x;
        const deltaY = snappedY - primary.y;

        const positions = rawPositions.map((pos) => ({
          id: pos.id,
          x: Math.round(pos.x + deltaX),
          y: Math.round(pos.y + deltaY),
        }));

        finalPositions = positions;

        dispatch({ type: 'DRAG_MOVE', positions });
        dispatch({ type: 'SET_SNAP_GUIDES', guides });
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        dispatch({ type: 'DRAG_END' });
        dispatch({ type: 'CLEAR_TRANSIENT' });

        // Commit the final positions as an undoable action
        if (finalPositions) {
          const updates = finalPositions.map((pos) => ({
            id: pos.id,
            patch: { x: pos.x, y: pos.y },
          }));
          dispatch({ type: 'UPDATE_WIDGETS', updates });
        }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [canvasRef, dispatch]
  );

  return startDrag;
}
