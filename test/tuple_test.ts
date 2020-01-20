import assert from 'power-assert';
import { clear } from '../src/commandOptions';
import dtsgenerator from '../src/core';

describe('tuple test', () => {

    afterEach(() => {
        clear();
    });

    it('no min', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: [string?, number?, boolean?, ("NW" | "NE" | "SW" | "SE")?, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min less than length', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [string, number, boolean?, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min eql to length', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsEqlLength {
        id?: number;
        array?: [string, number, boolean, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min greater than length', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsGreaterLength {
        id?: number;
        array?: [string, number, boolean, any, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('items.length zero, no minItems', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: any[];
    }
}
`;
        assert.equal(result, expected, result);
    });

    it('min less than length and max equals length', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 3,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [string, number, boolean?];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min less than length and max less than length too', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 2,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [string, number?];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('min and max equals length', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 2,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [string, number];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('max less thant min', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 3,
                    maxItems: 1,
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: never;
    }
}
`;
        assert.equal(result, expected, result);
    });

    it('items.length zero, with minItems', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: [any, any, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('items.length zero, without minItems', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_tuple_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: [
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: [any?, any?];
    }
}
`;
        assert.equal(result, expected, result);
    });
});
