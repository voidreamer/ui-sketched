// draw.io / diagrams.net export
// Generates mxGraph XML compatible with draw.io

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Map widget types to draw.io styles
function getDrawioStyle(widget) {
  const base = 'whiteSpace=wrap;html=1;fontSize=12;fontFamily=Courier New;';

  switch (widget.type) {
    case 'button':
      return widget.variant === 'primary'
        ? `${base}rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;`
        : `${base}rounded=1;fillColor=#f5f5f5;strokeColor=#666666;fontStyle=1;`;

    case 'input':
    case 'password':
    case 'textarea':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;dashed=1;align=left;verticalAlign=middle;spacingLeft=8;`;

    case 'combobox':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;shape=mxgraph.mockup.forms.comboBox;strokeColor=#999999;fillColor=#ffffff;align=left;spacingLeft=8;`;

    case 'spinbox':
    case 'datepicker':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;align=left;spacingLeft=8;`;

    case 'checkbox':
      return `${base}rounded=0;fillColor=none;strokeColor=none;align=left;spacingLeft=4;`;

    case 'radio':
      return `${base}rounded=0;fillColor=none;strokeColor=none;align=left;verticalAlign=top;spacingTop=4;spacingLeft=4;`;

    case 'toggle':
      return `${base}rounded=1;fillColor=none;strokeColor=none;align=left;spacingLeft=4;`;

    case 'slider':
    case 'progressbar':
      return `${base}rounded=1;fillColor=#e8eeff;strokeColor=#6c8ebf;`;

    case 'label':
      return `text;html=1;align=left;verticalAlign=middle;resizable=1;points=[];autosize=0;fontSize=12;fontFamily=Courier New;fillColor=none;strokeColor=none;`;

    case 'heading':
      return `text;html=1;align=left;verticalAlign=middle;resizable=1;points=[];autosize=0;fontSize=16;fontFamily=Courier New;fontStyle=1;fillColor=none;strokeColor=none;`;

    case 'badge':
      return `${base}rounded=1;fillColor=#e8eeff;strokeColor=#6c8ebf;fontSize=10;arcSize=50;`;

    case 'avatar':
      return `${base}ellipse;fillColor=#dae8fc;strokeColor=#6c8ebf;fontStyle=1;fontSize=14;`;

    case 'alert':
      return `${base}rounded=1;fillColor=#fff2cc;strokeColor=#d6b656;align=left;spacingLeft=12;`;

    case 'divider':
      return `line;html=1;strokeColor=#cccccc;fillColor=none;`;

    case 'image':
      return `${base}rounded=0;fillColor=#f5f5f5;strokeColor=#999999;shape=image;imageAlign=center;`;

    case 'nav':
      return `${base}rounded=0;fillColor=#f0f0f0;strokeColor=#999999;fontStyle=1;`;

    case 'menubar':
      return `${base}rounded=0;fillColor=#f4f4f4;strokeColor=#999999;fontSize=11;`;

    case 'tabbar':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;`;

    case 'breadcrumb':
      return `text;html=1;align=left;verticalAlign=middle;resizable=1;fontSize=11;fontFamily=Courier New;fillColor=none;strokeColor=none;`;

    case 'statusbar':
      return `${base}rounded=0;fillColor=#f4f4f4;strokeColor=#cccccc;fontSize=10;align=left;spacingLeft=8;`;

    case 'card':
      return `${base}rounded=1;fillColor=#ffffff;strokeColor=#cccccc;verticalAlign=top;spacingTop=8;spacingLeft=8;shadow=1;`;

    case 'groupbox':
      return `${base}rounded=0;fillColor=none;strokeColor=#999999;verticalAlign=top;spacingTop=4;fontStyle=1;`;

    case 'list':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;verticalAlign=top;align=left;spacingTop=4;spacingLeft=8;`;

    case 'table':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;verticalAlign=top;spacingTop=0;`;

    case 'treeview':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;verticalAlign=top;align=left;spacingTop=4;spacingLeft=8;`;

    case 'propertygrid':
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;verticalAlign=top;spacingTop=0;`;

    case 'toolbar':
      return `${base}rounded=0;fillColor=#f4f4f4;strokeColor=#999999;fontSize=10;`;

    default:
      return `${base}rounded=0;fillColor=#ffffff;strokeColor=#999999;`;
  }
}

// Build rich label content for complex widgets
function getDrawioLabel(widget) {
  switch (widget.type) {
    case 'button':
      return escapeHtml(widget.text || 'Button');

    case 'input':
      return `<i style="color:#999">${escapeHtml(widget.placeholder || 'Enter text...')}</i>`;

    case 'password':
      return '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';

    case 'textarea':
      return `<i style="color:#999">${escapeHtml(widget.placeholder || 'Type here...')}</i>`;

    case 'combobox':
      return `${escapeHtml(widget.text || 'Select')} \u25BE`;

    case 'checkbox':
      return `${widget.checked ? '\u2611' : '\u2610'} ${escapeHtml(widget.text || '')}`;

    case 'radio': {
      const opts = (widget.options || []).map((o, i) =>
        `${i === widget.selected ? '\u25C9' : '\u25CB'} ${escapeHtml(o)}`
      ).join('<br>');
      return opts;
    }

    case 'toggle':
      return `${widget.on ? '[\u25CF  ]' : '[  \u25CF]'} ${escapeHtml(widget.text || '')}`;

    case 'slider':
      return `${escapeHtml(widget.text || 'Slider')}: ${widget.value ?? 50}%`;

    case 'progressbar':
      return `${escapeHtml(widget.text || 'Progress')}: ${widget.value ?? 65}%`;

    case 'badge':
      return escapeHtml(widget.text || 'Badge');

    case 'avatar':
      return `<b>${escapeHtml(widget.text || 'JD')}</b>`;

    case 'alert':
      return `\u26A0 ${escapeHtml(widget.text || 'Alert')}`;

    case 'divider':
      return '';

    case 'image':
      return `\u{1F5BC} ${escapeHtml(widget.text || 'Image')}`;

    case 'nav': {
      const links = (widget.links || []).map((l, i) =>
        i === widget.activeLink ? `<b>${escapeHtml(l)}</b>` : escapeHtml(l)
      ).join('  |  ');
      return `${escapeHtml(widget.text || 'Logo')}  |  ${links}`;
    }

    case 'menubar':
      return (widget.menus || []).map(escapeHtml).join('  |  ');

    case 'tabbar': {
      return (widget.tabs || []).map((t, i) =>
        i === widget.activeTab ? `<b>[${escapeHtml(t)}]</b>` : escapeHtml(t)
      ).join('  ');
    }

    case 'breadcrumb':
      return (widget.items || []).map(escapeHtml).join(' \u203A ');

    case 'statusbar':
      return [widget.text, ...(widget.items || [])].map(escapeHtml).join('  |  ');

    case 'card':
      return `<b>${escapeHtml(widget.text || 'Card')}</b><br><hr><br>${escapeHtml(widget.body || '')}`;

    case 'groupbox':
      return `<b>${escapeHtml(widget.text || 'Group')}</b>`;

    case 'list': {
      const items = (widget.items || []).map((item, i) =>
        i === widget.selectedIndex ? `<b>\u25B6 ${escapeHtml(item)}</b>` : `  ${escapeHtml(item)}`
      ).join('<br>');
      return items;
    }

    case 'table': {
      const cols = widget.columns || ['Name', 'Value', 'Status'];
      const data = widget.data;
      const rows = widget.rows ?? 3;
      let html = `<table style="width:100%;border-collapse:collapse;font-size:10px;">`;
      html += `<tr>${cols.map(c => `<td style="font-weight:bold;border-bottom:1px solid #888;padding:2px 4px;">${escapeHtml(c)}</td>`).join('')}</tr>`;
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols.length; c++) {
          const val = data ? (data[r] || [])[c] || '' : `Cell ${r + 1},${c + 1}`;
          html += `<td style="border-bottom:1px dashed #ccc;padding:2px 4px;">${escapeHtml(val)}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      return html;
    }

    case 'treeview': {
      const nodes = widget.nodes || [];
      const lines = [];
      function walk(list, depth) {
        for (const n of list) {
          const indent = '\u00A0\u00A0'.repeat(depth);
          const arrow = n.children && n.children.length > 0
            ? (n.expanded ? '\u25BE' : '\u25B8') : '\u00A0';
          const icon = n.children && n.children.length > 0 ? '\u{1F4C1}' : '\u{1F4C4}';
          lines.push(`${indent}${arrow} ${icon} ${escapeHtml(n.label)}`);
          if (n.expanded && n.children) walk(n.children, depth + 1);
        }
      }
      walk(nodes, 0);
      return lines.join('<br>');
    }

    case 'propertygrid': {
      const groups = widget.groups || [];
      const lines = [];
      for (const g of groups) {
        lines.push(`<b>${g.expanded ? '\u25BE' : '\u25B8'} ${escapeHtml(g.label)}</b>`);
        if (g.expanded) {
          for (const p of (g.properties || [])) {
            lines.push(`\u00A0\u00A0${escapeHtml(p.key)} = ${escapeHtml(p.value)}`);
          }
        }
      }
      return lines.join('<br>');
    }

    case 'toolbar': {
      const items = (widget.items || []).filter(i => i.kind !== 'separator');
      return items.map(i => `[${escapeHtml(i.icon || '')} ${escapeHtml(i.label || '')}]`).join(' ');
    }

    default:
      return escapeHtml(widget.text || widget.type);
  }
}

export function exportToDrawio(widgets) {
  let cellId = 2; // 0 and 1 are reserved

  const cells = widgets.map((widget) => {
    const id = cellId++;
    const style = getDrawioStyle(widget);
    const label = getDrawioLabel(widget);

    return `        <mxCell id="${id}" value="${escapeXml(label)}" style="${escapeXml(style)}" vertex="1" parent="1">
          <mxGeometry x="${widget.x}" y="${widget.y}" width="${widget.w}" height="${widget.h}" as="geometry"/>
        </mxCell>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="ui-sketched" modified="${new Date().toISOString()}" type="device">
  <diagram id="page1" name="UI Sketch">
    <mxGraphModel dx="0" dy="0" grid="1" gridSize="20" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
${cells.join('\n')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ui-sketch.drawio';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
