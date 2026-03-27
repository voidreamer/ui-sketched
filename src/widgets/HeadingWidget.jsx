import React from 'react';
import InlineEdit from '../components/InlineEdit';

function HeadingWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        fontSize: 20,
        fontWeight: 700,
        color: '#222',
      }}
    >
      <InlineEdit
        value={widget.text}
        onChange={(t) => onUpdate({ text: t })}
        style={{ fontSize: 20, fontWeight: 700 }}
      />
    </div>
  );
}

export default React.memo(HeadingWidget);
