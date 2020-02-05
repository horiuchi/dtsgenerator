import assert from 'power-assert';
import dtsgenerator from '../src/core';


describe('simple schema test', () => {

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
    it('no namespace schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/no_namespace',
            type: 'object',
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare interface NoNamespace {
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface OneLine {
        name?: string;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('two line readonly schema', async () => {
        const schema: JsonSchemaOrg.Draft07.Schema = {
            $id: '/test/one_line',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    readOnly: true,
                },
                type: {
                    type: 'integer',
                    readOnly: false,
                },
            },
            required: ['name', 'type'],
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface OneLine {
        readonly name: string;
        type: number;
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('no type schema', async () => {
        const schema: any = {
            id: '/test/no_type',
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export type NoType = any;
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface IncArray {
        id?: number;
        array?: (string | boolean | null | number)[];
    }
}
`;
        assert.equal(result, expected, result);
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface AllSimpleType {
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
    it('string, integer and number enum schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/enum_string_vs_integer_number',
            type: 'object',
            properties: {
                port: {
                    type: 'integer',
                    enum: [1, 2, 3],
                },
                status: {
                    type: 'number',
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
    export interface EnumStringVsIntegerNumber {
        port?: 1 | 2 | 3;
        status?: 1 | 2 | 3;
        direction?: "NW" | "NE" | "SW" | "SE";
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('string and integer const schema', async () => {
        const schema: JsonSchemaOrg.Draft07.Schema = {
            $id: '/test/const_string_vs_integer',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                port: {
                    type: 'integer',
                    const: 1,
                },
                direction: {
                    type: 'string',
                    const: 'NE',
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface ConstStringVsInteger {
        port?: 1;
        direction?: "NE";
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
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    export interface InnerObject {
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
    });
    it('include objected example schema', async () => {
        const schema: JsonSchemaOrg.Draft07.Schema = {
            $id: 'test/example2/root',
            $schema: 'http://json-schema.org/draft-07/schema#',
            examples: [{
                ex1: { name: 'test case 1' },
                ex2: { name: 'test case 2' },
                ex3: { name: null },
            }],
            properties: {
                name: {
                    type: ['string', 'null'],
                },
            },
        };

        const result = await dtsgenerator({ contents: [schema] });
        const expected = `declare namespace Test {
    namespace Example2 {
        /**
         * example:
         * {
         *   "ex1": {
         *     "name": "test case 1"
         *   },
         *   "ex2": {
         *     "name": "test case 2"
         *   },
         *   "ex3": {
         *     "name": null
         *   }
         * }
         */
        export interface Root {
            name?: string | null;
        }
    }
}
`;
        assert.equal(result, expected, result);
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
    it('include `/` properties schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/include/slash',
            type: 'object',
            properties: {
                'a/b': {
                    type: 'string',
                },
            },
        };
        const result = await dtsgenerator({ contents: [schema] });

        const expected = `declare namespace Test {
    namespace Include {
        export interface Slash {
            "a/b"?: string;
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
