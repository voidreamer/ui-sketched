import { useCanvas } from '../state/CanvasContext';

export default function AlignmentGuides() {
  const { state } = useCanvas();
  const guides = state.snapGuides || [];

  if (guides.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {guides.map((guide, i) =>
        guide.axis === 'x' ? (
          <div
            key={`x-${i}`}
            style={{
              position: 'absolute',
              left: guide.pos,
              top: 0,
              width: 1,
              height: '100%',
              borderLeft: '1px dashed #4f8cff',
            }}
          />
        ) : (
          <div
            key={`y-${i}`}
            style={{
              position: 'absolute',
              top: guide.pos,
              left: 0,
              height: 1,
              width: '100%',
              borderTop: '1px dashed #4f8cff',
            }}
          />
        )
      )}
    </div>
  );
}
