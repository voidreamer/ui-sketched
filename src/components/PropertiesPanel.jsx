import { useCanvas } from '../state/CanvasContext';
import styles from './PropertiesPanel.module.css';

const TYPES_WITH_TEXT = [
  'button', 'input', 'textarea', 'checkbox', 'radio',
  'label', 'heading', 'toggle', 'slider', 'card', 'nav',
  'progressbar', 'spinbox', 'datepicker', 'password',
  'alert', 'statusbar', 'groupbox', 'badge',
];

export default function PropertiesPanel() {
  const { state, dispatch } = useCanvas();

  if (state.selection.length === 0) return null;

  const update = (id, patch) =>
    dispatch({ type: 'UPDATE_WIDGET', id, patch });

  if (state.selection.length > 1) {
    return (
      <div className={styles.panel}>
        <div className={styles.sectionHeader}>Properties</div>
        <div className={styles.multiInfo}>
          {state.selection.length} widgets selected
        </div>
      </div>
    );
  }

  const widget = state.widgets.find((w) => w.id === state.selection[0]);
  if (!widget) return null;

  const handleNumericChange = (field) => (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      update(widget.id, { [field]: val });
    }
  };

  const handleTextChange = (field) => (e) => {
    update(widget.id, { [field]: e.target.value });
  };

  const handleOptionChange = (listField, index) => (e) => {
    const newList = [...(widget[listField] || [])];
    newList[index] = e.target.value;
    update(widget.id, { [listField]: newList });
  };

  const handleRemoveOption = (listField, index) => () => {
    const newList = [...(widget[listField] || [])];
    newList.splice(index, 1);
    update(widget.id, { [listField]: newList });
  };

  const handleAddOption = (listField) => () => {
    const newList = [...(widget[listField] || []), 'New item'];
    update(widget.id, { [listField]: newList });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeader}>Properties</div>
      <div className={styles.typeLabel}>{widget.type}</div>

      {/* Position */}
      <div className={styles.label}>Position</div>
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>X</span>
          <input
            type="number"
            min={0}
            className={styles.numInput}
            value={widget.x}
            onChange={handleNumericChange('x')}
          />
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Y</span>
          <input
            type="number"
            min={0}
            className={styles.numInput}
            value={widget.y}
            onChange={handleNumericChange('y')}
          />
        </div>
      </div>

      {/* Size */}
      <div className={styles.label}>Size</div>
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>W</span>
          <input
            type="number"
            min={0}
            className={styles.numInput}
            value={widget.w}
            onChange={handleNumericChange('w')}
          />
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>H</span>
          <input
            type="number"
            min={0}
            className={styles.numInput}
            value={widget.h}
            onChange={handleNumericChange('h')}
          />
        </div>
      </div>

      {/* Text */}
      {TYPES_WITH_TEXT.includes(widget.type) && (
        <>
          <div className={styles.label}>Text</div>
          <input
            type="text"
            className={styles.textInput}
            value={widget.text || ''}
            onChange={handleTextChange('text')}
          />
        </>
      )}

      {/* Placeholder (input, textarea) */}
      {(widget.type === 'input' || widget.type === 'textarea') && (
        <>
          <div className={styles.label}>Placeholder</div>
          <input
            type="text"
            className={styles.textInput}
            value={widget.placeholder || ''}
            onChange={handleTextChange('placeholder')}
          />
        </>
      )}

      {/* Button variant */}
      {widget.type === 'button' && (
        <>
          <div className={styles.label}>Variant</div>
          <select
            className={styles.selectInput}
            value={widget.variant || 'primary'}
            onChange={(e) => update(widget.id, { variant: e.target.value })}
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </select>
        </>
      )}

      {/* Checkbox checked */}
      {widget.type === 'checkbox' && (
        <>
          <div className={styles.label}>Checked</div>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={!!widget.checked}
              onChange={(e) => update(widget.id, { checked: e.target.checked })}
            />
            <span>{widget.checked ? 'On' : 'Off'}</span>
          </label>
        </>
      )}

      {/* Toggle on */}
      {widget.type === 'toggle' && (
        <>
          <div className={styles.label}>On</div>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={!!widget.on}
              onChange={(e) => update(widget.id, { on: e.target.checked })}
            />
            <span>{widget.on ? 'On' : 'Off'}</span>
          </label>
        </>
      )}

      {/* Slider value */}
      {widget.type === 'slider' && (
        <>
          <div className={styles.label}>Value</div>
          <input
            type="range"
            min={0}
            max={100}
            className={styles.rangeInput}
            value={widget.value || 0}
            onChange={(e) =>
              update(widget.id, { value: parseInt(e.target.value, 10) })
            }
          />
          <span className={styles.rangeValue}>{widget.value}</span>
        </>
      )}

      {/* Combobox options */}
      {widget.type === 'combobox' && (
        <>
          <div className={styles.label}>Options</div>
          {(widget.options || []).map((opt, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type="text"
                className={styles.textInput}
                value={opt}
                onChange={handleOptionChange('options', i)}
              />
              <button
                className={styles.removeBtn}
                onClick={handleRemoveOption('options', i)}
              >
                {'\u00D7'}
              </button>
            </div>
          ))}
          <button
            className={styles.addBtn}
            onClick={handleAddOption('options')}
          >
            + Add option
          </button>
        </>
      )}

      {/* Radio options + selected */}
      {widget.type === 'radio' && (
        <>
          <div className={styles.label}>Options</div>
          {(widget.options || []).map((opt, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type="text"
                className={styles.textInput}
                value={opt}
                onChange={handleOptionChange('options', i)}
              />
              <button
                className={styles.removeBtn}
                onClick={handleRemoveOption('options', i)}
              >
                {'\u00D7'}
              </button>
            </div>
          ))}
          <button
            className={styles.addBtn}
            onClick={handleAddOption('options')}
          >
            + Add option
          </button>
          <div className={styles.label}>Selected</div>
          <select
            className={styles.selectInput}
            value={widget.selected ?? 0}
            onChange={(e) =>
              update(widget.id, { selected: parseInt(e.target.value, 10) })
            }
          >
            {(widget.options || []).map((opt, i) => (
              <option key={i} value={i}>
                {opt}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Card body */}
      {widget.type === 'card' && (
        <>
          <div className={styles.label}>Body</div>
          <textarea
            className={styles.textareaInput}
            value={widget.body || ''}
            onChange={handleTextChange('body')}
            rows={3}
          />
        </>
      )}

      {/* Nav links + activeLink */}
      {widget.type === 'nav' && (
        <>
          <div className={styles.label}>Links</div>
          {(widget.links || []).map((link, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type="text"
                className={styles.textInput}
                value={link}
                onChange={handleOptionChange('links', i)}
              />
              <button
                className={styles.removeBtn}
                onClick={handleRemoveOption('links', i)}
              >
                {'\u00D7'}
              </button>
            </div>
          ))}
          <button
            className={styles.addBtn}
            onClick={handleAddOption('links')}
          >
            + Add link
          </button>
          <div className={styles.label}>Active Link</div>
          <select
            className={styles.selectInput}
            value={widget.activeLink ?? 0}
            onChange={(e) =>
              update(widget.id, { activeLink: parseInt(e.target.value, 10) })
            }
          >
            {(widget.links || []).map((link, i) => (
              <option key={i} value={i}>
                {link}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Progress bar value */}
      {widget.type === 'progressbar' && (
        <>
          <div className={styles.label}>Value</div>
          <input
            type="range"
            min={0}
            max={100}
            className={styles.rangeInput}
            value={widget.value || 0}
            onChange={(e) =>
              update(widget.id, { value: parseInt(e.target.value, 10) })
            }
          />
          <span className={styles.rangeValue}>{widget.value}%</span>
        </>
      )}

      {/* SpinBox */}
      {widget.type === 'spinbox' && (
        <>
          <div className={styles.label}>Value</div>
          <input
            type="number"
            className={styles.numInput}
            value={widget.value ?? 0}
            onChange={(e) => update(widget.id, { value: parseInt(e.target.value, 10) || 0 })}
          />
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Min</span>
              <input type="number" className={styles.numInput} value={widget.min ?? 0}
                onChange={(e) => update(widget.id, { min: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Max</span>
              <input type="number" className={styles.numInput} value={widget.max ?? 100}
                onChange={(e) => update(widget.id, { max: parseInt(e.target.value, 10) || 100 })} />
            </div>
          </div>
          <div className={styles.label}>Step</div>
          <input type="number" className={styles.numInput} value={widget.step ?? 1} min={1}
            onChange={(e) => update(widget.id, { step: parseInt(e.target.value, 10) || 1 })} />
        </>
      )}

      {/* DatePicker */}
      {widget.type === 'datepicker' && (
        <>
          <div className={styles.label}>Date</div>
          <input
            type="date"
            className={styles.textInput}
            value={widget.date || ''}
            onChange={(e) => update(widget.id, { date: e.target.value })}
          />
        </>
      )}

      {/* Password */}
      {widget.type === 'password' && (
        <>
          <div className={styles.label}>Value</div>
          <input
            type="text"
            className={styles.textInput}
            value={widget.value || ''}
            onChange={handleTextChange('value')}
          />
        </>
      )}

      {/* Badge/Alert variant */}
      {(widget.type === 'badge' || widget.type === 'alert') && (
        <>
          <div className={styles.label}>Variant</div>
          <select
            className={styles.selectInput}
            value={widget.variant || 'default'}
            onChange={(e) => update(widget.id, { variant: e.target.value })}
          >
            {widget.type === 'badge' ? (
              <>
                <option value="default">Default</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </>
            ) : (
              <>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </>
            )}
          </select>
        </>
      )}

      {/* Avatar initials */}
      {widget.type === 'avatar' && (
        <>
          <div className={styles.label}>Initials</div>
          <input
            type="text"
            className={styles.textInput}
            value={widget.text || ''}
            maxLength={3}
            onChange={handleTextChange('text')}
          />
        </>
      )}

      {/* TabBar tabs */}
      {widget.type === 'tabbar' && (
        <>
          <div className={styles.label}>Tabs</div>
          {(widget.tabs || []).map((tab, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={tab}
                onChange={handleOptionChange('tabs', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('tabs', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('tabs')}>+ Add tab</button>
          <div className={styles.label}>Active Tab</div>
          <select className={styles.selectInput} value={widget.activeTab ?? 0}
            onChange={(e) => update(widget.id, { activeTab: parseInt(e.target.value, 10) })}>
            {(widget.tabs || []).map((tab, i) => (
              <option key={i} value={i}>{tab}</option>
            ))}
          </select>
        </>
      )}

      {/* MenuBar menus */}
      {widget.type === 'menubar' && (
        <>
          <div className={styles.label}>Menus</div>
          {(widget.menus || []).map((m, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={m}
                onChange={handleOptionChange('menus', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('menus', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('menus')}>+ Add menu</button>
        </>
      )}

      {/* Breadcrumb items */}
      {widget.type === 'breadcrumb' && (
        <>
          <div className={styles.label}>Items</div>
          {(widget.items || []).map((item, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={item}
                onChange={handleOptionChange('items', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('items', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('items')}>+ Add item</button>
        </>
      )}

      {/* StatusBar items */}
      {widget.type === 'statusbar' && (
        <>
          <div className={styles.label}>Items</div>
          {(widget.items || []).map((item, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={item}
                onChange={handleOptionChange('items', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('items', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('items')}>+ Add item</button>
        </>
      )}

      {/* List items */}
      {widget.type === 'list' && (
        <>
          <div className={styles.label}>Items</div>
          {(widget.items || []).map((item, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={item}
                onChange={handleOptionChange('items', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('items', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('items')}>+ Add item</button>
          <div className={styles.label}>Selected</div>
          <select className={styles.selectInput} value={widget.selectedIndex ?? 0}
            onChange={(e) => update(widget.id, { selectedIndex: parseInt(e.target.value, 10) })}>
            {(widget.items || []).map((item, i) => (
              <option key={i} value={i}>{item}</option>
            ))}
          </select>
        </>
      )}

      {/* Table */}
      {widget.type === 'table' && (
        <>
          <div className={styles.label}>Columns</div>
          {(widget.columns || []).map((col, i) => (
            <div key={i} className={styles.optionRow}>
              <input type="text" className={styles.textInput} value={col}
                onChange={handleOptionChange('columns', i)} />
              <button className={styles.removeBtn} onClick={handleRemoveOption('columns', i)}>{'\u00D7'}</button>
            </div>
          ))}
          <button className={styles.addBtn} onClick={handleAddOption('columns')}>+ Add column</button>
          <div className={styles.label}>Rows</div>
          <input type="number" className={styles.numInput} min={1} max={20}
            value={widget.rows ?? 3}
            onChange={(e) => update(widget.id, { rows: parseInt(e.target.value, 10) || 1 })} />
        </>
      )}
    </div>
  );
}
