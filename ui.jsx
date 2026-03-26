import { useState, useRef, useCallback, useEffect } from "react";
import yaml from "js-yaml";

const PALETTE = [
  { type: "button", label: "Button", icon: "☐" },
  { type: "input", label: "Text Input", icon: "▭" },
  { type: "textarea", label: "Text Area", icon: "▯" },
  { type: "combobox", label: "Combobox", icon: "▾" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "radio", label: "Radio Group", icon: "◉" },
  { type: "label", label: "Label", icon: "T" },
  { type: "heading", label: "Heading", icon: "H" },
  { type: "divider", label: "Divider", icon: "—" },
  { type: "image", label: "Image Box", icon: "🖼" },
  { type: "toggle", label: "Toggle", icon: "⊘" },
  { type: "slider", label: "Slider", icon: "⊶" },
  { type: "card", label: "Card", icon: "▢" },
  { type: "nav", label: "Nav Bar", icon: "≡" },
];

let idCounter = 0;
const nextId = () => `w-${++idCounter}`;

function createWidget(type, x, y) {
  const base = { id: nextId(), type, x, y };
  switch (type) {
    case "button": return { ...base, w: 120, h: 40, text: "Button", variant: "primary" };
    case "input": return { ...base, w: 220, h: 40, text: "", placeholder: "Enter text..." };
    case "textarea": return { ...base, w: 260, h: 100, text: "", placeholder: "Type here..." };
    case "combobox": return { ...base, w: 200, h: 40, text: "Select option", options: ["Option 1", "Option 2", "Option 3"], open: false };
    case "checkbox": return { ...base, w: 180, h: 30, text: "Checkbox label", checked: false };
    case "radio": return { ...base, w: 180, h: 90, text: "Radio Group", options: ["Choice A", "Choice B", "Choice C"], selected: 0 };
    case "label": return { ...base, w: 140, h: 28, text: "Label text" };
    case "heading": return { ...base, w: 240, h: 40, text: "Section Heading" };
    case "divider": return { ...base, w: 300, h: 8 };
    case "image": return { ...base, w: 160, h: 120, text: "Image" };
    case "toggle": return { ...base, w: 180, h: 34, text: "Toggle label", on: false };
    case "slider": return { ...base, w: 220, h: 36, text: "Slider", value: 50 };
    case "card": return { ...base, w: 260, h: 160, text: "Card Title", body: "Card content goes here" };
    case "nav": return { ...base, w: 500, h: 48, text: "Logo", links: ["Home", "About", "Contact"], activeLink: 0 };
    default: return { ...base, w: 100, h: 40, text: type };
  }
}

function InlineEdit({ value, onChange, style, multiline }) {
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
      background: "rgba(255,255,255,0.95)",
      border: "1.5px solid #4f8cff",
      borderRadius: 3,
      outline: "none",
      padding: "2px 4px",
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      color: "inherit",
      width: "100%",
    };

    const commit = () => {
      onChange(draft);
      setEditing(false);
    };

    if (multiline) {
      return (
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
          style={{ ...sharedStyle, resize: "none", height: "100%" }}
        />
      );
    }
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setDraft(value); setEditing(false); }
        }}
        style={sharedStyle}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
      style={{ ...style, cursor: "text" }}
    >
      {value}
    </span>
  );
}

function WidgetRenderer({ widget, selected, onSelect, onUpdate, onStartDrag }) {
  const s = selected ? "0 0 0 2px #4f8cff" : "none";
  const base = {
    position: "absolute", left: widget.x, top: widget.y,
    width: widget.w, cursor: "grab", boxShadow: s,
    userSelect: "none",
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    e.stopPropagation();
    onSelect(widget.id);
    onStartDrag(e, widget.id);
  };

  const wireStyle = {
    background: "#fff",
    border: "1.5px solid #888",
    borderRadius: 4,
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#333",
  };

  switch (widget.type) {
    case "button": {
      const [pressed, setPressed] = useState(false);
      return (
        <div style={{
          ...base, ...wireStyle, height: widget.h,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600,
          background: pressed ? "#c8d8ff" : widget.variant === "primary" ? "#e8eeff" : "#fff",
          transform: pressed ? "scale(0.97)" : "scale(1)",
          transition: "all .1s",
        }}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            e.stopPropagation();
            setPressed(true);
            setTimeout(() => setPressed(false), 150);
          }}
        >
          <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} />
        </div>
      );
    }

    case "input":
      return (
        <div style={{ ...base, ...wireStyle, height: widget.h, display: "flex", alignItems: "center", padding: "0 10px" }}
          onMouseDown={handleMouseDown}>
          <input
            type="text"
            value={widget.text}
            placeholder={widget.placeholder}
            onChange={(e) => onUpdate(widget.id, { text: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: "none", outline: "none", background: "transparent", width: "100%",
              fontFamily: "inherit", fontSize: "inherit", color: "#333",
            }}
          />
        </div>
      );

    case "textarea":
      return (
        <div style={{ ...base, ...wireStyle, height: widget.h, padding: 0, overflow: "hidden" }}
          onMouseDown={handleMouseDown}>
          <textarea
            value={widget.text}
            placeholder={widget.placeholder}
            onChange={(e) => onUpdate(widget.id, { text: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: "none", outline: "none", background: "transparent", width: "100%", height: "100%",
              fontFamily: "inherit", fontSize: "inherit", color: "#333", resize: "none", padding: "8px 10px",
            }}
          />
        </div>
      );

    case "combobox": {
      return (
        <div style={{ ...base, zIndex: widget.open ? 100 : "auto" }} onMouseDown={handleMouseDown}>
          <div
            style={{
              ...wireStyle, height: widget.h,
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px",
              cursor: "pointer",
            }}
            onClick={(e) => { e.stopPropagation(); onUpdate(widget.id, { open: !widget.open }); }}
          >
            <span>{widget.text}</span>
            <span style={{ fontSize: 16, color: "#666", transform: widget.open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
          </div>
          {widget.open && (
            <div style={{
              ...wireStyle, borderTop: "none", borderRadius: "0 0 4px 4px",
              position: "absolute", width: "100%", background: "#fff", zIndex: 10,
            }}>
              {widget.options.map((opt, i) => (
                <div key={i}
                  style={{
                    padding: "8px 10px", cursor: "pointer", fontSize: 13,
                    background: widget.text === opt ? "#e8eeff" : "transparent",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = widget.text === opt ? "#e8eeff" : "transparent"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(widget.id, { text: opt, open: false });
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "checkbox":
      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Courier New', monospace", fontSize: 13, cursor: "pointer" }}
          onMouseDown={handleMouseDown}
          onClick={(e) => { e.stopPropagation(); onUpdate(widget.id, { checked: !widget.checked }); }}>
          <span style={{
            width: 18, height: 18, border: "1.5px solid #888", borderRadius: 3,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: widget.checked ? "#e8eeff" : "#fff", fontSize: 12,
            transition: "background .15s",
          }}>
            {widget.checked ? "✓" : ""}
          </span>
          <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} />
        </div>
      );

    case "radio":
      return (
        <div style={{ ...base, display: "flex", flexDirection: "column", gap: 6, fontFamily: "'Courier New', monospace", fontSize: 13, padding: "6px 0" }}
          onMouseDown={handleMouseDown}>
          <span style={{ fontWeight: 600, marginBottom: 2 }}>
            <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} style={{ fontWeight: 600 }} />
          </span>
          {widget.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
              onClick={(e) => { e.stopPropagation(); onUpdate(widget.id, { selected: i }); }}>
              <span style={{
                width: 16, height: 16, border: "1.5px solid #888", borderRadius: "50%",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "#fff", transition: "all .15s",
              }}>
                {i === widget.selected ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f8cff" }} /> : null}
              </span>
              {opt}
            </div>
          ))}
        </div>
      );

    case "label":
      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center", fontFamily: "'Courier New', monospace", fontSize: 13, color: "#444" }}
          onMouseDown={handleMouseDown}>
          <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} />
        </div>
      );

    case "heading":
      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center", fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 700, color: "#222" }}
          onMouseDown={handleMouseDown}>
          <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} style={{ fontSize: 20, fontWeight: 700 }} />
        </div>
      );

    case "divider":
      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center" }}
          onMouseDown={handleMouseDown}>
          <div style={{ width: "100%", height: 2, background: "#bbb", borderRadius: 1 }} />
        </div>
      );

    case "image":
      return (
        <div style={{ ...base, ...wireStyle, height: widget.h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f4f4f4", color: "#999", overflow: "hidden" }}
          onMouseDown={handleMouseDown}>
          <span style={{ fontSize: 28 }}>🖼</span>
          <span style={{ fontSize: 11, marginTop: 4 }}>{widget.w}x{widget.h}</span>
        </div>
      );

    case "toggle":
      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Courier New', monospace", fontSize: 13 }}
          onMouseDown={handleMouseDown}>
          <div
            style={{
              width: 40, height: 22, borderRadius: 11, border: "1.5px solid #888",
              background: widget.on ? "#4f8cff" : "#ddd", position: "relative",
              transition: "background .2s", cursor: "pointer", flexShrink: 0,
            }}
            onClick={(e) => { e.stopPropagation(); onUpdate(widget.id, { on: !widget.on }); }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: "#fff", border: "1px solid #888", position: "absolute",
              top: 2, left: widget.on ? 20 : 2, transition: "left .2s",
            }} />
          </div>
          <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} />
        </div>
      );

    case "slider": {
      const sliderRef = useRef(null);
      const handleSliderInteraction = (e) => {
        e.stopPropagation();
        const rect = sliderRef.current.getBoundingClientRect();
        const val = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
        onUpdate(widget.id, { value: val });
      };
      const handleSliderDrag = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const onMove = (e2) => {
          const rect = sliderRef.current.getBoundingClientRect();
          const val = Math.round(Math.max(0, Math.min(100, ((e2.clientX - rect.left) / rect.width) * 100)));
          onUpdate(widget.id, { value: val });
        };
        const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      };

      return (
        <div style={{ ...base, height: widget.h, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Courier New', monospace", fontSize: 12 }}
          onMouseDown={handleMouseDown}>
          <span style={{ minWidth: 50, color: "#555" }}>{widget.value}</span>
          <div
            ref={sliderRef}
            onClick={handleSliderInteraction}
            style={{ flex: 1, height: 6, background: "#ddd", borderRadius: 3, position: "relative", cursor: "pointer" }}
          >
            <div style={{ width: `${widget.value}%`, height: "100%", background: "#4f8cff", borderRadius: 3, transition: "width .05s" }} />
            <div
              onMouseDown={handleSliderDrag}
              style={{
                position: "absolute", top: -5, left: `calc(${widget.value}% - 8px)`,
                width: 16, height: 16, borderRadius: "50%",
                background: "#fff", border: "1.5px solid #4f8cff", cursor: "grab",
                transition: "left .05s",
              }}
            />
          </div>
        </div>
      );
    }

    case "card":
      return (
        <div style={{ ...base, ...wireStyle, height: widget.h, display: "flex", flexDirection: "column", padding: 14, gap: 8 }}
          onMouseDown={handleMouseDown}>
          <div style={{ fontWeight: 700, fontSize: 15, borderBottom: "1px solid #ddd", paddingBottom: 6 }}>
            <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} style={{ fontWeight: 700, fontSize: 15 }} />
          </div>
          <div style={{ fontSize: 12, color: "#666", flex: 1 }}>
            <InlineEdit value={widget.body} onChange={(t) => onUpdate(widget.id, { body: t })} multiline style={{ fontSize: 12, color: "#666" }} />
          </div>
        </div>
      );

    case "nav": {
      return (
        <div style={{ ...base, ...wireStyle, height: widget.h, display: "flex", alignItems: "center", padding: "0 16px", gap: 24, background: "#f7f8fa" }}
          onMouseDown={handleMouseDown}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            <InlineEdit value={widget.text} onChange={(t) => onUpdate(widget.id, { text: t })} style={{ fontWeight: 700, fontSize: 15 }} />
          </span>
          <div style={{ flex: 1 }} />
          {widget.links.map((link, i) => (
            <span key={i}
              onClick={(e) => { e.stopPropagation(); onUpdate(widget.id, { activeLink: i }); }}
              style={{
                fontSize: 13, cursor: "pointer", padding: "4px 8px", borderRadius: 3,
                color: i === widget.activeLink ? "#4f8cff" : "#555",
                fontWeight: i === widget.activeLink ? 700 : 400,
                background: i === widget.activeLink ? "#e8eeff" : "transparent",
                transition: "all .15s",
              }}
            >
              {link}
            </span>
          ))}
        </div>
      );
    }

    default:
      return <div style={base} onMouseDown={handleMouseDown}>{widget.text}</div>;
  }
}

function ResizeHandle({ widget, onResize }) {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.w;
    const startH = widget.h;
    const onMove = (e2) => {
      onResize(widget.id, {
        w: Math.max(40, startW + (e2.clientX - startX)),
        h: Math.max(20, startH + (e2.clientY - startY)),
      });
    };
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: widget.x + widget.w - 6,
        top: widget.y + widget.h - 6,
        width: 12, height: 12,
        cursor: "nwse-resize",
        background: "#4f8cff",
        borderRadius: 2,
        zIndex: 999,
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

export default function WireframeBuilder() {
  const [widgets, setWidgets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const updateWidget = useCallback((id, patch) => {
    setWidgets((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.dataset.canvas) {
      setSelected(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("widget-type");
    if (!type) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 20;
    const w = createWidget(type, Math.max(0, x), Math.max(0, y));
    setWidgets((ws) => [...ws, w]);
    setSelected(w.id);
  };

  const handleStartDrag = (e, id) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;
    const rect = canvasRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left - widget.x,
      y: e.clientY - rect.top - widget.y,
    };
    setDragging(id);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - rect.left - dragOffset.current.x);
      const y = Math.max(0, e.clientY - rect.top - dragOffset.current.y);
      updateWidget(dragging, { x, y });
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, updateWidget]);

  const handleDelete = () => {
    if (selected) {
      setWidgets((ws) => ws.filter((w) => w.id !== selected));
      setSelected(null);
    }
  };

  const handleDuplicate = () => {
    const w = widgets.find((w) => w.id === selected);
    if (w) {
      const copy = { ...w, id: nextId(), x: w.x + 20, y: w.y + 20 };
      setWidgets((ws) => [...ws, copy]);
      setSelected(copy.id);
    }
  };

  // --- Save / Load ---
  const stripTransient = (ws) => ws.map(({ open, ...rest }) => rest);

  const handleSaveJSON = () => {
    const data = JSON.stringify({ version: 1, widgets: stripTransient(widgets) }, null, 2);
    downloadFile(data, "ui-sketch.json", "application/json");
  };

  const handleSaveYAML = () => {
    const data = yaml.dump({ version: 1, widgets: stripTransient(widgets) }, { lineWidth: 120 });
    downloadFile(data, "ui-sketch.yaml", "text/yaml");
  };

  const downloadFile = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.yaml,.yml";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          let data;
          if (file.name.endsWith(".json")) {
            data = JSON.parse(ev.target.result);
          } else {
            data = yaml.load(ev.target.result);
          }
          if (data?.widgets && Array.isArray(data.widgets)) {
            const maxId = data.widgets.reduce((max, w) => {
              const num = parseInt(w.id?.replace("w-", ""), 10);
              return num > max ? num : max;
            }, idCounter);
            idCounter = maxId;
            setWidgets(data.widgets);
            setSelected(null);
          }
        } catch (err) {
          console.error("Failed to load file:", err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selected) {
        handleDelete();
      }
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && selected) {
        e.preventDefault();
        handleDuplicate();
      }
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, widgets]);

  const selectedWidget = widgets.find((w) => w.id === selected);

  const topBarBtn = {
    background: "#2a2d38", color: "#8ab4f8", border: "1px solid #444",
    borderRadius: 4, padding: "4px 10px", fontSize: 11, cursor: "pointer",
    fontFamily: "inherit", opacity: widgets.length === 0 ? 0.4 : 1,
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Courier New', monospace", background: "#f0f1f3" }}>
      {/* Sidebar */}
      <div style={{ width: 180, background: "#1d1f27", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ color: "#8ab4f8", fontWeight: 700, fontSize: 13, padding: "6px 4px", letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #333", marginBottom: 6 }}>
          Components
        </div>
        {PALETTE.map((p) => (
          <div
            key={p.type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("widget-type", p.type)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 5,
              color: "#ccc", fontSize: 12, cursor: "grab",
              background: "transparent", transition: "background .15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#2a2d38"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 16, width: 22, textAlign: "center", opacity: .7 }}>{p.icon}</span>
            {p.label}
          </div>
        ))}

        {/* Actions */}
        {selected && (
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #333", display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={handleDuplicate} style={{ background: "#2a2d38", color: "#8ab4f8", border: "1px solid #444", borderRadius: 4, padding: "7px 0", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Duplicate (⌘D)
            </button>
            <button onClick={handleDelete} style={{ background: "#3a1c1c", color: "#ff8a8a", border: "1px solid #5a2a2a", borderRadius: 4, padding: "7px 0", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Delete (⌫)
            </button>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ height: 42, background: "#1d1f27", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, borderBottom: "1px solid #333", flexShrink: 0 }}>
          <span style={{ color: "#8ab4f8", fontWeight: 700, fontSize: 14, letterSpacing: .5 }}>ui-sketched</span>
          <span style={{ color: "#555", fontSize: 12 }}>|</span>
          <span style={{ color: "#777", fontSize: 11 }}>drag to canvas · double-click text to edit · resize from corner · Del to remove</span>
          <div style={{ flex: 1 }} />
          <button onClick={handleLoad} style={topBarBtn}>Load</button>
          <button onClick={handleSaveJSON} disabled={widgets.length === 0} style={topBarBtn}>Save JSON</button>
          <button onClick={handleSaveYAML} disabled={widgets.length === 0} style={topBarBtn}>Save YAML</button>
          <span style={{ color: "#444", fontSize: 11 }}>|</span>
          <span style={{ color: "#555", fontSize: 11 }}>{widgets.length} element{widgets.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Canvas area */}
        <div
          ref={canvasRef}
          data-canvas="true"
          onClick={handleCanvasClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            flex: 1, position: "relative", overflow: "auto",
            background: "#fff",
            backgroundImage: "radial-gradient(circle, #ddd 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {widgets.map((w) => (
            <WidgetRenderer
              key={w.id}
              widget={w}
              selected={selected === w.id}
              onSelect={setSelected}
              onUpdate={updateWidget}
              onStartDrag={handleStartDrag}
            />
          ))}
          {selectedWidget && <ResizeHandle widget={selectedWidget} onResize={(id, patch) => updateWidget(id, patch)} />}

          {widgets.length === 0 && (
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              color: "#bbb", fontSize: 14, textAlign: "center", pointerEvents: "none",
              fontFamily: "'Courier New', monospace",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: .4 }}>⊞</div>
              Drag components from the sidebar<br />onto this canvas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
