import React from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function CardWidget({ widget, onUpdate }) {
  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 14,
        gap: 8,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          borderBottom: '1px solid #ddd',
          paddingBottom: 6,
        }}
      >
        <InlineEdit
          value={widget.text}
          onChange={(t) => onUpdate({ text: t })}
          style={{ fontWeight: 700, fontSize: 15 }}
        />
      </div>
      <div style={{ fontSize: 12, color: '#666', flex: 1 }}>
        <InlineEdit
          value={widget.body}
          onChange={(t) => onUpdate({ body: t })}
          multiline
          style={{ fontSize: 12, color: '#666' }}
        />
      </div>
    </div>
  );
}

export default React.memo(CardWidget);
