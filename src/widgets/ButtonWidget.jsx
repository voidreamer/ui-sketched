import React, { useState } from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function ButtonWidget({ widget, onUpdate }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        background: pressed ? '#c8d8ff' : widget.variant === 'primary' ? '#e8eeff' : '#fff',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'all .1s',
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
      }}
    >
      <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
    </div>
  );
}

export default React.memo(ButtonWidget);
