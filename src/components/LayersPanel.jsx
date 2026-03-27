import { useState } from 'react';
import { useCanvas } from '../state/CanvasContext';
import { PALETTE } from '../widgets/widgetDefaults';
import styles from './LayersPanel.module.css';

const iconMap = {};
PALETTE.forEach((p) => {
  iconMap[p.type] = p.icon;
});

function truncate(text, max = 15) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '\u2026' : text;
}

export default function LayersPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { state, dispatch } = useCanvas();

  const reversedWidgets = [...state.widgets].reverse();

  return (
    <div className={styles.panel}>
      <div
        className={styles.header}
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className={styles.arrow}>{collapsed ? '\u25B6' : '\u25BC'}</span>
        Layers
      </div>

      {!collapsed && (
        <div className={styles.list}>
          {reversedWidgets.length === 0 && (
            <div className={styles.empty}>No layers</div>
          )}
          {reversedWidgets.map((widget) => {
            const isSelected = state.selection.includes(widget.id);
            return (
              <div
                key={widget.id}
                className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
                onClick={(e) => {
                  if (e.shiftKey) {
                    dispatch({ type: 'SELECT_ADD', id: widget.id });
                  } else {
                    dispatch({ type: 'SELECT', id: widget.id });
                  }
                }}
              >
                <span className={styles.icon}>
                  {iconMap[widget.type] || '?'}
                </span>
                <span className={styles.name}>
                  {truncate(widget.text || widget.type)}
                </span>
                <div className={styles.layerControls}>
                  <button
                    className={styles.layerBtn}
                    title="Move forward"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'MOVE_LAYER_UP', id: widget.id });
                    }}
                  >
                    {'\u2191'}
                  </button>
                  <button
                    className={styles.layerBtn}
                    title="Move backward"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'MOVE_LAYER_DOWN', id: widget.id });
                    }}
                  >
                    {'\u2193'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
