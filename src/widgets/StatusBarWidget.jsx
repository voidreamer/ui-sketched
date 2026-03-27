import React from 'react';
import styles from './widgets.module.css';

function StatusBarWidget({ widget }) {
  const text = widget.text ?? 'Ready';
  const items = widget.items ?? ['Ln 1', 'Col 1', 'UTF-8'];

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        background: '#f7f8fa',
        fontSize: 11,
        gap: 0,
      }}
    >
      <span style={{ flex: 1, color: '#555' }}>{text}</span>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span
            style={{
              width: 1,
              height: '60%',
              background: '#ccc',
              margin: '0 8px',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#666', whiteSpace: 'nowrap' }}>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default React.memo(StatusBarWidget);
