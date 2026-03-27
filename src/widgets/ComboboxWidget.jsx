import React from 'react';
import styles from './widgets.module.css';

function ComboboxWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: widget.open ? 100 : 'auto',
      }}
    >
      <div
        className={styles.wireBase}
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onUpdate({ open: !widget.open });
        }}
      >
        <span>{widget.text}</span>
        <span
          style={{
            fontSize: 16,
            color: '#666',
            transform: widget.open ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
          }}
        >
          ▾
        </span>
      </div>
      {widget.open && (
        <div
          className={styles.wireBase}
          style={{
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            position: 'absolute',
            width: '100%',
            background: '#fff',
            zIndex: 10,
          }}
        >
          {widget.options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                fontSize: 13,
                background: widget.text === opt ? '#e8eeff' : 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f4ff')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  widget.text === opt ? '#e8eeff' : 'transparent')
              }
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ text: opt, open: false });
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(ComboboxWidget);
