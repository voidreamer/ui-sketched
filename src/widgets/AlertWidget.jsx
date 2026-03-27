import React from 'react';

const VARIANT_MAP = {
  info: { bg: '#e8eeff', border: '#b8cfff', color: '#333', icon: '\u2139' },
  success: { bg: '#d4edda', border: '#a3d5b1', color: '#155724', icon: '\u2713' },
  warning: { bg: '#fff3cd', border: '#ffe08a', color: '#856404', icon: '\u26A0' },
  error: { bg: '#f8d7da', border: '#f1aeb5', color: '#721c24', icon: '\u2715' },
};

function AlertWidget({ widget }) {
  const text = widget.text ?? 'This is an alert message';
  const variant = widget.variant ?? 'info';
  const v = VARIANT_MAP[variant] ?? VARIANT_MAP.info;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px',
        gap: 10,
        background: v.bg,
        border: '1.5px solid ' + v.border,
        borderRadius: 4,
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        color: v.color,
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{v.icon}</span>
      <span style={{ flex: 1 }}>{text}</span>
    </div>
  );
}

export default React.memo(AlertWidget);
