import React from 'react';
import InlineEdit from '../components/InlineEdit';

function RadioWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        padding: '6px 0',
      }}
    >
      <span style={{ fontWeight: 600, marginBottom: 2 }}>
        <InlineEdit
          value={widget.text}
          onChange={(t) => onUpdate({ text: t })}
          style={{ fontWeight: 600 }}
        />
      </span>
      {widget.options.map((opt, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ selected: i });
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              border: '1.5px solid #888',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              transition: 'all .15s',
            }}
          >
            {i === widget.selected ? (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4f8cff',
                }}
              />
            ) : null}
          </span>
          {opt}
        </div>
      ))}
    </div>
  );
}

export default React.memo(RadioWidget);
