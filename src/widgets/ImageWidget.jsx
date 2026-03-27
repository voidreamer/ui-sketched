import React from 'react';
import styles from './widgets.module.css';

function ImageWidget({ widget }) {
  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f4',
        color: '#999',
        overflow: 'hidden',
      }}
    >
      <span style={{ fontSize: 28 }}>{'\u{1F5BC}'}</span>
      <span style={{ fontSize: 11, marginTop: 4 }}>
        {widget.w}x{widget.h}
      </span>
    </div>
  );
}

export default React.memo(ImageWidget);
