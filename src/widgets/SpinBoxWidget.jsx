import React from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function SpinBoxWidget({ widget, onUpdate }) {
  const value = widget.value ?? 0;
  const min = widget.min ?? 0;
  const max = widget.max ?? 100;
  const step = widget.step ?? 1;

  const increment = (e) => {
    e.stopPropagation();
    onUpdate({ value: Math.min(max, value + step) });
  };

  const decrement = (e) => {
    e.stopPropagation();
    onUpdate({ value: Math.max(min, value - step) });
  };

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 8,
      }}
    >
      <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
        <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
      </span>
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>
        {value}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
        <button
          onClick={increment}
          style={{
            border: '1px solid #888',
            borderRadius: 2,
            background: '#f7f8fa',
            cursor: 'pointer',
            fontSize: 10,
            lineHeight: 1,
            padding: '1px 6px',
            fontFamily: "'Courier New', monospace",
            color: '#333',
          }}
        >
          ▲
        </button>
        <button
          onClick={decrement}
          style={{
            border: '1px solid #888',
            borderRadius: 2,
            background: '#f7f8fa',
            cursor: 'pointer',
            fontSize: 10,
            lineHeight: 1,
            padding: '1px 6px',
            fontFamily: "'Courier New', monospace",
            color: '#333',
          }}
        >
          ▼
        </button>
      </div>
    </div>
  );
}

export default React.memo(SpinBoxWidget);
