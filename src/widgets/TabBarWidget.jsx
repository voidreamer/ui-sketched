import React from 'react';
import styles from './widgets.module.css';

function TabBarWidget({ widget, onUpdate }) {
  const tabs = widget.tabs ?? ['Tab 1', 'Tab 2', 'Tab 3'];
  const activeTab = widget.activeTab ?? 0;

  return (
    <div
      className={styles.wireBase}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {tabs.map((tab, i) => (
        <div
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ activeTab: i });
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
            cursor: 'pointer',
            fontWeight: i === activeTab ? 700 : 400,
            background: i === activeTab ? '#e8eeff' : 'transparent',
            borderBottom: i === activeTab ? '2.5px solid #4f8cff' : '2.5px solid transparent',
            color: i === activeTab ? '#333' : '#888',
            transition: 'all .15s',
            whiteSpace: 'nowrap',
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export default React.memo(TabBarWidget);
