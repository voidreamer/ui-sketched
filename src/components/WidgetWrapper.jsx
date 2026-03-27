import React, { useCallback } from 'react';
import { useCanvas } from '../state/CanvasContext';
import { widgetRegistry } from '../widgets/index';
import styles from './WidgetWrapper.module.css';

function ResizeHandle({ widget, dispatch }) {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.w;
    const startH = widget.h;

    const onMove = (e2) => {
      dispatch({
        type: 'UPDATE_WIDGET',
        id: widget.id,
        patch: {
          w: Math.max(40, startW + (e2.clientX - startX)),
          h: Math.max(20, startH + (e2.clientY - startY)),
        },
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className={styles.resizeHandle}
      onMouseDown={handleMouseDown}
    />
  );
}

function WidgetWrapper({ widget, zIndex, startDrag }) {
  const { state, dispatch } = useCanvas();
  const isSelected = state.selection.includes(widget.id);

  const onUpdate = useCallback(
    (patch) => dispatch({ type: 'UPDATE_WIDGET', id: widget.id, patch }),
    [dispatch, widget.id]
  );

  const handleMouseDown = (e) => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.stopPropagation();

    if (e.shiftKey) {
      dispatch({ type: 'SELECT_ADD', id: widget.id });
    } else if (e.metaKey || e.ctrlKey) {
      dispatch({ type: 'SELECT_TOGGLE', id: widget.id });
    } else {
      dispatch({ type: 'SELECT', id: widget.id });
    }

    startDrag(e, widget.id);
  };

  const WidgetComponent = widgetRegistry[widget.type];

  return (
    <div
      className={styles.wrapper}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.w,
        height: widget.h,
        zIndex,
        boxShadow: isSelected ? '0 0 0 2px #4f8cff' : 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {WidgetComponent ? (
        <WidgetComponent widget={widget} onUpdate={onUpdate} />
      ) : (
        <div>{widget.text}</div>
      )}
      {isSelected && <ResizeHandle widget={widget} dispatch={dispatch} />}
    </div>
  );
}

export default React.memo(WidgetWrapper);
