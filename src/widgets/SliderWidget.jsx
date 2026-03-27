import React, { useRef } from 'react';

function SliderWidget({ widget, onUpdate }) {
  const sliderRef = useRef(null);

  const handleSliderInteraction = (e) => {
    e.stopPropagation();
    const rect = sliderRef.current.getBoundingClientRect();
    const val = Math.round(
      Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    );
    onUpdate({ value: val });
  };

  const handleSliderDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const onMove = (e2) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const val = Math.round(
        Math.max(0, Math.min(100, ((e2.clientX - rect.left) / rect.width) * 100))
      );
      onUpdate({ value: val });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: "'Courier New', monospace",
        fontSize: 12,
      }}
    >
      <span style={{ minWidth: 50, color: '#555' }}>{widget.value}</span>
      <div
        ref={sliderRef}
        onClick={handleSliderInteraction}
        style={{
          flex: 1,
          height: 6,
          background: '#ddd',
          borderRadius: 3,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: `${widget.value}%`,
            height: '100%',
            background: '#4f8cff',
            borderRadius: 3,
            transition: 'width .05s',
          }}
        />
        <div
          onMouseDown={handleSliderDrag}
          style={{
            position: 'absolute',
            top: -5,
            left: `calc(${widget.value}% - 8px)`,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            border: '1.5px solid #4f8cff',
            cursor: 'grab',
            transition: 'left .05s',
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(SliderWidget);
