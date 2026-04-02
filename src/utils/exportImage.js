function getContentBounds(widgets) {
  if (widgets.length === 0) return { x: 0, y: 0, w: 800, h: 600 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const w of widgets) {
    minX = Math.min(minX, w.x);
    minY = Math.min(minY, w.y);
    maxX = Math.max(maxX, w.x + w.w);
    maxY = Math.max(maxY, w.y + w.h);
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export async function exportToPNG(widgets) {
  const { default: html2canvas } = await import('html2canvas');
  const canvasEl = document.querySelector('[data-canvas="true"]');
  if (!canvasEl) throw new Error('Canvas element not found');

  const bounds = getContentBounds(widgets);
  const padding = 40;
  const scrollX = canvasEl.scrollLeft;
  const scrollY = canvasEl.scrollTop;

  const canvas = await html2canvas(canvasEl, {
    x: bounds.x - padding + scrollX,
    y: bounds.y - padding + scrollY,
    width: bounds.w + padding * 2,
    height: bounds.h + padding * 2,
    backgroundColor: '#ffffff',
    scale: 2,
    // Hide selection highlights and guides during capture
    onclone: (doc) => {
      const clonedCanvas = doc.querySelector('[data-canvas="true"]');
      if (!clonedCanvas) return;
      // Remove selection outlines
      clonedCanvas.querySelectorAll('[style*="box-shadow"]').forEach((el) => {
        el.style.boxShadow = 'none';
      });
      // Remove resize handles
      clonedCanvas.querySelectorAll('[class*="resizeHandle"]').forEach((el) => {
        el.style.display = 'none';
      });
      // Remove selection rect
      clonedCanvas.querySelectorAll('[class*="selectionRect"]').forEach((el) => {
        el.style.display = 'none';
      });
      // Remove alignment guides
      clonedCanvas.querySelectorAll('[class*="guide"]').forEach((el) => {
        el.style.display = 'none';
      });
      // Remove empty state
      clonedCanvas.querySelectorAll('[class*="emptyState"]').forEach((el) => {
        el.style.display = 'none';
      });
    },
  });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ui-sketch.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export async function exportToSVG(widgets) {
  const canvasEl = document.querySelector('[data-canvas="true"]');
  if (!canvasEl) throw new Error('Canvas element not found');

  const bounds = getContentBounds(widgets);
  const padding = 40;

  // Simple SVG export: render each widget as a rect with text
  const svgParts = [];
  const ox = bounds.x - padding;
  const oy = bounds.y - padding;
  const svgW = bounds.w + padding * 2;
  const svgH = bounds.h + padding * 2;

  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`);
  svgParts.push(`<rect width="100%" height="100%" fill="#ffffff"/>`);

  for (const w of widgets) {
    const x = w.x - ox;
    const y = w.y - oy;
    const label = w.text || w.label || w.type;
    svgParts.push(`<g>`);
    svgParts.push(`<rect x="${x}" y="${y}" width="${w.w}" height="${w.h}" rx="4" fill="#fff" stroke="#888" stroke-width="1.5"/>`);
    svgParts.push(`<text x="${x + w.w / 2}" y="${y + w.h / 2}" text-anchor="middle" dominant-baseline="central" font-family="Courier New, monospace" font-size="12" fill="#333">${escapeXml(label)}</text>`);
    svgParts.push(`</g>`);
  }

  svgParts.push(`</svg>`);
  const svg = svgParts.join('\n');

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ui-sketch.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
