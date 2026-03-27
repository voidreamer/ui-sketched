import { CanvasProvider } from './state/CanvasContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import styles from './App.module.css';

function AppInner() {
  useKeyboardShortcuts();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.center}>
        <TopBar />
        <Canvas />
      </div>
      <PropertiesPanel />
    </div>
  );
}

export default function App() {
  return (
    <CanvasProvider>
      <AppInner />
    </CanvasProvider>
  );
}
