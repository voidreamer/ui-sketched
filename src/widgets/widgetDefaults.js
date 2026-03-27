import { nextId } from '../utils/idGenerator';

export const PALETTE = [
  { type: 'button', label: 'Button', icon: '☐' },
  { type: 'input', label: 'Text Input', icon: '▭' },
  { type: 'textarea', label: 'Text Area', icon: '▯' },
  { type: 'combobox', label: 'Combobox', icon: '▾' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑' },
  { type: 'radio', label: 'Radio Group', icon: '◉' },
  { type: 'label', label: 'Label', icon: 'T' },
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'divider', label: 'Divider', icon: '—' },
  { type: 'image', label: 'Image Box', icon: '\u{1F5BC}' },
  { type: 'toggle', label: 'Toggle', icon: '⊘' },
  { type: 'slider', label: 'Slider', icon: '⊶' },
  { type: 'card', label: 'Card', icon: '▢' },
  { type: 'nav', label: 'Nav Bar', icon: '≡' },
];

export function createWidget(type, x, y) {
  const base = { id: nextId(), type, x, y };
  switch (type) {
    case 'button':
      return { ...base, w: 120, h: 40, text: 'Button', variant: 'primary' };
    case 'input':
      return { ...base, w: 220, h: 40, text: '', placeholder: 'Enter text...' };
    case 'textarea':
      return { ...base, w: 260, h: 100, text: '', placeholder: 'Type here...' };
    case 'combobox':
      return { ...base, w: 200, h: 40, text: 'Select option', options: ['Option 1', 'Option 2', 'Option 3'], open: false };
    case 'checkbox':
      return { ...base, w: 180, h: 30, text: 'Checkbox label', checked: false };
    case 'radio':
      return { ...base, w: 180, h: 90, text: 'Radio Group', options: ['Choice A', 'Choice B', 'Choice C'], selected: 0 };
    case 'label':
      return { ...base, w: 140, h: 28, text: 'Label text' };
    case 'heading':
      return { ...base, w: 240, h: 40, text: 'Section Heading' };
    case 'divider':
      return { ...base, w: 300, h: 8 };
    case 'image':
      return { ...base, w: 160, h: 120, text: 'Image' };
    case 'toggle':
      return { ...base, w: 180, h: 34, text: 'Toggle label', on: false };
    case 'slider':
      return { ...base, w: 220, h: 36, text: 'Slider', value: 50 };
    case 'card':
      return { ...base, w: 260, h: 160, text: 'Card Title', body: 'Card content goes here' };
    case 'nav':
      return { ...base, w: 500, h: 48, text: 'Logo', links: ['Home', 'About', 'Contact'], activeLink: 0 };
    default:
      return { ...base, w: 100, h: 40, text: type };
  }
}
