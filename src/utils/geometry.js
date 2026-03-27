/**
 * Returns true if rectangles a and b overlap.
 * Both have shape { x, y, w, h }.
 */
export function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Snap a value to the nearest grid line if within threshold.
 * Returns snapped value or original value.
 */
export function snapToGrid(value, gridSize = 20, threshold = 10) {
  const snapped = Math.round(value / gridSize) * gridSize;
  return Math.abs(value - snapped) <= threshold ? snapped : value;
}

/**
 * Compute alignment guides for a moving rectangle against other rectangles.
 *
 * Checks edges (left, right, top, bottom, centerX, centerY) of the moving
 * rect against all edges of every other rect. If any edge pair is within
 * the threshold, produces a snap guide and adjusts the position.
 *
 * Returns { snappedX, snappedY, guides: [{ axis, pos }] }
 */
export function computeAlignmentGuides(movingRect, otherRects, threshold = 5) {
  const guides = [];
  let snappedX = movingRect.x;
  let snappedY = movingRect.y;

  let bestDx = threshold + 1;
  let bestDy = threshold + 1;

  const movingEdges = rectEdges(movingRect);

  for (const other of otherRects) {
    const otherEdgeValues = rectEdges(other);

    // Check X-axis alignments (left, right, centerX)
    const xPairs = [
      { movingEdge: movingEdges.left, otherEdge: otherEdgeValues.left, offset: 0 },
      { movingEdge: movingEdges.right, otherEdge: otherEdgeValues.right, offset: 0 },
      { movingEdge: movingEdges.left, otherEdge: otherEdgeValues.right, offset: 0 },
      { movingEdge: movingEdges.right, otherEdge: otherEdgeValues.left, offset: 0 },
      { movingEdge: movingEdges.centerX, otherEdge: otherEdgeValues.centerX, offset: 0 },
    ];

    for (const { movingEdge, otherEdge } of xPairs) {
      const diff = Math.abs(movingEdge - otherEdge);
      if (diff <= threshold && diff < bestDx) {
        bestDx = diff;
        snappedX = movingRect.x + (otherEdge - movingEdge);
      }
    }

    // Check Y-axis alignments (top, bottom, centerY)
    const yPairs = [
      { movingEdge: movingEdges.top, otherEdge: otherEdgeValues.top },
      { movingEdge: movingEdges.bottom, otherEdge: otherEdgeValues.bottom },
      { movingEdge: movingEdges.top, otherEdge: otherEdgeValues.bottom },
      { movingEdge: movingEdges.bottom, otherEdge: otherEdgeValues.top },
      { movingEdge: movingEdges.centerY, otherEdge: otherEdgeValues.centerY },
    ];

    for (const { movingEdge, otherEdge } of yPairs) {
      const diff = Math.abs(movingEdge - otherEdge);
      if (diff <= threshold && diff < bestDy) {
        bestDy = diff;
        snappedY = movingRect.y + (otherEdge - movingEdge);
      }
    }
  }

  // Collect all guides at the snapped position
  const snappedEdges = rectEdges({ ...movingRect, x: snappedX, y: snappedY });

  for (const other of otherRects) {
    const otherEdgeValues = rectEdges(other);

    // X-axis guides
    for (const xVal of [snappedEdges.left, snappedEdges.right, snappedEdges.centerX]) {
      for (const otherXVal of [otherEdgeValues.left, otherEdgeValues.right, otherEdgeValues.centerX]) {
        if (Math.abs(xVal - otherXVal) < 1) {
          if (!guides.some((g) => g.axis === 'x' && Math.abs(g.pos - xVal) < 1)) {
            guides.push({ axis: 'x', pos: xVal });
          }
        }
      }
    }

    // Y-axis guides
    for (const yVal of [snappedEdges.top, snappedEdges.bottom, snappedEdges.centerY]) {
      for (const otherYVal of [otherEdgeValues.top, otherEdgeValues.bottom, otherEdgeValues.centerY]) {
        if (Math.abs(yVal - otherYVal) < 1) {
          if (!guides.some((g) => g.axis === 'y' && Math.abs(g.pos - yVal) < 1)) {
            guides.push({ axis: 'y', pos: yVal });
          }
        }
      }
    }
  }

  return { snappedX, snappedY, guides };
}

function rectEdges(rect) {
  return {
    left: rect.x,
    right: rect.x + rect.w,
    top: rect.y,
    bottom: rect.y + rect.h,
    centerX: rect.x + rect.w / 2,
    centerY: rect.y + rect.h / 2,
  };
}
