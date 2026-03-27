import React from 'react';
import styles from './widgets.module.css';

function TextareaWidget({ widget, onUpdate }) {
  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <textarea
        value={widget.text}
        placeholder={widget.placeholder}
        onChange={(e) => onUpdate({ text: e.target.value })}
        onClick={(e) => e.stopPropagation()}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          height: '100%',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: '#333',
          resize: 'none',
          padding: '8px 10px',
        }}
      />
    </div>
  );
}

export default React.memo(TextareaWidget);
