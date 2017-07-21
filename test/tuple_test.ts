import * as assert from 'power-assert';
import dtsgenerator from '../src/';
import { initialize } from '../src/commandOptions';

describe('tuple test', () => {

    afterEach(() => {
        initialize();
    });

    it('include tuple type schema no min no max', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_no_min_no_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        {
                            type: 'string',
                            enum: ['NW', 'NE', 'SW', 'SE'],
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleNoMinNoMax {
        id?: number;
        array?: [] | [string] | [string, number] | [string, number, boolean] | [string, number, boolean, ("NW" | "NE" | "SW" | "SE")] | [string, number, boolean, ("NW" | "NE" | "SW" | "SE"), any];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min less than length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [string, number] | [string, number, boolean] | [string, number, boolean, any];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min eql length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_items_eql_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 3,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsEqlLength {
        id?: number;
        array?: [string, number, boolean] | [string, number, boolean, any];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min greater than length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_items_greater_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 4,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsGreaterLength {
        id?: number;
        array?: [string, number, boolean, Object] | [string, number, boolean, Object, any];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema max less than length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_max_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMaxItemsLessLength {
        id?: number;
        array?: [] | [string] | [string, number];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema max eql length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_max_items_eql_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 3,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMaxItemsEqlLength {
        id?: number;
        array?: [] | [string] | [string, number] | [string, number, boolean];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema max greater than length', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_max_items_greater_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 4,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMaxItemsGreaterLength {
        id?: number;
        array?: [] | [string] | [string, number] | [string, number, Object] | [string, number, Object, Object];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min and max in length range', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_max_in_range',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 4,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinMaxInRange {
        id?: number;
        array?: [string, number] | [string, number, boolean] | [string, number, boolean, string];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min and max exceeds range', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_max_in_range',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 6,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        { type: 'string' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinMaxInRange {
        id?: number;
        array?: [string, number] | [string, number, boolean] | [string, number, boolean, string] | [string, number, boolean, string, Object] | [string, number, boolean, string, Object, Object];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include tuple type schema min greater than max never', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_min_max_never',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 2,
                    items: [
                        { type: 'string' },
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleMinMaxNever {
        id?: number;
        array?: never;
    }
}
`;
        assert.equal(result, expected, result);
    });
});
