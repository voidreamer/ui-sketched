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

      // Handle widget linking: when a source widget with linkTo updates,
      // cascade the change to the linked target widget
      if (action.patch.text !== undefined) {
        const source = widgets.find((w) => w.id === action.id);
        if (source && source.linkTo) {
          const selectedOption = action.patch.text;
          widgets = widgets.map((w) => {
            if (w.id !== source.linkTo) return w;
            // combobox → treeview: switch active dataset
            if (source.type === 'combobox' && w.type === 'treeview' && w.dataSets && w.dataSets[selectedOption]) {
              return { ...w, activeDataSet: selectedOption, nodes: w.dataSets[selectedOption] };
            }
            return w;
          });
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
