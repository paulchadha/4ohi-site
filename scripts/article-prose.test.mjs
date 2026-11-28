import test from 'node:test';
import assert from 'node:assert/strict';
import { articleBody, validateArticleProse } from './article-prose.mjs';

test('legacy plain prose keeps escaping and exact markup', () => {
  assert.equal(articleBody({body:[{heading:'A & B',paragraphs:['<script>"Hello"</script> & it\'s fine.']}]}), '<h2>A &amp; B</h2><p>&lt;script&gt;&quot;Hello&quot;&lt;/script&gt; &amp; it&#39;s fine.</p>');
});
test('opening paragraphs precede sections and approved links preserve visible text', () => {
  assert.equal(articleBody({intro:['The opening.'],body:[{heading:'The board',paragraphs:['See the public Palace leaderboard, then return.']}],inlineLinks:[{text:'public Palace leaderboard',href:'https://4ohi.com/palace-leaderboard.html'}]}), '<p>The opening.</p><h2>The board</h2><p>See the <a href="https://4ohi.com/palace-leaderboard.html">public Palace leaderboard</a>, then return.</p>');
});

test('a short approved story can contain paragraphs without invented section headings', () => {
  assert.equal(articleBody({intro:['First approved paragraph.','Second approved paragraph.'],body:[]}), '<p>First approved paragraph.</p><p>Second approved paragraph.</p>');
});

test('approved emphasis preserves literal visible words without interpreting Markdown or HTML', () => {
  assert.equal(articleBody({intro:['Reel Fun of the Lakes, then Reel Fun of the Sea.'],body:[],inlineStrong:['Reel Fun of the Lakes','Reel Fun of the Sea']}), '<p><strong>Reel Fun of the Lakes</strong>, then <strong>Reel Fun of the Sea</strong>.</p>');
  assert.equal(articleBody({intro:['<b>Fish</b> & **literal**'],body:[],inlineStrong:['<b>Fish</b>']}), '<p><strong>&lt;b&gt;Fish&lt;/b&gt;</strong> &amp; **literal**</p>');
});

test('malformed or duplicate emphasis labels are refused', () => {
  for (const inlineStrong of ['Fish',[null],[' '],['Fish','Fish']]) assert.throws(()=>validateArticleProse({inlineStrong}));
});
test('HTML in labels and surrounding text is escaped; Markdown is not implicitly parsed', () => {
  const text='<b>Board</b> & [unapproved](javascript:alert)';
  assert.equal(articleBody({body:[{heading:'Safe',paragraphs:[text]}],inlineLinks:[{text:'<b>Board</b>',href:'https://4ohi.com/palace-leaderboard.html?x=1&y=2'}]}), '<h2>Safe</h2><p><a href="https://4ohi.com/palace-leaderboard.html?x=1&amp;y=2">&lt;b&gt;Board&lt;/b&gt;</a> &amp; [unapproved](javascript:alert)</p>');
});
test('unsafe or deceptive link targets fail before rendering', () => {
  for (const href of ['javascript:alert(1)','data:text/html,bad','http://4ohi.com/','https://4ohi.com.evil.example/','https://name@4ohi.com/','https://4ohi.com/\n']) assert.throws(()=>articleBody({body:[],inlineLinks:[{text:'board',href}]}));
});
test('malformed opening paragraphs and duplicate labels fail', () => {
  for (const intro of ['paragraph',[null],[' ']]) assert.throws(()=>validateArticleProse({intro}));
  assert.throws(()=>validateArticleProse({inlineLinks:[{text:'board',href:'https://4ohi.com/a'},{text:'board',href:'https://4ohi.com/b'}]}));
});
