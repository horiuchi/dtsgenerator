import assert from 'assert';
import { clear } from '../src/commandOptions';
import dtsgenerator from '../src/core';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { parseSchema } from '../src/core/type';

describe('array strict size test', () => {
    afterEach(() => {
        clear();
    });

    it('no min', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictNoMin {
        id?: number;
        array?: ("NW" | "NE" | "SW" | "SE")[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min equal to zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_items_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 0,
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinItemsZero {
        id?: number;
        array?: ("NW" | "NE" | "SW" | "SE")[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_items_greater_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinItemsGreaterZero {
        id?: number;
        array?: [
            ("NW" | "NE" | "SW" | "SE"),
            ("NW" | "NE" | "SW" | "SE"),
            ...("NW" | "NE" | "SW" | "SE")[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than max', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_items_less_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 3,
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinItemsLessMax {
        id?: number;
        array?: [
            ("NW" | "NE" | "SW" | "SE"),
            ("NW" | "NE" | "SW" | "SE"),
            ("NW" | "NE" | "SW" | "SE")?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min equal to max', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_items_equal_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinItemsEqualMax {
        id?: number;
        array?: [
            ("NW" | "NE" | "SW" | "SE"),
            ("NW" | "NE" | "SW" | "SE")
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than max', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_items_greater_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 1,
                    items: {
                        type: 'string',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                    },
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinItemsGreaterMax {
        id?: number;
        array?: never;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, no minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_object_empty_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: {},
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictObjectEmptyNoMin {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_with_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: {},
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictWithMin {
        id?: number;
        array?: [
            any,
            any,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with maxItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_with_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: {},
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictWithMax {
        id?: number;
        array?: [
            any?,
            any?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with minItems zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_min_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 0,
                    items: {},
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMinZero {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with maxItems zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_strict_max_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 0,
                    items: {},
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: { strictArraySize: true },
        });

        const expected = `declare namespace Test {
    export interface IncArrayStrictMaxZero {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
});
