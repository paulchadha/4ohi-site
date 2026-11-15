import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('homepage hero links directly to Palace and retains the public leaderboard hub', () => {
  const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const hero = home.slice(home.indexOf('<section class="production-hero production-home-hero"'), home.indexOf('</section>', home.indexOf('<section class="production-hero production-home-hero"')));
  assert.match(hero, /<div class="actions"><a class="button" href="palace-leaderboard.html">Palace leaderboard/);
  assert.match(hero, /class="button secondary" href="leaderboards.html">All leaderboards/);
  assert.match(readFileSync(new URL('../palace-leaderboard.html', import.meta.url), 'utf8'), /data-palace-leaderboard/);
  assert.match(hero, /href="games.html">Explore games/);
  assert.match(hero, /href="lifestyle-apps.html">Explore apps/);
  const hub = readFileSync(new URL('../leaderboards.html', import.meta.url), 'utf8');
  assert.match(hub, /data-game-leaderboards/);
  assert.match(hub, /thumb-command-leaderboard.html/);
});
