import { nextId } from '../utils/idGenerator';

export const PALETTE = [
  // Basic
  { type: 'button', label: 'Button', icon: '☐' },
  { type: 'input', label: 'Text Input', icon: '▭' },
  { type: 'password', label: 'Password', icon: '••' },
  { type: 'textarea', label: 'Text Area', icon: '▯' },
  { type: 'combobox', label: 'Combobox', icon: '▾' },
  { type: 'spinbox', label: 'Spin Box', icon: '↕' },
  { type: 'datepicker', label: 'Date Picker', icon: '📅' },
  // Toggles & Selection
  { type: 'checkbox', label: 'Checkbox', icon: '☑' },
  { type: 'radio', label: 'Radio Group', icon: '◉' },
  { type: 'toggle', label: 'Toggle', icon: '⊘' },
  { type: 'slider', label: 'Slider', icon: '⊶' },
  { type: 'progressbar', label: 'Progress Bar', icon: '▰' },
  // Text & Display
  { type: 'label', label: 'Label', icon: 'T' },
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'badge', label: 'Badge', icon: '●' },
  { type: 'avatar', label: 'Avatar', icon: '👤' },
  { type: 'alert', label: 'Alert', icon: '⚠' },
  { type: 'divider', label: 'Divider', icon: '—' },
  { type: 'image', label: 'Image Box', icon: '🖼' },
  // Navigation
  { type: 'nav', label: 'Nav Bar', icon: '≡' },
  { type: 'menubar', label: 'Menu Bar', icon: '☰' },
  { type: 'tabbar', label: 'Tab Bar', icon: '⊟' },
  { type: 'breadcrumb', label: 'Breadcrumbs', icon: '›' },
  { type: 'statusbar', label: 'Status Bar', icon: '▬' },
  // Containers & Data
  { type: 'card', label: 'Card', icon: '▢' },
  { type: 'groupbox', label: 'Group Box', icon: '⊞' },
  { type: 'list', label: 'List', icon: '☷' },
  { type: 'table', label: 'Table', icon: '⊞' },
  // Pro Widgets
  { type: 'treeview', label: 'Tree View', icon: '\u251C' },
  { type: 'propertygrid', label: 'Property Grid', icon: '\u2699' },
  { type: 'toolbar', label: 'Toolbar', icon: '\u{1F527}' },
];

export function createWidget(type, x, y) {
  const base = { id: nextId(), type, x, y };
  switch (type) {
    case 'button':
      return { ...base, w: 120, h: 40, text: 'Button', variant: 'primary' };
    case 'input':
      return { ...base, w: 220, h: 40, text: '', placeholder: 'Enter text...' };
    case 'password':
      return { ...base, w: 220, h: 40, text: 'Password', value: 'password123' };
    case 'textarea':
      return { ...base, w: 260, h: 100, text: '', placeholder: 'Type here...' };
    case 'combobox':
      return { ...base, w: 200, h: 40, text: 'Select option', options: ['Option 1', 'Option 2', 'Option 3'], open: false };
    case 'spinbox':
      return { ...base, w: 200, h: 40, text: 'Value', value: 0, min: 0, max: 100, step: 1 };
    case 'datepicker':
      return { ...base, w: 220, h: 40, text: 'Date', date: '2024-01-15' };
    case 'checkbox':
      return { ...base, w: 180, h: 30, text: 'Checkbox label', checked: false };
    case 'radio':
      return { ...base, w: 180, h: 90, text: 'Radio Group', options: ['Choice A', 'Choice B', 'Choice C'], selected: 0 };
    case 'toggle':
      return { ...base, w: 180, h: 34, text: 'Toggle label', on: false };
    case 'slider':
      return { ...base, w: 220, h: 36, text: 'Slider', value: 50 };
    case 'progressbar':
      return { ...base, w: 260, h: 32, text: 'Progress', value: 65 };
    case 'label':
      return { ...base, w: 140, h: 28, text: 'Label text' };
    case 'heading':
      return { ...base, w: 240, h: 40, text: 'Section Heading' };
    case 'badge':
      return { ...base, w: 80, h: 28, text: 'Badge', variant: 'default' };
    case 'avatar':
      return { ...base, w: 48, h: 48, text: 'JD' };
    case 'alert':
      return { ...base, w: 320, h: 48, text: 'This is an alert message', variant: 'info' };
    case 'divider':
      return { ...base, w: 300, h: 8 };
    case 'image':
      return { ...base, w: 160, h: 120, text: 'Image' };
    case 'nav':
      return { ...base, w: 500, h: 48, text: 'Logo', links: ['Home', 'About', 'Contact'], activeLink: 0 };
    case 'menubar':
      return { ...base, w: 400, h: 32, menus: ['File', 'Edit', 'View', 'Help'] };
    case 'tabbar':
      return { ...base, w: 360, h: 40, tabs: ['Tab 1', 'Tab 2', 'Tab 3'], activeTab: 0 };
    case 'breadcrumb':
      return { ...base, w: 280, h: 28, items: ['Home', 'Products', 'Detail'] };
    case 'statusbar':
      return { ...base, w: 500, h: 28, text: 'Ready', items: ['Ln 1', 'Col 1', 'UTF-8'] };
    case 'card':
      return { ...base, w: 260, h: 160, text: 'Card Title', body: 'Card content goes here' };
    case 'groupbox':
      return { ...base, w: 240, h: 140, text: 'Group Title' };
    case 'list':
      return { ...base, w: 200, h: 160, items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'], selectedIndex: 0 };
    case 'table':
      return { ...base, w: 360, h: 180, columns: ['Name', 'Value', 'Status'], rows: 4, data: null, selectedRow: null, sortColumn: null, sortDir: 'asc', alternateRows: true };
    case 'treeview':
      return {
        ...base, w: 340, h: 260,
        columns: ['Name', 'Value', 'Type'],
        showCheckboxes: false,
        selectedPath: null,
        nodes: [
          {
            label: 'Application', expanded: true, values: ['v1.0', 'Root'],
            children: [
              {
                label: 'Components', expanded: true, values: ['', 'Group'],
                children: [
                  { label: 'Header', values: ['active', 'Widget'], children: [] },
                  { label: 'Sidebar', values: ['active', 'Widget'], children: [] },
                  { label: 'Footer', values: ['hidden', 'Widget'], children: [] },
                ],
              },
              {
                label: 'Settings', expanded: false, values: ['', 'Group'],
                children: [
                  { label: 'Theme', values: ['dark', 'String'], children: [] },
                  { label: 'Language', values: ['en', 'String'], children: [] },
                ],
              },
            ],
          },
        ],
      };
    case 'propertygrid':
      return {
        ...base, w: 280, h: 300,
        groups: [
          {
            label: 'Appearance', expanded: true,
            properties: [
              { key: 'Background', value: '#ffffff', kind: 'color' },
              { key: 'Font Size', value: '14px', kind: 'text' },
              { key: 'Visible', value: 'true', kind: 'bool' },
              { key: 'Opacity', value: '100%', kind: 'text' },
            ],
          },
          {
            label: 'Layout', expanded: true,
            properties: [
              { key: 'Width', value: '200', kind: 'text' },
              { key: 'Height', value: '100', kind: 'text' },
              { key: 'Alignment', value: 'Center', kind: 'text' },
            ],
          },
          {
            label: 'Behavior', expanded: false,
            properties: [
              { key: 'Enabled', value: 'true', kind: 'bool' },
              { key: 'Read Only', value: 'false', kind: 'bool' },
            ],
          },
        ],
      };
    case 'toolbar':
      return {
        ...base, w: 400, h: 44,
        showLabels: true,
        items: [
          { label: 'New', icon: '+' },
          { label: 'Open', icon: '\u{1F4C2}' },
          { label: 'Save', icon: '\u{1F4BE}' },
          { kind: 'separator' },
          { label: 'Cut', icon: '\u2702' },
          { label: 'Copy', icon: '\u{1F4CB}' },
          { label: 'Paste', icon: '\u{1F4CB}' },
          { kind: 'separator' },
          { label: 'Undo', icon: '\u21A9' },
          { label: 'Redo', icon: '\u21AA' },
        ],
      };
    default:
      return { ...base, w: 100, h: 40, text: type };
  }
}
