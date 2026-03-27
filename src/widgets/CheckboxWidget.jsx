import React from 'react';
import InlineEdit from '../components/InlineEdit';

function CheckboxWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onUpdate({ checked: !widget.checked });
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          border: '1.5px solid #888',
          borderRadius: 3,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: widget.checked ? '#e8eeff' : '#fff',
          fontSize: 12,
          transition: 'background .15s',
        }}
      >
        {widget.checked ? '\u2713' : ''}
      </span>
      <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
    </div>
  );
}

export default React.memo(CheckboxWidget);
