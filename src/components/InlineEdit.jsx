import { useState, useRef, useEffect } from 'react';
import styles from './InlineEdit.module.css';

export default function InlineEdit({ value, onChange, style, multiline }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [editing]);

  if (editing) {
    const sharedStyle = {
      ...style,
      background: 'rgba(255,255,255,0.95)',
      border: '1.5px solid #4f8cff',
      borderRadius: 3,
      outline: 'none',
      padding: '2px 4px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      color: 'inherit',
      width: '100%',
    };

    const commit = () => {
      onChange(draft);
      setEditing(false);
    };

    if (multiline) {
      return (
        <textarea
          ref={ref}
          className={styles.textarea}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setDraft(value);
              setEditing(false);
            }
          }}
          style={{ ...sharedStyle, resize: 'none', height: '100%' }}
        />
      );
    }

    return (
      <input
        ref={ref}
        className={styles.input}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        style={sharedStyle}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => {
        e.stopPropagation();
        setDraft(value);
        setEditing(true);
      }}
      style={{ ...style, cursor: 'text' }}
    >
      {value}
    </span>
  );
}
