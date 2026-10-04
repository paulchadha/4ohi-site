import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { accountNavigation } from './account-navigation.mjs';

assert.equal(accountNavigation(''), '');
assert.equal(accountNavigation('https://account.4ohi.com'), '<a class="nav-account" href="https://account.4ohi.com/login">Sign in</a>');
for (const value of ['javascript:alert(1)', 'http://account.4ohi.com', 'https://example.com/?x=1', 'https://user:secret@example.com']) assert.throws(() => accountNavigation(value));

const root = resolve(import.meta.dirname, '..');
const scratch = mkdtempSync(join(tmpdir(), '4ohi-static-check-'));
try {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (['.git', 'account-app', 'docs', 'node_modules'].includes(entry.name)) continue;
    cpSync(join(root, entry.name), join(scratch, entry.name), { recursive: entry.isDirectory() });
  }
  const env = { ...process.env, ACCOUNT_BASE_URL: '' };
  execFileSync(process.execPath, ['scripts/build-site.mjs'], { cwd: scratch, env, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/validate-site.mjs'], { cwd: scratch, env, stdio: 'pipe' });
  const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (['.git','account-app','docs','node_modules'].includes(e.name) ? [] : files(join(directory,e.name))) : e.name.endsWith('.html') ? [join(directory,e.name)] : []);
  const pages = files(root).filter(p => !p.includes('account-app') && !p.includes('.git'));
  // Existing mirrored assets use mixed CRLF/LF; ignore only generated cache-fingerprint values.
  const normalize = text => text.replaceAll('\r\n','\n').replace(/\?v=[a-f0-9]{12}/g,'?v=FINGERPRINT');
  for (const file of pages) assert.ok(normalize(readFileSync(join(scratch,file.slice(root.length+1)),'utf8'))===normalize(readFileSync(file,'utf8')), 'Existing page markup changed with accounts disabled: '+file);
  execFileSync(process.execPath, ['scripts/build-site.mjs'], { cwd: scratch, env: { ...env, ACCOUNT_BASE_URL: 'https://account.4ohi.com' }, stdio: 'pipe' });
  assert.match(readFileSync(join(scratch,'index.html'),'utf8'), /https:\/\/account\.4ohi\.com\/login/);
  assert.match(readFileSync(join(scratch,'palace-play.html'),'utf8'), /palace-web\.js/);
  console.log(`PASS account navigation opt-in, invalid-origin rejection, static build/validation, and ${pages.length} unchanged HTML page markup (cache fingerprints normalized) with accounts disabled.`);
} finally {
  // This exact absolute path was created by mkdtemp in the system temporary directory.
  if (resolve(scratch).startsWith(resolve(tmpdir()) + '\\') || resolve(scratch).startsWith(resolve(tmpdir()) + '/')) rmSync(scratch, { recursive: true, force: true });
}
