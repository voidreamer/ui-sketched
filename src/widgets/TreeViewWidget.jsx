import React, { useCallback } from 'react';
import styles from './widgets.module.css';

const DEFAULT_NODES = [
  {
    label: 'Application', expanded: true, values: ['v1.0', 'Root'],
    children: [
      {
        label: 'Components', expanded: true, values: ['', 'Group'],
        children: [
          { label: 'Header', values: ['active', 'Widget'], children: [] },
          { label: 'Sidebar', values: ['active', 'Widget'], children: [] },
          { label: 'Footer', values: ['hidden', 'Widget'], children: [] },
        ],
      },
      {
        label: 'Settings', expanded: false, values: ['', 'Group'],
        children: [
          { label: 'Theme', values: ['dark', 'String'], children: [] },
          { label: 'Language', values: ['en', 'String'], children: [] },
        ],
      },
    ],
  },
];

function flattenVisible(nodes, depth = 0, parentPath = '') {
  const rows = [];
  (nodes || []).forEach((node, i) => {
    const path = parentPath ? `${parentPath}.${i}` : `${i}`;
    const hasChildren = node.children && node.children.length > 0;
    rows.push({ ...node, depth, path, hasChildren });
    if (node.expanded && hasChildren) {
      rows.push(...flattenVisible(node.children, depth + 1, path));
    }
  });
  return rows;
}

function updateAtPath(nodes, path, updater) {
  const parts = path.split('.').map(Number);
  const clone = JSON.parse(JSON.stringify(nodes));
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]].children;
  }
  cur[parts[parts.length - 1]] = updater(cur[parts[parts.length - 1]]);
  return clone;
}

function removeAtPath(nodes, path) {
  const parts = path.split('.').map(Number);
  const clone = JSON.parse(JSON.stringify(nodes));
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]].children;
  }
  cur.splice(parts[parts.length - 1], 1);
  return clone;
}

function getNodeAtPath(nodes, path) {
  if (!path || !nodes) return null;
  const parts = path.split('.').map(Number);
  let cur = nodes;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]] || !cur[parts[i]].children) return null;
    cur = cur[parts[i]].children;
  }
  return cur[parts[parts.length - 1]] || null;
}

function addChildAtPath(nodes, path) {
  const clone = JSON.parse(JSON.stringify(nodes));
  if (path === null) {
    clone.push({ label: 'New Item', values: [], children: [], expanded: false });
    return clone;
  }
  const parts = path.split('.').map(Number);
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]].children;
  }
  const target = cur[parts[parts.length - 1]];
  if (!target.children) target.children = [];
  target.children.push({ label: 'New Item', values: [], children: [], expanded: false });
  target.expanded = true;
  return clone;
}

const INDENT = 18;
const ROW_H = 24;

function TreeViewWidget({ widget, onUpdate }) {
  // Support dataSets: if activeDataSet is set and dataSets has it, use that
  const dataSets = widget.dataSets;
  const activeDataSet = widget.activeDataSet;
  const nodes = (dataSets && activeDataSet && dataSets[activeDataSet]) || widget.nodes || DEFAULT_NODES;
  const columns = widget.columns || ['Name', 'Value', 'Type'];
  const showCheckboxes = !!widget.showCheckboxes;
  const selectedPath = widget.selectedPath;

  // When dataSets are active, updating nodes must also sync the active dataSet
  const updateNodes = useCallback((newNodes) => {
    const patch = { nodes: newNodes };
    if (dataSets && activeDataSet) {
      patch.dataSets = { ...dataSets, [activeDataSet]: newNodes };
    }
    onUpdate(patch);
  }, [dataSets, activeDataSet, onUpdate]);

  const visibleRows = flattenVisible(nodes);
  const hasExtra = columns.length > 1;

  const toggle = useCallback((path, e) => {
    e.stopPropagation();
    updateNodes(updateAtPath(nodes, path, (n) => ({ ...n, expanded: !n.expanded })));
  }, [nodes, updateNodes]);

  const select = useCallback((path, e) => {
    e.stopPropagation();
    onUpdate({ selectedPath: path === selectedPath ? null : path });
  }, [selectedPath, onUpdate]);

  const check = useCallback((path, e) => {
    e.stopPropagation();
    updateNodes(updateAtPath(nodes, path, (n) => ({ ...n, checked: !n.checked })));
  }, [nodes, updateNodes]);

  return (
    <div
      className={styles.wireBase}
      style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontSize: 12 }}
    >
      {/* Column headers */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid #999', background: '#f0f0f0', flexShrink: 0 }}>
        {columns.map((col, i) => (
          <div
            key={i}
            style={{
              flex: i === 0 ? 2 : 1,
              padding: '5px 8px',
              fontWeight: 700,
              fontSize: 11,
              color: '#444',
              borderRight: i < columns.length - 1 ? '1px solid #ccc' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Tree body */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {visibleRows.map((row) => {
          const isSelected = row.path === selectedPath;
          return (
            <div
              key={row.path}
              onClick={(e) => select(row.path, e)}
              style={{
                display: 'flex',
                minHeight: ROW_H,
                alignItems: 'center',
                background: isSelected ? '#d0ddff' : 'transparent',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background .08s',
              }}
            >
              {/* Name column */}
              <div
                style={{
                  flex: hasExtra ? 2 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: row.depth * INDENT + 4,
                  overflow: 'hidden',
                  borderRight: hasExtra ? '1px solid #e8e8e8' : 'none',
                  minHeight: ROW_H,
                }}
              >
                {/* Tree lines */}
                {row.depth > 0 && (
                  <span style={{
                    position: 'absolute',
                    left: (row.depth - 1) * INDENT + 11,
                    width: 1,
                    height: ROW_H,
                    background: '#ddd',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Expand arrow */}
                <span
                  onClick={(e) => { if (row.hasChildren) toggle(row.path, e); }}
                  style={{
                    width: 16,
                    height: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    color: '#666',
                    cursor: row.hasChildren ? 'pointer' : 'default',
                    userSelect: 'none',
                    flexShrink: 0,
                    borderRadius: 3,
                    transition: 'background .1s',
                    ...(row.hasChildren ? {} : { visibility: 'hidden' }),
                  }}
                  onMouseEnter={(e) => { if (row.hasChildren) e.currentTarget.style.background = '#e0e0e0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {row.hasChildren ? (row.expanded ? '▾' : '▸') : ''}
                </span>

                {/* Checkbox */}
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    checked={!!row.checked}
                    onChange={() => {}}
                    onClick={(e) => check(row.path, e)}
                    style={{ margin: '0 3px 0 1px', flexShrink: 0, cursor: 'pointer' }}
                  />
                )}

                {/* Icon */}
                <span style={{ marginRight: 4, fontSize: 13, flexShrink: 0, lineHeight: 1 }}>
                  {row.hasChildren ? (row.expanded ? '\u{1F4C2}' : '\u{1F4C1}') : '\u{1F4C4}'}
                </span>

                {/* Label */}
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: isSelected ? 600 : 400,
                    color: '#222',
                  }}
                >
                  {row.label}
                </span>
              </div>

              {/* Extra columns */}
              {hasExtra &&
                columns.slice(1).map((_, ci) => (
                  <div
                    key={ci}
                    style={{
                      flex: 1,
                      padding: '0 8px',
                      fontSize: 11,
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      borderRight: ci < columns.length - 2 ? '1px solid #e8e8e8' : 'none',
                    }}
                  >
                    {(row.values || [])[ci] || ''}
                  </div>
                ))}
            </div>
          );
        })}

        {visibleRows.length === 0 && (
          <div style={{ padding: 16, color: '#999', textAlign: 'center', fontSize: 11 }}>
            (empty tree)
          </div>
        )}
      </div>
    </div>
  );
}

// Helpers exported for use in PropertiesPanel
export function serializeTree(nodes, columns) {
  const lines = [];
  function walk(list, depth) {
    (list || []).forEach((n) => {
      const indent = '  '.repeat(depth);
      const vals = (n.values || []).map((v) => v || '');
      const extra = columns && columns.length > 1 ? ' | ' + vals.join(' | ') : '';
      lines.push(indent + n.label + extra);
      if (n.children) walk(n.children, depth + 1);
    });
  }
  walk(nodes, 0);
  return lines.join('\n');
}

export function deserializeTree(text, columnCount) {
  const lines = text.split('\n').filter((l) => l.trim());
  const root = [];
  const stack = [{ children: root, depth: -1 }];

  lines.forEach((line) => {
    const stripped = line.replace(/^\s*/, '');
    const depth = (line.length - stripped.length) / 2;
    const parts = stripped.split(' | ');
    const label = (parts[0] || '').trim();
    const values = parts.slice(1).map((v) => v.trim());

    const node = { label, values, children: [], expanded: true };

    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push({ children: node.children, depth });
  });

  return root;
}

export { addChildAtPath, removeAtPath, updateAtPath, getNodeAtPath };

export default React.memo(TreeViewWidget);
