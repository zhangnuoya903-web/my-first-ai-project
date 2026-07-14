import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function json(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
}

function assertChineseDescriptions(schema, path = schema.title || 'schema') {
  if (!schema.properties) return;
  for (const [name, definition] of Object.entries(schema.properties)) {
    assert.equal(typeof definition.description, 'string', `${path}.${name} 缺少中文 description`);
    assert.match(definition.description, /[\u4e00-\u9fff]/, `${path}.${name} description 不是中文`);
    assertChineseDescriptions(definition, `${path}.${name}`);
    if (definition.items && !Array.isArray(definition.items)) {
      assertChineseDescriptions(definition.items, `${path}.${name}[]`);
    }
  }
}

const customerSchema = await json('../data/customer-schema.json');
const opportunitySchema = await json('../data/opportunity-schema.json');
const customer = await json('../data/customers/example-customer.json');
const opportunity = await json('../data/opportunities/example-opportunity.json');

assertChineseDescriptions(customerSchema);
assertChineseDescriptions(opportunitySchema);

const stages = [
  'lead',
  'contacted',
  'technical_discussion',
  'quotation_sent',
  'negotiation',
  'won',
  'lost'
];
assert.deepEqual(opportunitySchema.properties.stage.enum, stages);
assert.equal(opportunity.customerId, customer.customerId);
assert.equal(opportunity.countryCode, customer.countryCode);
assert.equal(customer.companyName, '示例客户（非真实数据）');
assert.deepEqual(customer.contacts, []);
assert.equal(opportunity.estimatedAmount.amount, null);
assert.equal(opportunity.estimatedAmount.status, 'unverified');
assert.equal(opportunity.nextAction.action, null);
assert.equal(opportunity.projectId, null);
assert.equal(opportunity.stage, 'lead');

console.log('CRM schemas: PASS');
console.log('Chinese field descriptions: PASS');
console.log('Sales stages: PASS');
console.log('Customer/opportunity relation: PASS');
console.log('No fabricated contacts, amount, action or project: PASS');
