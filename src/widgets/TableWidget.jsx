import React, { useCallback } from 'react';
import styles from './widgets.module.css';

function TableWidget({ widget, onUpdate }) {
  const columns = widget.columns ?? ['Name', 'Value', 'Status'];
  const rows = widget.rows ?? 3;
  const data = widget.data || null;
  const selectedRow = widget.selectedRow ?? null;
  const sortColumn = widget.sortColumn ?? null;
  const sortDir = widget.sortDir ?? 'asc';
  const alternateRows = widget.alternateRows !== false;

  const handleSortClick = useCallback(
    (ci, e) => {
      e.stopPropagation();
      if (sortColumn === ci) {
        onUpdate({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
      } else {
        onUpdate({ sortColumn: ci, sortDir: 'asc' });
      }
    },
    [sortColumn, sortDir, onUpdate]
  );

  const handleRowClick = useCallback(
    (ri, e) => {
      e.stopPropagation();
      onUpdate({ selectedRow: ri === selectedRow ? null : ri });
    },
    [selectedRow, onUpdate]
  );

  const handleCellChange = useCallback(
    (ri, ci, value) => {
      const newData = (data || generateDefaultData(columns, rows)).map((row) => [...row]);
      newData[ri][ci] = value;
      onUpdate({ data: newData });
    },
    [data, columns, rows, onUpdate]
  );

  const displayData = data || generateDefaultData(columns, rows);

  return (
    <div
      className={styles.wireBase}
      style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            {columns.map((col, ci) => (
              <th
                key={ci}
                onClick={(e) => handleSortClick(ci, e)}
                style={{
                  padding: '6px 10px',
                  textAlign: 'left',
                  fontWeight: 700,
                  background: '#f0f0f0',
                  borderBottom: '1.5px solid #999',
                  color: '#333',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  userSelect: 'none',
                  position: 'relative',
                }}
              >
                {col}
                {sortColumn === ci && (
                  <span style={{ marginLeft: 4, fontSize: 10, color: '#666' }}>
                    {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, ri) => {
            const isSelected = ri === selectedRow;
            return (
              <tr
                key={ri}
                onClick={(e) => handleRowClick(ri, e)}
                style={{ cursor: 'pointer' }}
              >
                {columns.map((_, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '5px 10px',
                      borderBottom: '1px solid #e0e0e0',
                      background: isSelected
                        ? '#d0ddff'
                        : alternateRows && ri % 2 === 1
                          ? '#f8f8f8'
                          : 'transparent',
                      color: '#444',
                      transition: 'background .08s',
                    }}
                  >
                    {row[ci] ?? ''}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function generateDefaultData(columns, rows) {
  return Array.from({ length: rows }, (_, ri) =>
    columns.map((_, ci) => {
      if (ci === 0) return `Item ${ri + 1}`;
      if (ci === 1) return `${(ri + 1) * 100}`;
      return ri % 3 === 0 ? 'Active' : ri % 3 === 1 ? 'Pending' : 'Done';
    })
  );
}

export function serializeTableData(data) {
  if (!data) return '';
  return data.map((row) => row.join('\t')).join('\n');
}

export function deserializeTableData(text, columnCount) {
  return text
    .split('\n')
    .filter((l) => l.trim())
    .map((line) => {
      const cells = line.split('\t');
      while (cells.length < columnCount) cells.push('');
      return cells.slice(0, columnCount);
    });
}

export default React.memo(TableWidget);
