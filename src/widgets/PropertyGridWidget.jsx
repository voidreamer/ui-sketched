import React, { useCallback } from 'react';
import styles from './widgets.module.css';

const DEFAULT_GROUPS = [
  {
    label: 'Appearance',
    expanded: true,
    properties: [
      { key: 'Background', value: '#ffffff', kind: 'color' },
      { key: 'Font Size', value: '14px', kind: 'text' },
      { key: 'Font Weight', value: 'Normal', kind: 'text' },
      { key: 'Visible', value: 'true', kind: 'bool' },
      { key: 'Opacity', value: '100%', kind: 'text' },
    ],
  },
  {
    label: 'Layout',
    expanded: true,
    properties: [
      { key: 'Width', value: '200', kind: 'text' },
      { key: 'Height', value: '100', kind: 'text' },
      { key: 'Alignment', value: 'Center', kind: 'text' },
      { key: 'Margin', value: '0 0 0 0', kind: 'text' },
    ],
  },
  {
    label: 'Behavior',
    expanded: false,
    properties: [
      { key: 'Enabled', value: 'true', kind: 'bool' },
      { key: 'Read Only', value: 'false', kind: 'bool' },
      { key: 'Tab Index', value: '0', kind: 'text' },
    ],
  },
];

function PropertyGridWidget({ widget, onUpdate }) {
  const groups = widget.groups || DEFAULT_GROUPS;

  const toggleGroup = useCallback(
    (gi, e) => {
      e.stopPropagation();
      const newGroups = groups.map((g, i) =>
        i === gi ? { ...g, expanded: !g.expanded } : g
      );
      onUpdate({ groups: newGroups });
    },
    [groups, onUpdate]
  );

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid #999',
          background: '#f0f0f0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '5px 8px',
            fontWeight: 700,
            fontSize: 11,
            color: '#444',
            borderRight: '1px solid #ccc',
          }}
        >
          Property
        </div>
        <div
          style={{
            flex: 1,
            padding: '5px 8px',
            fontWeight: 700,
            fontSize: 11,
            color: '#444',
          }}
        >
          Value
        </div>
      </div>

      {/* Groups */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {/* Group header */}
            <div
              onClick={(e) => toggleGroup(gi, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                background: '#e8e8e8',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: 700,
                fontSize: 11,
                color: '#333',
              }}
            >
              <span style={{ fontSize: 9, marginRight: 6, width: 10 }}>
                {group.expanded ? '▾' : '▸'}
              </span>
              {group.label}
            </div>

            {/* Properties */}
            {group.expanded &&
              (group.properties || []).map((prop, pi) => (
                <div
                  key={pi}
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #f0f0f0',
                    minHeight: 24,
                    alignItems: 'center',
                  }}
                >
                  {/* Key */}
                  <div
                    style={{
                      flex: 1,
                      padding: '3px 8px 3px 24px',
                      color: '#444',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      borderRight: '1px solid #e8e8e8',
                      fontSize: 11,
                    }}
                  >
                    {prop.key}
                  </div>

                  {/* Value */}
                  <div
                    style={{
                      flex: 1,
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                    }}
                  >
                    {prop.kind === 'color' && (
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 2,
                          border: '1px solid #aaa',
                          background: prop.value || '#fff',
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                    )}
                    {prop.kind === 'bool' && (
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 2,
                          border: '1.5px solid #888',
                          background:
                            prop.value === 'true' ? '#4f8cff' : '#fff',
                          flexShrink: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          color: '#fff',
                        }}
                      >
                        {prop.value === 'true' ? '\u2713' : ''}
                      </span>
                    )}
                    <span
                      style={{
                        color: prop.kind === 'color' ? '#666' : '#333',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {prop.value}
                    </span>
                  </div>
                </div>
              ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function serializePropertyGrid(groups) {
  const lines = [];
  (groups || []).forEach((g) => {
    lines.push(`[${g.label}]`);
    (g.properties || []).forEach((p) => {
      const kindSuffix = p.kind && p.kind !== 'text' ? ` (${p.kind})` : '';
      lines.push(`${p.key} = ${p.value}${kindSuffix}`);
    });
    lines.push('');
  });
  return lines.join('\n').trim();
}

export function deserializePropertyGrid(text) {
  const lines = text.split('\n');
  const groups = [];
  let currentGroup = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const groupMatch = trimmed.match(/^\[(.+)\]$/);
    if (groupMatch) {
      currentGroup = { label: groupMatch[1], expanded: true, properties: [] };
      groups.push(currentGroup);
      return;
    }

    const propMatch = trimmed.match(/^(.+?)\s*=\s*(.*)$/);
    if (propMatch && currentGroup) {
      let value = propMatch[2].trim();
      let kind = 'text';

      const kindMatch = value.match(/^(.*?)\s*\((color|bool)\)\s*$/);
      if (kindMatch) {
        value = kindMatch[1].trim();
        kind = kindMatch[2];
      } else if (value === 'true' || value === 'false') {
        kind = 'bool';
      } else if (/^#[0-9a-fA-F]{3,8}$/.test(value)) {
        kind = 'color';
      }

      currentGroup.properties.push({ key: propMatch[1].trim(), value, kind });
    }
  });

  return groups;
}

export default React.memo(PropertyGridWidget);
