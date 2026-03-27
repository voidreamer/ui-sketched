import React from 'react';

const VARIANT_COLORS = {
  default: { bg: '#e8eeff', color: '#333' },
  success: { bg: '#d4edda', color: '#155724' },
  warning: { bg: '#fff3cd', color: '#856404' },
  error: { bg: '#f8d7da', color: '#721c24' },
};

function BadgeWidget({ widget }) {
  const text = widget.text ?? 'Badge';
  const variant = widget.variant ?? 'default';
  const colors = VARIANT_COLORS[variant] ?? VARIANT_COLORS.default;

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
      <span
        style={{
          display: 'inline-block',
          padding: '3px 12px',
          borderRadius: 999,
          background: colors.bg,
          color: colors.color,
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          border: '1px solid ' + colors.color + '33',
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default React.memo(BadgeWidget);
