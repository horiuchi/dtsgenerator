import assert from 'power-assert';
import dtsgenerator from '../src/';
import { clear } from '../src/commandOptions';

describe('tuple test', () => {

    afterEach(() => {
        clear();
    });

    it('no min', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_no_min',
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
    export interface IncTupleNoMin {
        id?: number;
        array?: [string] | [string, number] | [string, number, boolean] | [string, number, boolean, ("NW" | "NE" | "SW" | "SE")] | [string, number, boolean, ("NW" | "NE" | "SW" | "SE"), any];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min less than length', async () => {
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
    it('min eql to length', async () => {
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
    it('min greater than length', async () => {
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
    it('items.length zero, no minItems', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: any[];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('items.length zero, with minItems', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_tuple_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: [
                    ],
                },
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: [Object, Object] | [Object, Object, any];
    }
}
`;
        assert.equal(result, expected, result);
    });
});
