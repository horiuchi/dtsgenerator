import assert from 'assert';
import dtsgenerator from '../src/core';
import { clearToDefault } from '../src/core/config';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';
import { parseSchema } from '../src/core/type';

describe('array test', () => {
    afterEach(() => {
        clearToDefault();
    });

    describe('compound const/enum literals (#573)', () => {
        const cases: [string, JsonSchemaDraft07.SchemaObject, string][] = [
            ['const', { const: [1, 2] }, '[\n    1,\n    2\n]'],
            [
                'enum',
                { enum: [[1, 2], [3]] },
                '[\n    1,\n    2\n] | [\n    3\n]',
            ],
            ['empty const', { const: [] }, '[\n]'],
            ['empty enum', { enum: [[]] }, '[\n]'],
        ];
        for (const [name, literal, expectedType] of cases) {
            it(`generates top-level typed array ${name}`, async () => {
                const result = await dtsgenerator({
                    contents: [
                        parseSchema({
                            $id: '/literal',
                            $schema: 'http://json-schema.org/draft-07/schema#',
                            type: 'array',
                            ...literal,
                        }),
                    ],
                });
                assert.strictEqual(
                    result,
                    `declare type Literal = ${expectedType};\n`,
                );
            });
        }

        it('generates compound const items', async () => {
            const schema: JsonSchemaDraft07.Schema = {
                $id: '/literal',
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'array',
                items: { const: { values: [1, {}] } },
            };
            const result = await dtsgenerator({
                contents: [parseSchema(schema)],
            });
            assert.strictEqual(
                result,
                `declare type Literal = {
    values: [
        1,
        {
            [key: string]: never;
        }
    ];
}[];
`,
            );
        });

        it('generates mixed scalar and composite enum items', async () => {
            const schema: JsonSchemaDraft07.Schema = {
                $id: '/literal',
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'array',
                items: { enum: [false, { a: 1 }, [1, 2], []] },
            };
            const result = await dtsgenerator({
                contents: [parseSchema(schema)],
            });
            assert.strictEqual(
                result,
                `declare type Literal = (false | {
    a: 1;
} | [
    1,
    2
] | [
])[];
`,
            );
        });

        it('generates typed array const items as tuples', async () => {
            const schema: JsonSchemaDraft07.Schema = {
                $id: '/literal',
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'array',
                items: { type: 'array', const: [1, 2] },
            };
            const result = await dtsgenerator({
                contents: [parseSchema(schema)],
            });
            assert.strictEqual(
                result,
                `declare type Literal = [
    1,
    2
][];
`,
            );
        });
    });

    it('no min', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_no_min',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayNoMin {
        id?: number;
        array?: ("NW" | "NE" | "SW" | "SE")[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('no min, invalid additionalItems usage', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_no_min_invalid_additional_items',
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
                    additionalItems: {
                        type: 'integer',
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncArrayNoMinInvalidAdditionalItems {
        id?: number;
        array?: ("NW" | "NE" | "SW" | "SE")[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min equal to zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_min_items_zero',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinItemsZero {
        id?: number;
        array?: ("NW" | "NE" | "SW" | "SE")[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('min greater than zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_min_items_greater_zero',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinItemsGreaterZero {
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
            id: '/test/inc_array_min_items_less_max',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinItemsLessMax {
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
            id: '/test/inc_array_min_items_equal_max',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinItemsEqualMax {
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
            id: '/test/inc_array_min_items_greater_max',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinItemsGreaterMax {
        id?: number;
        array?: never;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, no minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_object_empty_no_min',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayObjectEmptyNoMin {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with minItems', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_with_min',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayWithMin {
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
            id: '/test/inc_array_with_max',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayWithMax {
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
            id: '/test/inc_array_min_zero',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMinZero {
        id?: number;
        array?: any[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('items object empty, with maxItems zero', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/inc_array_max_zero',
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
        });

        const expected = `declare namespace Test {
    export interface IncArrayMaxZero {
        id?: number;
        array?: [
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
});
