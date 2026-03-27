import React from 'react';
import styles from './widgets.module.css';

function InputWidget({ widget, onUpdate }) {
  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
      }}
    >
      <input
        type="text"
        value={widget.text}
        placeholder={widget.placeholder}
        onChange={(e) => onUpdate({ text: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: '#333',
        }}
      />
    </div>
  );
}

export default React.memo(InputWidget);
