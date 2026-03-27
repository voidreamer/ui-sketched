import React from 'react';
import InlineEdit from '../components/InlineEdit';

function ToggleWidget({ widget, onUpdate }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          border: '1.5px solid #888',
          background: widget.on ? '#4f8cff' : '#ddd',
          position: 'relative',
          transition: 'background .2s',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onUpdate({ on: !widget.on });
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #888',
            position: 'absolute',
            top: 2,
            left: widget.on ? 20 : 2,
            transition: 'left .2s',
          }}
        />
      </div>
      <InlineEdit value={widget.text} onChange={(t) => onUpdate({ text: t })} />
    </div>
  );
}

export default React.memo(ToggleWidget);
