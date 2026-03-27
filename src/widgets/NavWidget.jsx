import React from 'react';
import InlineEdit from '../components/InlineEdit';
import styles from './widgets.module.css';

function NavWidget({ widget, onUpdate }) {
  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 24,
        background: '#f7f8fa',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 15 }}>
        <InlineEdit
          value={widget.text}
          onChange={(t) => onUpdate({ text: t })}
          style={{ fontWeight: 700, fontSize: 15 }}
        />
      </span>
      <div style={{ flex: 1 }} />
      {widget.links.map((link, i) => (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ activeLink: i });
          }}
          style={{
            fontSize: 13,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 3,
            color: i === widget.activeLink ? '#4f8cff' : '#555',
            fontWeight: i === widget.activeLink ? 700 : 400,
            background: i === widget.activeLink ? '#e8eeff' : 'transparent',
            transition: 'all .15s',
          }}
        >
          {link}
        </span>
      ))}
    </div>
  );
}

export default React.memo(NavWidget);
