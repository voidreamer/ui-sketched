let counter = 0;

export function nextId() {
  return `w-${++counter}`;
}

export function syncIdCounter(widgets) {
  let max = 0;
  for (const w of widgets) {
    const match = w.id && w.id.match(/^w-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  }
  counter = max;
}
