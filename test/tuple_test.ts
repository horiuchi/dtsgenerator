import assert from 'assert';
import dtsgenerator from '../src/core';
import { clearToDefault } from '../src/core/config';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { parseSchema } from '../src/core/type';

describe('tuple test', () => {
    afterEach(() => {
        clearToDefault();
    });

    it('no min', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: [
            string?,
            number?,
            boolean?,
            ("NW" | "NE" | "SW" | "SE")?,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('no min, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_no_min_additional_items',
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
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMinAdditionalItems {
        id?: number;
        array?: [
            string?,
            number?,
            boolean?,
            ("NW" | "NE" | "SW" | "SE")?,
            ...number[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('no min, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_no_min_additional_items_false',
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
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMinAdditionalItemsFalse {
        id?: number;
        array?: [
            string?,
            number?,
            boolean?,
            ("NW" | "NE" | "SW" | "SE")?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than length', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [
            string,
            number,
            boolean?,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than length, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length_additional_items',
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
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLengthAdditionalItems {
        id?: number;
        array?: [
            string,
            number,
            boolean?,
            ...number[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than length, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_less_length_additional_items_false',
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
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLengthAdditionalItemsFalse {
        id?: number;
        array?: [
            string,
            number,
            boolean?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min eql to length', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsEqlLength {
        id?: number;
        array?: [
            string,
            number,
            boolean,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min eql to length, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_eql_length_additional_items',
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
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsEqlLengthAdditionalItems {
        id?: number;
        array?: [
            string,
            number,
            boolean,
            ...number[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min eql to length, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_eql_length_additional_items_false',
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
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsEqlLengthAdditionalItemsFalse {
        id?: number;
        array?: [
            string,
            number,
            boolean
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than length', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsGreaterLength {
        id?: number;
        array?: [
            string,
            number,
            boolean,
            any,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than length, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_greater_length_additional_items',
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
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsGreaterLengthAdditionalItems {
        id?: number;
        array?: [
            string,
            number,
            boolean,
            number,
            ...number[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than length, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_items_greater_length_additional_items_false',
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
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsGreaterLengthAdditionalItemsFalse {
        id?: number;
        array?: never;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, no minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_no_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMin {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, no minItems, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_no_min_additional_items',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [],
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMinAdditionalItems {
        id?: number;
        array?: number[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, no minItems, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_no_min_additional_items_false',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [],
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleNoMinAdditionalItemsFalse {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than length and max equals length', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinItemsLessLength {
        id?: number;
        array?: [
            string,
            number,
            boolean?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min less than length and max less than length too', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_max_items_less_length',
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinMaxItemsLessLength {
        id?: number;
        array?: [
            string,
            number?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min and max equals length', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_max_items_equal_length',
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinMaxItemsEqualLength {
        id?: number;
        array?: [
            string,
            number
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('max less than min', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_max_items_less_min',
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMaxItemsLessMin {
        id?: number;
        array?: never;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_min',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: [],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMin {
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

    it('items.length zero, with minItems, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_min_additional_items',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: [],
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMinAdditionalItems {
        id?: number;
        array?: [
            number,
            number,
            ...number[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with minItems, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_min_additional_items_false',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 2,
                    items: [],
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMinAdditionalItemsFalse {
        id?: number;
        array?: never;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with maxItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_max',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: [],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMax {
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

    it('items.length zero, with maxItems, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_max_additional_items',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: [],
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMaxAdditionalItems {
        id?: number;
        array?: [
            number?,
            number?
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with maxItems, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_with_max_additional_items_false',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 2,
                    items: [],
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleWithMaxAdditionalItemsFalse {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with minItems zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 0,
                    items: [],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinZero {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with minItems zero, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_zero_additional_items',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 0,
                    items: [],
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinZeroAdditionalItems {
        id?: number;
        array?: number[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with minItems zero, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_min_zero_additional_items_false',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    minItems: 0,
                    items: [],
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMinZeroAdditionalItemsFalse {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with maxItems zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_max_zero',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 0,
                    items: [],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMaxZero {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with maxItems zero, additionalItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_max_zero_additional_items',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 0,
                    items: [],
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMaxZeroAdditionalItems {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items.length zero, with maxItems zero, additionalItems false', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_tuple_max_zero_additional_items_false',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    maxItems: 0,
                    items: [],
                    additionalItems: false,
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncTupleMaxZeroAdditionalItemsFalse {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
});
