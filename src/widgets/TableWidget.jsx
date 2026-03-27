import React from 'react';
import styles from './widgets.module.css';

function TableWidget({ widget }) {
  const columns = widget.columns ?? ['Name', 'Value', 'Status'];
  const rows = widget.rows ?? 3;

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
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
                style={{
                  padding: '6px 10px',
                  textAlign: 'left',
                  fontWeight: 700,
                  background: '#f4f4f4',
                  borderBottom: '1.5px solid #888',
                  color: '#333',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, ri) => (
            <tr key={ri}>
              {columns.map((_, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '5px 10px',
                    borderBottom: '1px dashed #ccc',
                    color: '#555',
                  }}
                >
                  Cell {ri + 1},{ci + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(TableWidget);
