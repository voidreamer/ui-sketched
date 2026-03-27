import React from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function ProgressBarWidget({ widget, onUpdate }) {
  const value = Math.max(0, Math.min(100, widget.value ?? 50));

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 10,
      }}
    >
      <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
        <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
      </span>
      <div
        style={{
          flex: 1,
          height: 14,
          background: '#ddd',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: '#4f8cff',
            borderRadius: 3,
            transition: 'width .15s',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: '#555', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {value}%
      </span>
    </div>
  );
}

export default React.memo(ProgressBarWidget);
