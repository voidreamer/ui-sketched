import { useState } from 'react';
import { useCanvas } from '../state/CanvasContext';
import styles from './PropertiesPanel.module.css';
import { serializeTree, deserializeTree, addChildAtPath, removeAtPath, updateAtPath, getNodeAtPath } from '../widgets/TreeViewWidget';
import { serializePropertyGrid, deserializePropertyGrid } from '../widgets/PropertyGridWidget';
import { serializeToolbar, deserializeToolbar } from '../widgets/ToolbarWidget';
import { serializeTableData, deserializeTableData } from '../widgets/TableWidget';

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

          {/* Widget linking */}
          <div className={styles.label} style={{ marginTop: 8 }}>Link to widget</div>
          <select
            className={styles.selectInput}
            value={widget.linkTo || ''}
            onChange={(e) => update(widget.id, { linkTo: e.target.value || null })}
          >
            <option value="">None</option>
            {state.widgets
              .filter((w) => w.id !== widget.id && (w.type === 'treeview' || w.type === 'table' || w.type === 'list'))
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {w.type} ({w.id})
                </option>
              ))}
          </select>
          {widget.linkTo && (
            <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
              Selecting an option will switch the linked widget's dataset.
            </div>
          )}
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
        <TableProperties widget={widget} update={update} handleOptionChange={handleOptionChange} handleRemoveOption={handleRemoveOption} handleAddOption={handleAddOption} />
      )}

      {/* TreeView */}
      {widget.type === 'treeview' && (
        <TreeViewProperties widget={widget} update={update} handleOptionChange={handleOptionChange} handleRemoveOption={handleRemoveOption} handleAddOption={handleAddOption} allWidgets={state.widgets} />
      )}

      {/* PropertyGrid */}
      {widget.type === 'propertygrid' && (
        <PropertyGridProperties widget={widget} update={update} />
      )}

      {/* Toolbar */}
      {widget.type === 'toolbar' && (
        <ToolbarProperties widget={widget} update={update} />
      )}
    </div>
  );
}

function TableProperties({ widget, update, handleOptionChange, handleRemoveOption, handleAddOption }) {
  const [editingData, setEditingData] = useState(false);
  const [dataText, setDataText] = useState('');

  const startEditData = () => {
    const columns = widget.columns || [];
    const rows = widget.rows ?? 3;
    const data = widget.data || Array.from({ length: rows }, (_, ri) =>
      columns.map((_, ci) => ci === 0 ? `Item ${ri + 1}` : ci === 1 ? `${(ri + 1) * 100}` : ri % 3 === 0 ? 'Active' : ri % 3 === 1 ? 'Pending' : 'Done')
    );
    setDataText(serializeTableData(data));
    setEditingData(true);
  };

  const applyData = () => {
    const columns = widget.columns || [];
    const newData = deserializeTableData(dataText, columns.length);
    update(widget.id, { data: newData, rows: newData.length });
    setEditingData(false);
  };

  return (
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
      <input type="number" className={styles.numInput} min={1} max={50}
        value={widget.rows ?? 3}
        onChange={(e) => update(widget.id, { rows: parseInt(e.target.value, 10) || 1 })} />

      <div className={styles.label}>Alternate Rows</div>
      <label className={styles.toggleRow}>
        <input type="checkbox" checked={widget.alternateRows !== false}
          onChange={(e) => update(widget.id, { alternateRows: e.target.checked })} />
        <span>{widget.alternateRows !== false ? 'On' : 'Off'}</span>
      </label>

      <div className={styles.label}>Cell Data</div>
      {editingData ? (
        <>
          <textarea className={styles.textareaInput} rows={6} value={dataText}
            onChange={(e) => setDataText(e.target.value)}
            placeholder="Tab-separated values, one row per line" />
          <div className={styles.row}>
            <button className={styles.addBtn} onClick={applyData}>Apply</button>
            <button className={styles.addBtn} onClick={() => setEditingData(false)} style={{ color: '#888' }}>Cancel</button>
          </div>
        </>
      ) : (
        <button className={styles.addBtn} onClick={startEditData}>
          {widget.data ? 'Edit Data' : 'Set Data'}
        </button>
      )}
    </>
  );
}

function TreeViewProperties({ widget, update, handleOptionChange, handleRemoveOption, handleAddOption, allWidgets }) {
  const [editingTree, setEditingTree] = useState(false);
  const [treeText, setTreeText] = useState('');
  const nodes = widget.nodes || [];
  const columns = widget.columns || ['Name'];
  const selectedNode = getNodeAtPath(nodes, widget.selectedPath);

  const startEditTree = () => {
    setTreeText(serializeTree(nodes, columns));
    setEditingTree(true);
  };

  const applyTree = () => {
    const newNodes = deserializeTree(treeText, columns.length - 1);
    update(widget.id, { nodes: newNodes });
    setEditingTree(false);
  };

  const updateSelectedNode = (field, value) => {
    if (!widget.selectedPath) return;
    const newNodes = updateAtPath(nodes, widget.selectedPath, (n) => ({ ...n, [field]: value }));
    update(widget.id, { nodes: newNodes });
  };

  const updateSelectedNodeValue = (colIndex, value) => {
    if (!widget.selectedPath) return;
    const newNodes = updateAtPath(nodes, widget.selectedPath, (n) => {
      const vals = [...(n.values || [])];
      while (vals.length <= colIndex) vals.push('');
      vals[colIndex] = value;
      return { ...n, values: vals };
    });
    update(widget.id, { nodes: newNodes });
  };

  // Check if any combobox is linked to this treeview
  const linkedCombobox = (allWidgets || []).find(
    (w) => w.type === 'combobox' && w.linkTo === widget.id
  );

  return (
    <>
      {/* Selected node editing */}
      {selectedNode && (
        <>
          <div className={styles.label}>Selected Node</div>
          <div className={styles.optionRow}>
            <input
              type="text"
              className={styles.textInput}
              value={selectedNode.label}
              onChange={(e) => updateSelectedNode('label', e.target.value)}
              placeholder="Node label"
            />
          </div>
          {columns.slice(1).map((col, ci) => (
            <div key={ci}>
              <div className={styles.label} style={{ fontSize: 10 }}>{col}</div>
              <input
                type="text"
                className={styles.textInput}
                value={(selectedNode.values || [])[ci] || ''}
                onChange={(e) => updateSelectedNodeValue(ci, e.target.value)}
              />
            </div>
          ))}
          <div className={styles.row} style={{ marginTop: 4 }}>
            <button className={styles.addBtn} onClick={() => update(widget.id, { nodes: addChildAtPath(nodes, widget.selectedPath) })}>
              + Child
            </button>
            <button className={styles.removeBtn} onClick={() => update(widget.id, { nodes: removeAtPath(nodes, widget.selectedPath), selectedPath: null })}>
              {'\u00D7'} Remove
            </button>
          </div>
        </>
      )}
      {!selectedNode && (
        <div style={{ fontSize: 11, color: '#666', margin: '4px 0' }}>
          Click a node in the tree to edit it
        </div>
      )}

      <button className={styles.addBtn} onClick={() => update(widget.id, { nodes: addChildAtPath(nodes, null) })} style={{ marginTop: 4 }}>
        + Add root node
      </button>

      <div className={styles.label} style={{ marginTop: 8 }}>Columns</div>
      {(widget.columns || []).map((col, i) => (
        <div key={i} className={styles.optionRow}>
          <input type="text" className={styles.textInput} value={col}
            onChange={handleOptionChange('columns', i)} />
          {i > 0 && (
            <button className={styles.removeBtn} onClick={handleRemoveOption('columns', i)}>{'\u00D7'}</button>
          )}
        </div>
      ))}
      <button className={styles.addBtn} onClick={handleAddOption('columns')}>+ Add column</button>

      <div className={styles.label}>Checkboxes</div>
      <label className={styles.toggleRow}>
        <input type="checkbox" checked={!!widget.showCheckboxes}
          onChange={(e) => update(widget.id, { showCheckboxes: e.target.checked })} />
        <span>{widget.showCheckboxes ? 'On' : 'Off'}</span>
      </label>

      {/* Data Sets (for linking) */}
      {linkedCombobox && (
        <>
          <div className={styles.label} style={{ marginTop: 8 }}>Data Sets</div>
          <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>
            Linked to: {linkedCombobox.text || linkedCombobox.type}
          </div>
          <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>
            Active: {widget.activeDataSet || '(default)'}
          </div>
          {(linkedCombobox.options || []).map((opt) => {
            const isActive = widget.activeDataSet === opt;
            const hasData = widget.dataSets && widget.dataSets[opt];
            return (
              <div key={opt} className={styles.optionRow}>
                <span style={{ flex: 1, fontSize: 11, color: isActive ? '#8ab4f8' : '#ccc' }}>
                  {opt} {hasData ? '' : '(empty)'}
                </span>
                <button
                  className={styles.addBtn}
                  style={{ fontSize: 10, padding: '2px 6px' }}
                  onClick={() => {
                    // Save current nodes as this dataset, then switch
                    const dataSets = { ...(widget.dataSets || {}) };
                    // Save current state to the current active dataset
                    if (widget.activeDataSet) {
                      dataSets[widget.activeDataSet] = nodes;
                    }
                    // If this dataset doesn't exist yet, clone current nodes
                    if (!dataSets[opt]) {
                      dataSets[opt] = JSON.parse(JSON.stringify(nodes));
                    }
                    update(widget.id, {
                      dataSets,
                      activeDataSet: opt,
                      nodes: dataSets[opt],
                    });
                  }}
                >
                  {isActive ? 'editing' : 'switch'}
                </button>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            Switch dataset, edit the tree, then switch to another to set different data per option.
          </div>
        </>
      )}

      <div className={styles.label} style={{ marginTop: 8 }}>Bulk Edit</div>
      {editingTree ? (
        <>
          <textarea className={styles.textareaInput} rows={10} value={treeText}
            onChange={(e) => setTreeText(e.target.value)}
            placeholder={'Indent with 2 spaces\nUse | for columns'} style={{ fontSize: 10 }} />
          <div className={styles.row}>
            <button className={styles.addBtn} onClick={applyTree}>Apply</button>
            <button className={styles.addBtn} onClick={() => setEditingTree(false)} style={{ color: '#888' }}>Cancel</button>
          </div>
        </>
      ) : (
        <button className={styles.addBtn} onClick={startEditTree}>Edit as text</button>
      )}
    </>
  );
}

function PropertyGridProperties({ widget, update }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const groups = widget.groups || [];

  const startEdit = () => {
    setText(serializePropertyGrid(groups));
    setEditing(true);
  };

  const apply = () => {
    const newGroups = deserializePropertyGrid(text);
    update(widget.id, { groups: newGroups });
    setEditing(false);
  };

  return (
    <>
      <div className={styles.label}>Property Groups</div>
      {editing ? (
        <>
          <textarea className={styles.textareaInput} rows={12} value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'[Group Name]\nKey = Value\nColor = #fff (color)\nFlag = true (bool)'}
            style={{ fontSize: 10 }} />
          <div className={styles.row}>
            <button className={styles.addBtn} onClick={apply}>Apply</button>
            <button className={styles.addBtn} onClick={() => setEditing(false)} style={{ color: '#888' }}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>
            {groups.length} group{groups.length !== 1 ? 's' : ''}, {groups.reduce((s, g) => s + (g.properties || []).length, 0)} properties
          </div>
          <button className={styles.addBtn} onClick={startEdit}>Edit properties</button>
        </>
      )}
    </>
  );
}

function ToolbarProperties({ widget, update }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const items = widget.items || [];

  const startEdit = () => {
    setText(serializeToolbar(items));
    setEditing(true);
  };

  const apply = () => {
    const newItems = deserializeToolbar(text);
    update(widget.id, { items: newItems });
    setEditing(false);
  };

  return (
    <>
      <div className={styles.label}>Show Labels</div>
      <label className={styles.toggleRow}>
        <input type="checkbox" checked={widget.showLabels !== false}
          onChange={(e) => update(widget.id, { showLabels: e.target.checked })} />
        <span>{widget.showLabels !== false ? 'On' : 'Off'}</span>
      </label>

      <div className={styles.label}>Items</div>
      {editing ? (
        <>
          <textarea className={styles.textareaInput} rows={8} value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'icon Label\n---  (separator)\nicon Label'} style={{ fontSize: 10 }} />
          <div className={styles.row}>
            <button className={styles.addBtn} onClick={apply}>Apply</button>
            <button className={styles.addBtn} onClick={() => setEditing(false)} style={{ color: '#888' }}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>
            {items.filter((i) => i.kind !== 'separator').length} buttons, {items.filter((i) => i.kind === 'separator').length} separators
          </div>
          <button className={styles.addBtn} onClick={startEdit}>Edit items</button>
        </>
      )}
    </>
  );
}
