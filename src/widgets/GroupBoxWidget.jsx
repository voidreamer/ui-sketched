import React from 'react';
import InlineEdit from '../components/InlineEdit';

function GroupBoxWidget({ widget, onUpdate }) {
  return (
    <fieldset
      style={{
        width: '100%',
        height: '100%',
        border: '1.5px solid #888',
        borderRadius: 4,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        color: '#333',
        margin: 0,
        padding: '8px 12px',
        boxSizing: 'border-box',
      }}
    >
      <legend
        style={{
          padding: '0 6px',
          fontSize: 12,
          fontWeight: 600,
          color: '#555',
        }}
      >
        <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
      </legend>
    </fieldset>
  );
}

export default React.memo(GroupBoxWidget);
