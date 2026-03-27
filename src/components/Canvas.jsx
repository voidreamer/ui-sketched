import { useRef } from 'react';
import { useCanvas } from '../state/CanvasContext';
import { createWidget } from '../widgets/widgetDefaults';
import { useDragWidget } from '../hooks/useDragWidget';
import { useMultiSelect } from '../hooks/useMultiSelect';
import WidgetWrapper from './WidgetWrapper';
import AlignmentGuides from './AlignmentGuides';
import styles from './Canvas.module.css';

export default function Canvas() {
  const canvasRef = useRef(null);
  const { state, dispatch } = useCanvas();
  const startDrag = useDragWidget(canvasRef);
  const startSelectionRect = useMultiSelect(canvasRef);

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('widget-type');
    if (!type) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 20;
    const widget = createWidget(type, Math.max(0, x), Math.max(0, y));
    dispatch({ type: 'ADD_WIDGET', widget });
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.dataset.canvas) {
      dispatch({ type: 'DESELECT_ALL' });
    }
  };

  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.dataset.canvas) {
      startSelectionRect(e);
    }
  };

  return (
    <div
      ref={canvasRef}
      data-canvas="true"
      className={styles.canvas}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {state.widgets.map((widget, index) => (
        <WidgetWrapper
          key={widget.id}
          widget={widget}
          zIndex={index}
          startDrag={startDrag}
        />
      ))}

      <AlignmentGuides />

      {state.selectionRect && (
        <div
          className={styles.selectionRect}
          style={{
            left: state.selectionRect.x,
            top: state.selectionRect.y,
            width: state.selectionRect.w,
            height: state.selectionRect.h,
          }}
        />
      )}

      {state.widgets.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>{'\u229E'}</div>
          Drag components from the sidebar
          <br />
          onto this canvas
        </div>
      )}
    </div>
  );
}
