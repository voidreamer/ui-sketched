import React from 'react';

function AvatarWidget({ widget }) {
  const text = widget.text ?? 'JD';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          background: '#e8eeff',
          border: '1.5px solid #888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 16,
          color: '#333',
          overflow: 'hidden',
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default React.memo(AvatarWidget);
