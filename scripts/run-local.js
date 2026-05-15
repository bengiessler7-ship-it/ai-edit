#!/usr/bin/env node
const { spawnSync } = require('child_process');

function ok(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  return r.status === 0;
}

console.log('🚀 EditKick Local Schnellstart');
console.log('1) Prüfe FFmpeg...');
const ff = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore', shell: process.platform === 'win32' });
if (ff.status !== 0) {
  console.log('⚠️  FFmpeg fehlt. Bitte zuerst installieren: https://ffmpeg.org/download.html');
}

console.log('2) Installiere Pakete...');
if (!ok('npm', ['install'])) {
  console.log('❌ npm install fehlgeschlagen. Prüfe Proxy/Registry-Einstellungen.');
  process.exit(1);
}

console.log('3) Starte Dev-Server...');
if (!ok('npm', ['run', 'dev'])) {
  process.exit(1);
}
