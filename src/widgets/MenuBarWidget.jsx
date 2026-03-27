import React from 'react';
import styles from './widgets.module.css';

function MenuBarWidget({ widget }) {
  const menus = widget.menus ?? ['File', 'Edit', 'View', 'Help'];

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        background: '#f7f8fa',
        gap: 0,
      }}
    >
      {menus.map((menu, i) => (
        <span
          key={i}
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '4px 12px',
            cursor: 'pointer',
            color: '#333',
            borderRadius: 2,
            transition: 'background .1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e8eeff')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {menu}
        </span>
      ))}
    </div>
  );
}

export default React.memo(MenuBarWidget);
