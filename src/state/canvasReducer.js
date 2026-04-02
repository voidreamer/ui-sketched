import { nextId } from '../utils/idGenerator';
import { rectsIntersect } from '../utils/geometry';

export const initialState = {
  widgets: [],
  selection: [],
  dragging: null,
  selectionRect: null,
  snapGuides: [],
};

export function canvasReducer(state, action) {
  switch (action.type) {
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.widget],
      };

    case 'UPDATE_WIDGET': {
      let widgets = state.widgets.map((w) =>
        w.id === action.id ? { ...w, ...action.patch } : w
      );

      // Handle widget linking
      const source = widgets.find((w) => w.id === action.id);
      if (source && source.linkTo) {
        // Combobox selection changed → switch linked treeview dataset
        if (action.patch.text !== undefined && source.type === 'combobox') {
          const selectedOption = action.patch.text;
          widgets = widgets.map((w) => {
            if (w.id !== source.linkTo || w.type !== 'treeview') return w;
            const dataSets = { ...(w.dataSets || {}) };
            // Save current tree state to the current active dataset
            if (w.activeDataSet) {
              dataSets[w.activeDataSet] = w.nodes || [];
            }
            // Auto-create dataset for the new option if it doesn't exist
            if (!dataSets[selectedOption]) {
              dataSets[selectedOption] = JSON.parse(JSON.stringify(w.nodes || []));
            }
            return {
              ...w,
              dataSets,
              activeDataSet: selectedOption,
              nodes: dataSets[selectedOption],
            };
          });
        }
      }

      // When a combobox establishes a new link, initialize dataSets on the target
      if (action.patch.linkTo !== undefined) {
        const src = widgets.find((w) => w.id === action.id);
        if (src && src.type === 'combobox' && src.linkTo) {
          widgets = widgets.map((w) => {
            if (w.id !== src.linkTo || w.type !== 'treeview') return w;
            if (w.dataSets && Object.keys(w.dataSets).length > 0) return w;
            // Initialize a dataset for each combobox option
            const dataSets = {};
            const baseNodes = JSON.parse(JSON.stringify(w.nodes || []));
            for (const opt of (src.options || [])) {
              dataSets[opt] = JSON.parse(JSON.stringify(baseNodes));
            }
            // Set active to the combobox's current selection if it matches
            const active = src.text && dataSets[src.text] ? src.text : null;
            return { ...w, dataSets, activeDataSet: active };
          });
        }
        // When unlinking, clear dataSets so the treeview goes back to normal
        if (!action.patch.linkTo) {
          // Find old linkTo before patch was applied
          const oldWidget = state.widgets.find((w) => w.id === action.id);
          if (oldWidget && oldWidget.linkTo && oldWidget.type === 'combobox') {
            widgets = widgets.map((w) => {
              if (w.id !== oldWidget.linkTo || w.type !== 'treeview') return w;
              return { ...w, dataSets: null, activeDataSet: null };
            });
          }
        }
      }

      return { ...state, widgets };
    }

    case 'UPDATE_WIDGETS': {
      const updateMap = new Map(action.updates.map((u) => [u.id, u.patch]));
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          updateMap.has(w.id) ? { ...w, ...updateMap.get(w.id) } : w
        ),
      };
    }

    case 'DELETE_SELECTED': {
      const selSet = new Set(state.selection);
      return {
        ...state,
        widgets: state.widgets.filter((w) => !selSet.has(w.id)),
        selection: [],
      };
    }

    case 'DUPLICATE_SELECTED': {
      const selSet = new Set(state.selection);
      const clones = [];
      for (const w of state.widgets) {
        if (selSet.has(w.id)) {
          clones.push({
            ...w,
            id: nextId(),
            x: w.x + 20,
            y: w.y + 20,
          });
        }
      }
      return {
        ...state,
        widgets: [...state.widgets, ...clones],
        selection: clones.map((c) => c.id),
      };
    }

    case 'SELECT':
      return {
        ...state,
        selection: [action.id],
      };

    case 'SELECT_ADD':
      return {
        ...state,
        selection: state.selection.includes(action.id)
          ? state.selection
          : [...state.selection, action.id],
      };

    case 'SELECT_TOGGLE':
      return {
        ...state,
        selection: state.selection.includes(action.id)
          ? state.selection.filter((id) => id !== action.id)
          : [...state.selection, action.id],
      };

    case 'SELECT_RECT': {
      const rect = action.rect;
      const ids = state.widgets
        .filter((w) => rectsIntersect(rect, { x: w.x, y: w.y, w: w.w, h: w.h }))
        .map((w) => w.id);
      return {
        ...state,
        selection: ids,
      };
    }

    case 'DESELECT_ALL':
      return {
        ...state,
        selection: [],
      };

    case 'DRAG_START':
      return {
        ...state,
        dragging: {
          widgetIds: action.widgetIds,
          offsets: action.offsets,
        },
      };

    case 'DRAG_MOVE': {
      const posMap = new Map(action.positions.map((p) => [p.id, p]));
      return {
        ...state,
        widgets: state.widgets.map((w) => {
          const pos = posMap.get(w.id);
          return pos ? { ...w, x: pos.x, y: pos.y } : w;
        }),
      };
    }

    case 'DRAG_END':
      return {
        ...state,
        dragging: null,
      };

    case 'RESIZE':
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.id === action.id ? { ...w, ...action.patch } : w
        ),
      };

    case 'MOVE_LAYER_UP': {
      const widgets = [...state.widgets];
      const idx = widgets.findIndex((w) => w.id === action.id);
      if (idx >= 0 && idx < widgets.length - 1) {
        [widgets[idx], widgets[idx + 1]] = [widgets[idx + 1], widgets[idx]];
      }
      return { ...state, widgets };
    }

    case 'MOVE_LAYER_DOWN': {
      const widgets = [...state.widgets];
      const idx = widgets.findIndex((w) => w.id === action.id);
      if (idx > 0) {
        [widgets[idx], widgets[idx - 1]] = [widgets[idx - 1], widgets[idx]];
      }
      return { ...state, widgets };
    }

    case 'MOVE_LAYER_TO_FRONT': {
      const widget = state.widgets.find((w) => w.id === action.id);
      if (!widget) return state;
      return {
        ...state,
        widgets: [...state.widgets.filter((w) => w.id !== action.id), widget],
      };
    }

    case 'MOVE_LAYER_TO_BACK': {
      const widget = state.widgets.find((w) => w.id === action.id);
      if (!widget) return state;
      return {
        ...state,
        widgets: [widget, ...state.widgets.filter((w) => w.id !== action.id)],
      };
    }

    case 'LOAD_CANVAS':
      return {
        ...state,
        widgets: action.widgets,
        selection: [],
      };

    case 'SET_SNAP_GUIDES':
      return {
        ...state,
        snapGuides: action.guides,
      };

    case 'SET_SELECTION_RECT':
      return {
        ...state,
        selectionRect: action.rect,
      };

    case 'CLEAR_TRANSIENT':
      return {
        ...state,
        snapGuides: [],
        selectionRect: null,
        dragging: null,
      };

    default:
      return state;
  }
}
