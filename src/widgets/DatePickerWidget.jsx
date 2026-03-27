import React from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function DatePickerWidget({ widget, onUpdate }) {
  const date = widget.date ?? '2024-01-15';

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
      <span style={{ flexShrink: 0, whiteSpace: 'nowrap', color: '#555' }}>
        <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
      </span>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid #ccc',
          borderRadius: 3,
          padding: '3px 8px',
          background: '#fafafa',
        }}
      >
        <span style={{ color: '#333' }}>{date}</span>
        <span style={{ fontSize: 15, color: '#888', flexShrink: 0, marginLeft: 6 }}>
          &#128197;
        </span>
      </div>
    </div>
  );
}

export default React.memo(DatePickerWidget);
