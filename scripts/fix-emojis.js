#!/usr/bin/env node
/**
 * Replace wizard emojis with Material Icons across all HTML pages.
 * Also adds Material Icons font link to pages that lack it.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

// Map: emoji (or emoji sequence) → Material Icons ligature name
const PLAN_ICONS = {
  '🛏️': 'bed',
  '☀️': 'wb_sunny',
  '🍽️': 'restaurant',
  '🎉': 'celebration',
  '🤝': 'handshake',
};

const OCCASION_ICONS = {
  '👨‍👩‍👧': 'family_restroom',
  '💑': 'favorite',
  '💍': 'diamond',
  '🎂': 'cake',
  '💒': 'church',
  '🎓': 'school',
  '👥': 'group',
  '✨': 'auto_awesome',
};

const PREF_ICONS = {
  '🏊': 'pool',
  '🛁': 'hot_tub',
  '💆': 'spa',
  '🍽️': 'restaurant',
  '🐾': 'pets',
  '🏛️': 'account_balance',
  '🌿': 'nature',
  '🚌': 'directions_bus',
  '♿': 'accessible',
};

// Occasion button: emoji appears at start of button inner text (before label)
// Pref button: same pattern
const FONT_LINK = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">';

function mi(name) {
  return `<span class="material-icons">${name}</span>`;
}

function replaceAll(str) {
  // 1. Plan icon spans: <span class="lw-plan-icon">EMOJI</span>
  for (const [emoji, icon] of Object.entries(PLAN_ICONS)) {
    // Escape emoji for use in regex — use literal string replace
    str = str.split(`<span class="lw-plan-icon">${emoji}</span>`)
             .join(`<span class="lw-plan-icon">${mi(icon)}</span>`);
  }

  // 2. Occasion buttons: emoji followed by space then label text
  for (const [emoji, icon] of Object.entries(OCCASION_ICONS)) {
    // Pattern: emoji + space inside button text
    str = str.split(emoji + ' ').join(mi(icon) + ' ');
  }

  // 3. Pref buttons (same pattern but 🍽️ and 🤝 already covered above)
  for (const [emoji, icon] of Object.entries(PREF_ICONS)) {
    str = str.split(emoji + ' ').join(mi(icon) + ' ');
  }

  // 4. Occasion 🤝 (no trailing space in some cases, match standalone too)
  str = str.split('🤝 ').join(mi('handshake') + ' ');

  // 5. Preliminary icon: <div class="lw-preliminary-icon"...>🔍</div>
  str = str.split('>🔍<').join(`>${mi('search')}<`);

  // 6. Success check ✓ → check_circle icon
  str = str.split('>✓<').join(`>${mi('check_circle')}<`);

  // 7. Add Material Icons font if missing
  if (!str.includes('fonts.googleapis.com/icon') && !str.includes('material-icons')) {
    // Insert after first <link rel="stylesheet"... or after </title>
    str = str.replace('</title>', `</title>\n  ${FONT_LINK}`);
  }

  return str;
}

// Get list of affected HTML files
const output = execSync(
  'grep -rl "lw-plan-icon\\|lw-occasion-btn\\|lw-pref-btn" --include="*.html" .',
  { cwd: ROOT, encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

let changed = 0;
for (const rel of output) {
  const file = path.join(ROOT, rel);
  const original = fs.readFileSync(file, 'utf8');
  const updated = replaceAll(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('✓', rel);
    changed++;
  } else {
    console.log('–', rel, '(no change)');
  }
}
console.log(`\nDone. ${changed} files updated.`);
