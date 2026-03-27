import React from 'react';
import styles from './widgets.module.css';

function ListWidget({ widget, onUpdate }) {
  const items = widget.items ?? ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const selectedIndex = widget.selectedIndex ?? 0;

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ selectedIndex: i });
          }}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            background: i === selectedIndex ? '#e8eeff' : 'transparent',
            fontWeight: i === selectedIndex ? 600 : 400,
            borderBottom: i < items.length - 1 ? '1px solid #eee' : 'none',
            color: '#333',
            transition: 'background .1s',
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default React.memo(ListWidget);
