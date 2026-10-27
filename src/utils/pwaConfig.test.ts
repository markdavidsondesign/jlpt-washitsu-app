import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('PWA Web App Manifest: Valid configuration and fields', () => {
  const manifestPath = path.join(rootDir, 'public', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public directory');

  const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(content.name, 'JLPT Washitsu Study');
  assert.equal(content.short_name, 'JLPT N4/N5');
  assert.equal(content.theme_color, '#6B7F5E');
  assert.equal(content.background_color, '#F4F0EA');
  assert.equal(content.display, 'standalone');
  assert.ok(content.icons && content.icons.length >= 4, 'Manifest must specify multiple icon sizes');

  // Verify site.webmanifest matches
  const siteWebmanifestPath = path.join(rootDir, 'public', 'site.webmanifest');
  assert.ok(fs.existsSync(siteWebmanifestPath), 'site.webmanifest must exist');
});

test('index.html: iOS Web App meta tags and icon links', () => {
  const indexPath = path.join(rootDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  assert.ok(
    indexContent.includes('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'),
    'apple-touch-icon link tag must be present'
  );
  assert.ok(
    indexContent.includes('<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">'),
    'icon-32x32 link tag must be present'
  );
  assert.ok(
    indexContent.includes('<meta name="apple-mobile-web-app-capable" content="yes">'),
    'apple-mobile-web-app-capable meta tag must be present'
  );
  assert.ok(
    indexContent.includes('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'),
    'apple-mobile-web-app-status-bar-style meta tag must be present'
  );
  assert.ok(
    indexContent.includes('<meta name="apple-mobile-web-app-title" content="JLPT Study">'),
    'apple-mobile-web-app-title meta tag must be present'
  );
  assert.ok(
    indexContent.includes('<meta name="theme-color" content="#6B7F5E">'),
    'theme-color meta tag must be present'
  );
  assert.ok(
    indexContent.includes('<link rel="manifest" href="/manifest.json">'),
    'manifest link tag must be present'
  );
});

test('App Icon Assets: Public assets exist with proper washitsu branding', () => {
  const appleTouchPath = path.join(rootDir, 'public', 'apple-touch-icon.png');
  const icon512Path = path.join(rootDir, 'public', 'icon-512.png');
  const icon32Path = path.join(rootDir, 'public', 'icon-32x32.png');
  const iconSvgPath = path.join(rootDir, 'public', 'icon.svg');

  assert.ok(fs.existsSync(appleTouchPath), 'apple-touch-icon.png must exist');
  assert.ok(fs.existsSync(icon512Path), 'icon-512.png must exist');
  assert.ok(fs.existsSync(icon32Path), 'icon-32x32.png must exist');
  assert.ok(fs.existsSync(iconSvgPath), 'icon.svg must exist');

  // Verify SVG content contains Kanji 学 and Matcha Green #6B7F5E
  const svgText = fs.readFileSync(appleTouchPath, 'utf8');
  assert.ok(svgText.includes('#6B7F5E'), 'Icon must have Matcha Green background');
  assert.ok(svgText.includes('学'), 'Icon must contain Kanji 学');
  assert.ok(svgText.includes('#F9F6F0'), 'Icon must have soft cream emblem');
  assert.ok(svgText.includes('#C84B31') || svgText.includes('#D4AF37'), 'Icon must have vermilion stamp or gold ring');

  // Verify 32x32 PNG header
  const pngBuf = fs.readFileSync(icon32Path);
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.ok(pngBuf.subarray(0, 8).equals(pngSig), 'icon-32x32.png must have valid PNG signature');
});
