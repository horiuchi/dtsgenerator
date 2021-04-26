import assert from 'assert';
import dtsgenerator from '../src/core';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';
import { parseSchema } from '../src/core/type';

describe("'not' keyword test", () => {
    it('should ignore top-level not', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/not/top-level',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    readOnly: true,
                },
            },
            required: ['name'],
            not: {
                required: ['id'],
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Not {
        export interface TopLevel {
            readonly name: string;
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('should work with not in allOf', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/not/allOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            allOf: [
                {
                    properties: {
                        name: {
                            type: 'string',
                            readOnly: true,
                        },
                    },
                },
                {
                    required: ['name'],
                },
                {
                    not: {
                        required: ['id'],
                    },
                },
            ],
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Not {
        export interface AllOf {
            readonly name: string;
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('should work with not in oneOf', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/not/oneOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            oneOf: [
                {
                    properties: {
                        name: {
                            type: 'string',
                            readOnly: true,
                        },
                    },
                    required: ['name'],
                },
                {
                    not: {
                        required: ['id'],
                    },
                },
            ],
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Not {
        export type OneOf = {
            readonly name: string;
        } | void;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('should work with not in oneOf with strictNot disabled', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/not/oneOfStrictNotDisabled',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            oneOf: [
                {
                    properties: {
                        name: {
                            type: 'string',
                            readOnly: true,
                        },
                    },
                    required: ['name'],
                },
                {
                    not: {
                        required: ['id'],
                    },
                },
            ],
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictNot: false },
        });

        const expected = `declare namespace Test {
    namespace Not {
        export type OneOfStrictNotDisabled = {
            readonly name: string;
        } | {
            [key: string]: any;
        };
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
});
