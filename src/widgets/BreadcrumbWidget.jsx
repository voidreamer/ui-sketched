import React from 'react';

function BreadcrumbWidget({ widget }) {
  const items = widget.items ?? ['Home', 'Products', 'Detail'];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        color: '#555',
        gap: 6,
        padding: '0 8px',
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: '#aaa' }}>/</span>}
          <span
            onClick={(e) => e.stopPropagation()}
            style={{
              fontWeight: i === items.length - 1 ? 700 : 400,
              color: i === items.length - 1 ? '#333' : '#888',
              cursor: i < items.length - 1 ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default React.memo(BreadcrumbWidget);
