import { useCanvas } from '../state/CanvasContext';
import { PALETTE } from '../widgets/widgetDefaults';
import LayersPanel from './LayersPanel';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { state, dispatch } = useCanvas();
  const hasSelection = state.selection.length > 0;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>Components</div>

      <div className={styles.palette}>
        {PALETTE.map((p) => (
          <div
            key={p.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('widget-type', p.type)}
            className={styles.paletteItem}
          >
            <span className={styles.paletteIcon}>{p.icon}</span>
            {p.label}
          </div>
        ))}
      </div>

      {hasSelection && (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => dispatch({ type: 'DUPLICATE_SELECTED' })}
          >
            Duplicate ({'\u2318'}D)
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => dispatch({ type: 'DELETE_SELECTED' })}
          >
            Delete ({'\u232B'})
          </button>
        </div>
      )}

      <LayersPanel />
    </div>
  );
}
