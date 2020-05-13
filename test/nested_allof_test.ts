import * as assert from 'assert';
import dtsGenerator, { parseSchema } from '../src/core';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';

describe('nested \'allOf\' test', () => {
    it ('single \'allOf\' nesting schema', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/nested/allOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            allOf: [
                {
                    type: 'object',
                    properties: {
                        a: { type: 'string' }
                    }
                },
                {
                    type: 'object',
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                b: { type: 'string' }
                            }
                        },
                        {
                            type: 'object',
                            properties: {
                                c: { type: 'string' }
                            }
                        },
                    ]
                }
            ],
            required: ['a', 'b', 'c'],
        };
        const result = await dtsGenerator({contents: [parseSchema(schema)]});

        const expected = `declare namespace Test {
    namespace Nested {
        export interface AllOf {
            a: string;
            b: string;
            c: string;
        }
    }
}
`;
        assert.equal(result, expected, 'Nested \'allOf\' definitions should result in all properties being included in the output interface.');
    });
    it ('multiple \'allOf\' nestings schema', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/nested/allOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            allOf: [
                {
                    type: 'object',
                    properties: {
                        a: { type: 'string' }
                    }
                },
                {
                    type: 'object',
                    allOf: [
                        {
                            type: 'object',
                            properties: {
                                b: { type: 'string' }
                            }
                        },
                        {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'string' }
                                    }
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        d: { type: 'string' }
                                    }
                                }
                            ]
                        },
                        {
                            type: 'object',
                            allOf: [
                                {
                                    type: 'object',
                                    properties: {
                                        c: { type: 'string' }
                                    }
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        e: { type: 'string' }
                                    }
                                },
                                {
                                    type: 'object',
                                    properties: {
                                        f: { type: 'string' }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            required: ['a', 'b', 'c', 'd', 'e', 'f'],
        };
        const result = await dtsGenerator({contents: [parseSchema(schema)]});

        const expected = `declare namespace Test {
    namespace Nested {
        export interface AllOf {
            a: string;
            b: string;
            c: string;
            d: string;
            e: string;
            f: string;
        }
    }
}
`;
        assert.equal(result, expected, 'Nested \'allOf\' definitions should result in all properties being included in the output interface.');
    });
});
