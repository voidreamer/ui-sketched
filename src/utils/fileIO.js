import yaml from 'js-yaml';
import { syncIdCounter } from './idGenerator';

const S3_BUCKET = 'ui-sketched-frontend';
const S3_REGION = 'ca-central-1';
const SKETCHES_PREFIX = 'sketches/';

function stripTransient(widgets) {
  return widgets.map(({ open, ...rest }) => rest);
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toYAML(widgets) {
  return yaml.dump({ version: 1, widgets: stripTransient(widgets) }, { lineWidth: 120 });
}

function parseFile(text, filename) {
  let data;
  if (filename.endsWith('.json')) {
    data = JSON.parse(text);
  } else {
    data = yaml.load(text);
  }
  const widgets = data?.widgets ?? data;
  if (!Array.isArray(widgets)) {
    throw new Error('File does not contain a valid widgets array');
  }
  syncIdCounter(widgets);
  return widgets;
}

// --- S3 operations (via pre-signed or public URLs) ---

function s3Url(key) {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

export async function saveToS3(widgets, name) {
  const key = `${SKETCHES_PREFIX}${name}.yaml`;
  const body = toYAML(widgets);
  const res = await fetch(s3Url(key), {
    method: 'PUT',
    headers: { 'Content-Type': 'text/yaml' },
    body,
  });
  if (!res.ok) throw new Error(`S3 save failed: ${res.status}`);
  return key;
}

export async function loadFromS3(name) {
  const key = `${SKETCHES_PREFIX}${name}.yaml`;
  const res = await fetch(s3Url(key));
  if (!res.ok) throw new Error(`S3 load failed: ${res.status}`);
  const text = await res.text();
  return parseFile(text, key);
}

export async function listS3Sketches() {
  const res = await fetch(
    s3Url(`?list-type=2&prefix=${SKETCHES_PREFIX}`)
  );
  if (!res.ok) return [];
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  const keys = [...xml.querySelectorAll('Key')].map((k) => k.textContent);
  return keys
    .filter((k) => k.endsWith('.yaml'))
    .map((k) => k.replace(SKETCHES_PREFIX, '').replace('.yaml', ''));
}

// --- Local file operations ---

export function downloadLocal(widgets) {
  triggerDownload(toYAML(widgets), 'ui-sketch.yaml', 'text/yaml');
}

export function loadLocal(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.yaml,.yml';
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const widgets = parseFile(evt.target.result, file.name);
        callback(widgets);
      } catch (err) {
        console.error('Failed to load file:', err);
      }
    };
    reader.readAsText(file);
  });
  input.click();
}
