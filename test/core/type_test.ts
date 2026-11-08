import assert from 'assert';
import { parseFileContent } from '../../src/core/type';

describe('parseFileContent YAML compatibility', () => {
    it('preserves merge keys and scalar conversion', () => {
        const yaml = `defaults: &defaults
  type: object
  required: [id]
schema:
  <<: *defaults
  properties: {}
released: 2001-12-15
word: yes
`;
        const expected = {
            defaults: { type: 'object', required: ['id'] },
            schema: {
                type: 'object',
                required: ['id'],
                properties: {},
            },
            released: '2001-12-15T00:00:00.000Z',
            word: 'yes',
        };

        for (const filename of [undefined, 'schema.yaml', 'schema.json']) {
            assert.deepStrictEqual(parseFileContent(yaml, filename), expected);
        }
    });
});
