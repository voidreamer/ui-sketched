import { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../state/CanvasContext';
import { saveToS3, loadFromS3, listS3Sketches, downloadLocal, loadLocal } from '../utils/fileIO';
import { exportToPNG, exportToSVG } from '../utils/exportImage';
import { exportToDrawio } from '../utils/exportDrawio';
import styles from './TopBar.module.css';

function SaveMenu({ onClose }) {
  const { state, dispatch } = useCanvas();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const handleS3Save = async () => {
    if (!name.trim()) return;
    setStatus('Saving...');
    try {
      await saveToS3(state.widgets, name.trim());
      setStatus('Saved!');
      setTimeout(onClose, 800);
    } catch (err) {
      setStatus('S3 failed, try local');
      console.error(err);
    }
  };

  return (
    <div className={styles.menu} ref={ref}>
      <div className={styles.s3Row}>
        <input
          className={styles.s3Input}
          placeholder="sketch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleS3Save()}
          autoFocus
        />
        <button className={styles.menuItem} style={{ width: 'auto', padding: '4px 8px' }} onClick={handleS3Save}>
          Save
        </button>
      </div>
      {status && <div className={styles.statusMsg}>{status}</div>}
      <div className={styles.menuSep} />
      <button className={styles.menuItem} onClick={() => { downloadLocal(state.widgets); onClose(); }}>
        Download as file
      </button>
    </div>
  );
}

function LoadMenu({ onClose }) {
  const { dispatch } = useCanvas();
  const [sketches, setSketches] = useState([]);
  const [status, setStatus] = useState('Loading list...');
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  useEffect(() => {
    listS3Sketches()
      .then((list) => { setSketches(list); setStatus(list.length === 0 ? 'No sketches on S3' : ''); })
      .catch(() => setStatus('Could not reach S3'));
  }, []);

  const handleS3Load = async (name) => {
    setStatus('Loading...');
    try {
      const widgets = await loadFromS3(name);
      dispatch({ type: 'LOAD_CANVAS', widgets });
      onClose();
    } catch (err) {
      setStatus('Failed to load');
      console.error(err);
    }
  };

  return (
    <div className={styles.menu} ref={ref}>
      {status && <div className={styles.statusMsg} style={{ padding: '6px 12px' }}>{status}</div>}
      <div className={styles.s3List}>
        {sketches.map((s) => (
          <button key={s} className={styles.menuItem} onClick={() => handleS3Load(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className={styles.menuSep} />
      <button className={styles.menuItem} onClick={() => {
        loadLocal((widgets) => { dispatch({ type: 'LOAD_CANVAS', widgets }); onClose(); });
      }}>
        Load from file
      </button>
    </div>
  );
}

function ExportMenu({ onClose }) {
  const { state } = useCanvas();
  const [status, setStatus] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const handlePNG = async () => {
    setStatus('Rendering...');
    try {
      await exportToPNG(state.widgets);
      setStatus('Done!');
      setTimeout(onClose, 600);
    } catch (err) {
      setStatus('Export failed');
      console.error(err);
    }
  };

  const handleSVG = () => {
    try {
      exportToSVG(state.widgets);
      setStatus('Done!');
      setTimeout(onClose, 600);
    } catch (err) {
      setStatus('Export failed');
      console.error(err);
    }
  };

  const handleDrawio = () => {
    try {
      exportToDrawio(state.widgets);
      setStatus('Done!');
      setTimeout(onClose, 600);
    } catch (err) {
      setStatus('Export failed');
      console.error(err);
    }
  };

  return (
    <div className={styles.menu} ref={ref}>
      <button className={styles.menuItem} onClick={handlePNG}>
        Export as PNG
      </button>
      <button className={styles.menuItem} onClick={handleSVG}>
        Export as SVG
      </button>
      <div className={styles.menuSep} />
      <button className={styles.menuItem} onClick={handleDrawio}>
        Export as draw.io
      </button>
      {status && <div className={styles.statusMsg}>{status}</div>}
    </div>
  );
}

export default function TopBar() {
  const { state, undo, redo, canUndo, canRedo } = useCanvas();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => setOpenMenu((cur) => (cur === menu ? null : menu));

  return (
    <div className={styles.topBar}>
      <span className={styles.brand}>ui-sketched</span>
      <span className={styles.separator}>|</span>
      <span className={styles.hint}>
        drag to canvas &middot; dbl-click text &middot; resize corner &middot; Del remove
      </span>
      <div className={styles.spacer} />
      <button className={styles.btn} onClick={undo} disabled={!canUndo} title="Undo (⌘Z)">
        Undo
      </button>
      <button className={styles.btn} onClick={redo} disabled={!canRedo} title="Redo (⌘⇧Z)">
        Redo
      </button>
      <div className={styles.menuWrap}>
        <button className={styles.btn} onClick={() => toggleMenu('save')} disabled={state.widgets.length === 0}>
          Save
        </button>
        {openMenu === 'save' && <SaveMenu onClose={() => setOpenMenu(null)} />}
      </div>
      <div className={styles.menuWrap}>
        <button className={styles.btn} onClick={() => toggleMenu('load')}>
          Load
        </button>
        {openMenu === 'load' && <LoadMenu onClose={() => setOpenMenu(null)} />}
      </div>
      <div className={styles.menuWrap}>
        <button className={styles.btn} onClick={() => toggleMenu('export')} disabled={state.widgets.length === 0}>
          Export
        </button>
        {openMenu === 'export' && <ExportMenu onClose={() => setOpenMenu(null)} />}
      </div>
      <span className={styles.separator}>|</span>
      <span className={styles.count}>
        {state.widgets.length} element{state.widgets.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
