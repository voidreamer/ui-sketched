import React from 'react';
import InlineEdit from '../components/InlineEdit';

function LabelWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        color: '#444',
      }}
    >
      <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
    </div>
  );
}

export default React.memo(LabelWidget);
