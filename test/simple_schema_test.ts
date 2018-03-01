import assert from 'power-assert';
import opts, { clear } from '../src/commandOptions';
import dtsgenerator from '../src/core';


describe('simple schema test', () => {

    afterEach(() => {
        clear();
    });

    it('no property schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/no_prop',
            type: 'object',
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface NoProp {
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('one line schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/one_line',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
            },
        };
        const prefix = 'I';
        const result = await dtsgenerator({ contents: [schema], prefix });

        const expected = `declare namespace Test {
    export interface IOneLine {
        name?: string;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('no type schema', async () => {
        const schema: any = {
            id: '/test/no_type',
        };
        const prefix = 'I';
        const header = `// header string
`;
        const result = await dtsgenerator({ contents: [schema], prefix, header });

        const expected = `// header string

declare namespace Test {
    export type INoType = any;
}
`;
        assert.equal(result, expected, result);
    });
    it('include array schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inc_array',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: {
                        type: ['string', 'integer', 'boolean', 'null'],
                    },
                },
            },
        };
        const prefix = 'T';
        {
            const result = await dtsgenerator({ contents: [schema], prefix });

            const expected = `declare namespace Test {
    export interface TIncArray {
        id?: number;
        array?: (string | boolean | null | number)[];
    }
}
`;
            assert.equal(result, expected, result);
        }

        opts.target = 'v1';
        {
            const result = await dtsgenerator({ contents: [schema], prefix });

            const expected = `declare namespace Test {
    export interface TIncArray {
        id?: number;
        array?: (string | boolean | number)[];
    }
}
`;
            assert.equal(result, expected, result);
        }
    });
    it('all simple type schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/all_simple_type',
            type: 'object',
            properties: {
                array: {
                    type: 'array',
                    items: {
                        anyOf: [
                            { type: 'string' },
                            {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        ],
                    },
                },
                boolean: {
                    type: 'boolean',
                },
                integer: {
                    type: 'integer',
                },
                null: {
                    type: 'null',
                },
                number: {
                    type: 'number',
                },
                object: {
                    type: 'object',
                },
                string: {
                    type: 'string',
                },
                any: {
                    type: 'any',
                },
                undefined: {
                    type: 'undefined',
                },
            },
            required: [
                'array', 'boolean', 'integer',
            ],
        };
        const prefix = 'I';
        const result = await dtsgenerator({ contents: [schema], prefix });

        const expected = `declare namespace Test {
    export interface IAllSimpleType {
        array: (string | string[])[];
        boolean: boolean;
        integer: number;
        null?: null;
        number?: number;
        object?: {
        };
        string?: string;
        any?: any;
        undefined?: undefined;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('string and integer enum schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/enum_string_vs_integer',
            type: 'object',
            properties: {
                port: {
                    type: 'integer',
                    enum: [1, 2, 3],
                },
                direction: {
                    type: 'string',
                    enum: ['NW', 'NE', 'SW', 'SE'],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface EnumStringVsInteger {
        port?: 1 | 2 | 3;
        direction?: "NW" | "NE" | "SW" | "SE";
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('inner object schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/inner_object',
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                options: {
                    type: 'object',
                    properties: {
                        A: { type: 'integer' },
                        B: { type: 'number' },
                        C: { type: 'string' },
                    },
                },
            },
        };
        const prefix = 'I';
        const result = await dtsgenerator({ contents: [schema], prefix });

        const expected = `declare namespace Test {
    export interface IInnerObject {
        title?: string;
        options?: {
            A?: number;
            B?: number;
            C?: string;
        };
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('object array schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/object_array',
            type: 'object',
            properties: {
                array: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            items: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface ObjectArray {
        array?: {
            name?: string;
            items?: string[];
        }[];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('root array schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'test/root/root_array',
            type: 'array',
            items: {
                type: 'string',
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    namespace Root {
        export type RootArray = string[];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('root any schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'test/root/root_any',
            description: 'This is any type schema',
            additionalProperties: true,
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    namespace Root {
        /**
         * This is any type schema
         */
        export interface RootAny {
            [name: string]: any;
        }
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include example schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'test/example/root',
            example: '  How get this schema.\n  Also, How get this data from hoge.\n   /* hoge from fuga. */',
            properties: {
                name: {
                    type: ['string', 'null'],
                    example: 'how get name property',
                },
            },
        };

        {
            const result = await dtsgenerator({ contents: [schema] });
            const expected = `declare namespace Test {
    namespace Example {
        /**
         * example:
         *   How get this schema.
         *   Also, How get this data from hoge.
         *    /* hoge from fuga. *\u200B/
         */
        export interface Root {
            /**
             * example:
             * how get name property
             */
            name?: string | null;
        }
    }
}
`;
            assert.equal(result, expected, result);
        }

        {
            opts.target = 'v1';
            const result = await dtsgenerator({ contents: [schema] });
            const expected = `declare namespace Test {
    namespace Example {
        /**
         * example:
         *   How get this schema.
         *   Also, How get this data from hoge.
         *    /* hoge from fuga. *\u200B/
         */
        export interface Root {
            /**
             * example:
             * how get name property
             */
            name?: string;
        }
    }
}
`;
            assert.equal(result, expected, result);
        }
    });
    it('include $ref schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: 'test/ref/include_ref',
            type: 'object',
            definitions: {
                name: {
                    type: 'string',
                },
            },
            properties: {
                'sub-name': {
                    $ref: '#/definitions/name',
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    namespace Ref {
        export interface IncludeRef {
            "sub-name"?: IncludeRef.Definitions.Name;
        }
        namespace IncludeRef {
            namespace Definitions {
                export type Name = string;
            }
        }
    }
}
`;
        assert.equal(result, expected, result);
    });
    it(' model in multiple allOf', async () => {
        const schema = {
            swagger: '2.0',
            definitions: {
                Parent: {
                    type: 'object',
                    properties: {
                        parent: {
                            type: 'string',
                        },
                    },
                },
                FirstChild: {
                    allOf: [
                        { $ref: '#/definitions/Parent' },
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
                SecondChild: {
                    allOf: [
                        { $ref: '#/definitions/Parent' },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Definitions {
    export interface FirstChild {
        parent?: string;
        first?: string;
    }
    export interface Parent {
        parent?: string;
    }
    export interface SecondChild {
        parent?: string;
        second?: string;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it(' model in multiple allOf nested ordered $refs', async () => {
        const schema = {
            swagger: '2.0',
            definitions: {
                Parent: {
                    type: 'object',
                    properties: {
                        parent: {
                            type: 'string',
                        },
                    },
                },
                FirstChild: {
                    allOf: [
                        { $ref: '#/definitions/Parent' },
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
                SecondChild: {
                    allOf: [
                        { $ref: '#/definitions/FirstChild' },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Definitions {
    export interface FirstChild {
        parent?: string;
        first?: string;
    }
    export interface Parent {
        parent?: string;
    }
    export interface SecondChild {
        parent?: string;
        first?: string;
        second?: string;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it(' model in multiple allOf nested unordered $refs', async () => {
        const schema = {
            swagger: '2.0',
            definitions: {
                Parent: {
                    type: 'object',
                    properties: {
                        parent: {
                            type: 'string',
                        },
                    },
                },
                FirstChild: {
                    allOf: [
                        { $ref: '#/definitions/SecondChild' },
                        {
                            type: 'object',
                            properties: {
                                first: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
                SecondChild: {
                    allOf: [
                        { $ref: '#/definitions/Parent' },
                        {
                            type: 'object',
                            properties: {
                                second: {
                                    type: 'string',
                                },
                            },
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Definitions {
    export interface FirstChild {
        parent?: string;
        second?: string;
        first?: string;
    }
    export interface Parent {
        parent?: string;
    }
    export interface SecondChild {
        parent?: string;
        second?: string;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('should include allOf schemas', async () => {
        const baseSchema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/zzz/allOf/base',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
            },
            required: ['id'],
        };
        const extendedSchema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/zzz/allOf/extended',
            type: 'object',
            allOf: [
                { $ref: '/zzz/allOf/base' },
            ],
            properties: {
                value: {
                    type: 'number',
                },
            },
            required: ['value'],
        };
        const separateSchema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/separate',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                },
            },
            required: ['message'],
        };
        const combinedSchema: JsonSchemaOrg.Draft04.Schema = {
            id: 'http://test/combined',
            type: 'object',
            allOf: [
                { $ref: '/zzz/allOf/base' },
                { $ref: '/zzz/allOf/extended' },
                { $ref: '/separate' },
            ],
        };

        const result = await dtsgenerator({ contents: [baseSchema, extendedSchema, separateSchema, combinedSchema] });

        const expected = `declare namespace Test {
    export interface Combined {
        id: string;
        value: number;
        message: string;
    }
    export interface Separate {
        message: string;
    }
    namespace Zzz {
        namespace AllOf {
            export interface Base {
                id: string;
            }
            export interface Extended {
                value: number;
                id: string;
            }
        }
    }
}
`;
        assert.equal(result, expected, result);
    });
});

