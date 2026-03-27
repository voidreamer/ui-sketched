import React from 'react';

function DividerWidget() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 2,
          background: '#bbb',
          borderRadius: 1,
        }}
      />
    </div>
  );
}

export default React.memo(DividerWidget);
