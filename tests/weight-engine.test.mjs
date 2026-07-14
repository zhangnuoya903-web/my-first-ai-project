import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(
  new URL('../js/weight-engine.js', import.meta.url),
  'utf8'
);
const engine = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
);

function recommendation(tunnelType, length, confirmedWeight = 0) {
  return engine.getWeightRecommendation({
    tunnelType,
    length,
    confirmedWeight
  });
}

assert.equal(recommendation('railway', 12).referenceWeight, 124);
assert.equal(recommendation('railway', 9).referenceWeight, 93);
assert.equal(recommendation('railway', 10.5).referenceWeight, 108.5);
assert.equal(recommendation('highway', 12).referenceWeight, 94.24);
assert.equal(recommendation('metro', 12).referenceWeight, 62);

const hydraulic = recommendation('hydraulic', 12);
assert.equal(hydraulic.referenceWeight, null);
assert.equal(hydraulic.confidence, 'unavailable');
assert.match(hydraulic.warning, /禁止自动估算和自动报价/);

const confirmed = recommendation('hydraulic', 12, 130);
assert.equal(confirmed.referenceWeight, 130);
assert.equal(confirmed.confidence, 'engineer-confirmed');

const nonStandard = recommendation('railway', 11);
assert.match(nonStandard.warning, /非标准长度/);

for (const item of [
  recommendation('railway', 12),
  recommendation('railway', 9),
  recommendation('highway', 12),
  recommendation('metro', 12)
]) {
  assert.match(item.warning, /历史经验参考，不替代正式设计/);
  assert.deepEqual(item.range, {
    min: item.referenceWeight,
    max: item.referenceWeight,
    unit: 'ton',
    basis: 'single-reference'
  });
}

console.log('Weight Engine V2 cases: PASS');
