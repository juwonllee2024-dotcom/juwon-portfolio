import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projects} from '../public/catalog.mjs';
const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
test('readable journey preserves direct navigation and puts the three core works last',()=>{
  assert.deepEqual([...html.matchAll(/data-story-chapter="([^"]+)"/g)].map(m=>m[1]),['spark','constellation','work','convergence','core']);
  const story=html.slice(html.indexOf('id="journey"'),html.indexOf('id="works"'));
  const core=story.slice(story.indexOf('data-story-chapter="core"'));
  assert.deepEqual([...core.matchAll(/data-project="([^"]+)"/g)].map(m=>m[1]),['kraude','secondbrain3d','antistudy']);
  assert.doesNotMatch(story.slice(0,story.indexOf('data-story-chapter="core"')),/KRAUDE|AntiStudy|Second Brain/);
  for(const id of ['works','selected','projects','about','detail','search','work-search'])assert.ok(html.includes('id="'+id+'"'));
  assert.match(html,/<a[^>]+href="#works"[^>]*>작품 바로 보기/);
});
test('no-WebGL document contains honest core screenshots, accessible words and motion control',()=>{
  assert.match(html,/<canvas[^>]+aria-hidden="true"/);
  assert.match(html,/<button[^>]+id="motion-toggle"[^>]+aria-pressed="(?:true|false)"/);
  assert.match(html,/작은 호기심 하나에서…/);
  const readable=html.replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]*>/g,'').replace(/\s+/g,' ');
  assert.match(readable,/그리고, 하나의 세계가 되었다\./);
  for(const id of ['kraude','secondbrain3d','antistudy']){
    const project=projects.find(p=>p.id===id),shot=project.exhibit.shots[0];
    const start=html.indexOf('data-core-id="'+id+'"'),end=html.indexOf('</article>',start),article=html.slice(start,end);
    assert.ok(article.includes(shot.src));
    assert.ok(article.includes(shot.caption));
    assert.ok(article.includes(project.description));
  }
});
