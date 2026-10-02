#!/usr/bin/env node
// Prepare a documented, identity-verified hotel photo without changing its scene.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, token, index, all) => {
  if (token.startsWith('--') && all[index + 1] && !all[index + 1].startsWith('--')) {
    pairs.push([token.slice(2), all[index + 1]]);
  }
  return pairs;
}, []));
const source = args.source && path.resolve(args.source);
const file = args.file;
const width = Number(args.width);
if (!source || !file || !Number.isInteger(width) || width < 320 || width > 2560 ||
    !/^assets\/images\/[a-z0-9-]+\.webp$/.test(file)) {
  console.error('Usage: node scripts/prepare-authorized-photo.mjs --source /absolute/original.jpg --file assets/images/property-01.webp --width 1280');
  process.exit(2);
}
if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
  console.error('Source file does not exist: ' + source);
  process.exit(2);
}
const registry = JSON.parse(fs.readFileSync(path.join(root, 'src/data/image-rights.json'), 'utf8'));
const record = registry.images.find(image => image.file === file);
const authorized = record?.status === 'authorized' && record.rightsHolder &&
  record.authorizationType && record.evidenceDocument && record.authorizedAt &&
  (!record.property || (record.identityVerified === true && record.identityEvidenceDocument));
if (!authorized) {
  console.error('Photo is not approved in src/data/image-rights.json: ' + file);
  process.exit(1);
}
const run = (program, argv) => {
  const result = spawnSync(program, argv, { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    throw new Error((result.error?.message || result.stderr || program + ' failed').trim());
  }
  return result.stdout.trim();
};
const originalWidth = Number(run('magick', [source, '-auto-orient', '-format', '%w', 'info:']));
if (!Number.isInteger(originalWidth) || originalWidth < width) {
  console.error('Source width ' + originalWidth + 'px is insufficient for requested ' + width + 'px; obtain a larger original.');
  process.exit(1);
}
const target = path.join(root, file);
const temporary = target + '.preparing.webp';
try {
  // Preserve the full scene and aspect ratio. Crop in CSS only after visual review.
  run('magick', [source, '-auto-orient', '-colorspace', 'sRGB', '-resize',
    width + 'x>', '-strip', '-quality', '82', 'webp:' + temporary]);
  fs.renameSync(temporary, target);
  console.log(file + ': ' + run('magick', ['identify', '-format', '%wx%h', target]) +
    ', ' + Math.round(fs.statSync(target).size / 1024) + ' KB');
} finally {
  if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
}
