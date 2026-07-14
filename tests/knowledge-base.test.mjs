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

const projectSchema = await json('../data/project-schema.json');
const customerSchema = await json('../data/customer-schema.json');
const countrySchema = await json('../data/country-schema.json');
const project = await json('../data/projects/example-project.json');
const customer = await json('../data/customers/example-customer.json');
const country = await json('../data/countries/example-country.json');
const template = await json('../data/templates/project-template.json');

for (const schema of [projectSchema, customerSchema, countrySchema]) {
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assertChineseDescriptions(schema);
}

assert.equal(project.customer.id, customer.customerId);
assert.equal(project.country, country.countryCode);
assert.equal(customer.countryCode, country.countryCode);
assert.ok(customer.historicalProjectIds.includes(project.project.id));
assert.equal(project.tunnelParameters.tunnelType, 'railway');
assert.equal(project.trolleyParameters.length, 12);
assert.equal(project.trolleyParameters.referenceWeight, 124);
assert.equal(project.trolleyParameters.confirmedWeight, null);
assert.equal(project.smartConfigurations.length, 5);
assert.ok(Object.values(project.quotationParameters).every((value) => value === null));
assert.ok(project.smartConfigurations.every((item) => item.approvedPrice === null));
assert.deepEqual(project.files, []);
assert.equal(project.status, 'draft');
assert.deepEqual(customer.contacts, []);
assert.ok(country.languages.length > 0);
assert.ok(country.currencies.length > 0);
assert.deepEqual(country.transportNotes, []);
assert.equal(template.targetSchema, '../project-schema.json');

console.log('Knowledge Base schemas: PASS');
console.log('Chinese field descriptions: PASS');
console.log('Project/customer/country relations: PASS');
console.log('No fabricated prices or contacts: PASS');
