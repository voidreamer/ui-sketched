import React, { useState } from 'react';
import styles from './widgets.module.css';

function PasswordWidget({ widget }) {
  const [visible, setVisible] = useState(false);
  const value = widget.value ?? 'password123';
  const placeholder = widget.text ?? 'Password';
  const bullets = '\u25CF'.repeat(value.length);

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 6,
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden', color: value ? '#333' : '#aaa' }}>
        {value ? (visible ? value : bullets) : placeholder}
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setVisible((v) => !v);
        }}
        style={{
          cursor: 'pointer',
          fontSize: 15,
          color: '#888',
          flexShrink: 0,
          userSelect: 'none',
        }}
        title={visible ? 'Hide' : 'Show'}
      >
        {visible ? '🙈' : '👁'}
      </span>
    </div>
  );
}

export default React.memo(PasswordWidget);
