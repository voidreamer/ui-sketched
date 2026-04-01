import React, { useState } from 'react';
import styles from './widgets.module.css';

const DEFAULT_ITEMS = [
  { label: 'New', icon: '+' },
  { label: 'Open', icon: '\u{1F4C2}' },
  { label: 'Save', icon: '\u{1F4BE}' },
  { kind: 'separator' },
  { label: 'Cut', icon: '\u2702' },
  { label: 'Copy', icon: '\u{1F4CB}' },
  { label: 'Paste', icon: '\u{1F4CB}' },
  { kind: 'separator' },
  { label: 'Undo', icon: '\u21A9' },
  { label: 'Redo', icon: '\u21AA' },
];

function ToolbarWidget({ widget, onUpdate }) {
  const items = widget.items || DEFAULT_ITEMS;
  const showLabels = widget.showLabels !== false;
  const [hovered, setHovered] = useState(null);
  const [pressed, setPressed] = useState(null);

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        gap: 1,
        overflow: 'hidden',
        background: '#f4f4f4',
        borderBottom: '1.5px solid #999',
      }}
    >
      {items.map((item, i) => {
        if (item.kind === 'separator') {
          return (
            <div
              key={i}
              style={{
                width: 1,
                height: '60%',
                background: '#bbb',
                margin: '0 4px',
                flexShrink: 0,
              }}
            />
          );
        }

        const isHovered = hovered === i;
        const isPressed = pressed === i;

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => { setHovered(null); setPressed(null); }}
            onMouseDown={(e) => { e.stopPropagation(); setPressed(i); }}
            onMouseUp={() => setPressed(null)}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: showLabels ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: showLabels ? '2px 6px' : '4px 8px',
              borderRadius: 3,
              cursor: 'pointer',
              background: isPressed
                ? '#d0d8e8'
                : isHovered
                  ? '#e4e8f0'
                  : 'transparent',
              border: isHovered ? '1px solid #c0c8d8' : '1px solid transparent',
              transition: 'all .08s',
              userSelect: 'none',
              flexShrink: 0,
              minWidth: showLabels ? 36 : 28,
              gap: 1,
            }}
          >
            <span style={{ fontSize: showLabels ? 15 : 14, lineHeight: 1 }}>
              {item.icon || '\u25A1'}
            </span>
            {showLabels && (
              <span
                style={{
                  fontSize: 9,
                  color: '#555',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function serializeToolbar(items) {
  return (items || [])
    .map((item) => {
      if (item.kind === 'separator') return '---';
      return `${item.icon || ''} ${item.label || ''}`.trim();
    })
    .join('\n');
}

export function deserializeToolbar(text) {
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === '---' || trimmed === '-') return { kind: 'separator' };
      // First character might be an emoji/icon, rest is label
      const match = trimmed.match(/^(\S+)\s+(.+)$/);
      if (match) return { icon: match[1], label: match[2] };
      return { icon: '\u25A1', label: trimmed };
    });
}

export default React.memo(ToolbarWidget);
