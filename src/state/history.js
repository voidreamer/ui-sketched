import { useReducer, useCallback, useMemo } from 'react';

const MAX_HISTORY = 50;

const TRANSIENT_ACTIONS = new Set([
  'DRAG_START',
  'DRAG_MOVE',
  'DRAG_END',
  'SET_SNAP_GUIDES',
  'SET_SELECTION_RECT',
  'CLEAR_TRANSIENT',
  'DESELECT_ALL',
  'SELECT',
  'SELECT_ADD',
  'SELECT_TOGGLE',
  'SELECT_RECT',
]);

function historyReducer(innerReducer) {
  return function (historyState, action) {
    const { past, present, future } = historyState;

    switch (action.type) {
      case '@@UNDO': {
        if (past.length === 0) return historyState;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future].slice(0, MAX_HISTORY),
        };
      }

      case '@@REDO': {
        if (future.length === 0) return historyState;
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present].slice(-MAX_HISTORY),
          present: next,
          future: newFuture,
        };
      }

      default: {
        const newPresent = innerReducer(present, action);

        // If state didn't change, return as-is
        if (newPresent === present) return historyState;

        // Transient actions don't affect history
        if (TRANSIENT_ACTIONS.has(action.type)) {
          return {
            past,
            present: newPresent,
            future,
          };
        }

        // Normal action: push to past, clear future
        return {
          past: [...past, present].slice(-MAX_HISTORY),
          present: newPresent,
          future: [],
        };
      }
    }
  };
}

export function useHistoryReducer(reducer, initialState) {
  const wrappedReducer = useMemo(() => historyReducer(reducer), [reducer]);

  const [historyState, rawDispatch] = useReducer(wrappedReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const undo = useCallback(() => rawDispatch({ type: '@@UNDO' }), []);
  const redo = useCallback(() => rawDispatch({ type: '@@REDO' }), []);

  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;

  return [historyState.present, rawDispatch, { canUndo, canRedo, undo, redo }];
}
