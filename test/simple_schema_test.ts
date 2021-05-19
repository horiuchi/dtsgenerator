import assert from 'assert';
import dtsgenerator from '../src/core';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';
import { OpenApisV2 } from '../src/core/openApiV2';
import { OpenApisV3 } from '../src/core/openApiV3';
import { parseSchema, JsonSchema } from '../src/core/type';

describe('simple schema test', () => {
    it('no property schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/no_prop',
            type: 'object',
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface NoProp {
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('no namespace schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/no_namespace',
            type: 'object',
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare interface NoNamespace {
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('one line schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/one_line',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface OneLine {
        name?: string;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('no type schema', async () => {
        const schema: JsonSchema = {
            id: '/test/no_type',
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export type NoType = any;
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('include array schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface IncArray {
        id?: number;
        array?: (string | boolean | null | number)[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('all simple type schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
            required: ['array', 'boolean', 'integer'],
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface AllSimpleType {
        array: (string | string[])[];
        boolean: boolean;
        integer: number;
        null?: null;
        number?: number;
        object?: {
            [key: string]: any;
        };
        string?: string;
        any?: any;
        undefined?: undefined;
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('string, integer and number enum schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface EnumStringVsIntegerNumber {
        port?: 1 | 2 | 3;
        status?: 1 | 2 | 3;
        direction?: "NW" | "NE" | "SW" | "SE";
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('other type enum schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/enum_other_type',
            type: 'object',
            properties: {
                nullEnum: {
                    type: 'null',
                    enum: [null],
                },
                nonTypeNum: {
                    enum: [1, 2, 3],
                },
                mixed: {
                    enum: [true, 1, 'OK'],
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface EnumOtherType {
        nullEnum?: null;
        nonTypeNum?: 1 | 2 | 3;
        mixed?: true | 1 | "OK";
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('string and integer const schema', async () => {
        const schema: JsonSchemaDraft07.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface ConstStringVsInteger {
        port?: 1;
        direction?: "NE";
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('inner object schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

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
        assert.strictEqual(result, expected, result);
    });
    it('object array schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface ObjectArray {
        array?: {
            name?: string;
            items?: string[];
        }[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('root array schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/root/root_array',
            type: 'array',
            items: {
                type: 'string',
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Root {
        export type RootArray = string[];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('root any schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/root/root_any',
            description: 'This is any type schema',
            additionalProperties: true,
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

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
        assert.strictEqual(result, expected, result);
    });
    it('include example schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/example/root',
            example:
                '  How get this schema.\n  Also, How get this data from hoge.\n   /* hoge from fuga. */',
            properties: {
                name: {
                    type: ['string', 'null'],
                    example: 'how get name property',
                },
            },
        };

        const result = await dtsgenerator({ contents: [parseSchema(schema)] });
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
        assert.strictEqual(result, expected, result);
    });
    it('include objected example schema', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: 'test/example2/root',
            $schema: 'http://json-schema.org/draft-07/schema#',
            examples: [
                {
                    ex1: { name: 'test case 1' },
                    ex2: { name: 'test case 2' },
                    ex3: { name: null },
                },
            ],
            properties: {
                name: {
                    type: ['string', 'null'],
                },
            },
        };

        const result = await dtsgenerator({ contents: [parseSchema(schema)] });
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
        assert.strictEqual(result, expected, result);
    });
    it('include format schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/format/root',
            properties: {
                id: {
                    type: 'integer',
                    format: 'int64',
                },
            },
        };

        const result = await dtsgenerator({ contents: [parseSchema(schema)] });
        const expected = `declare namespace Test {
    namespace Format {
        export interface Root {
            id?: number; // int64
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('include $ref schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/ref/include-ref',
            type: 'object',
            definitions: {
                id: {
                    type: 'string',
                    format: 'uri',
                },
            },
            properties: {
                'sub-id': {
                    $ref: '#/definitions/id',
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Ref {
        export interface IncludeRef {
            "sub-id"?: IncludeRef.Definitions.Id /* uri */;
        }
        namespace IncludeRef {
            namespace Definitions {
                export type Id = string; // uri
            }
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('include $ref schema 2', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: 'test/ref/include_ref2',
            type: 'object',
            definitions: {
                'test $ref': {
                    type: 'string',
                },
            },
            properties: {
                'sub-name': {
                    $ref: '#/definitions/test $ref',
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Ref {
        export interface IncludeRef2 {
            "sub-name"?: IncludeRef2.Definitions.Test$Ref;
        }
        namespace IncludeRef2 {
            namespace Definitions {
                export type Test$Ref = string;
            }
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('include `/` properties schema', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/include/slash',
            type: 'object',
            properties: {
                'a/b': {
                    type: 'string',
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Include {
        export interface Slash {
            "a/b"?: string;
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it(' model in multiple allOf', async () => {
        const schema: OpenApisV2.SchemaJson = {
            swagger: '2.0',
            info: {
                title: 'swagger 2.0 sample',
                version: '0.1.0',
            },
            paths: {},
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

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
        assert.strictEqual(result, expected, result);
    });
    it(' model in multiple allOf nested ordered $refs', async () => {
        const schema: OpenApisV2.SchemaJson = {
            swagger: '2.0',
            info: {
                title: 'swagger 2.0 sample',
                version: '0.1.0',
            },
            paths: {},
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
                    allOf: [{ $ref: '#/definitions/Parent' }],
                    type: 'object',
                    properties: {
                        first: {
                            type: 'string',
                        },
                    },
                },
                SecondChild: {
                    allOf: [{ $ref: '#/definitions/FirstChild' }],
                    type: 'object',
                    properties: {
                        second: {
                            type: 'string',
                        },
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

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
        assert.strictEqual(result, expected, result);
    });
    it(' model in multiple allOf nested unordered $refs', async () => {
        const schema: OpenApisV2.SchemaJson = {
            swagger: '2.0',
            info: {
                title: 'swagger 2.0 sample',
                version: '0.1.0',
            },
            paths: {},
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
                    allOf: [{ $ref: '#/definitions/SecondChild' }],
                    type: 'object',
                    properties: {
                        first: {
                            type: 'string',
                        },
                    },
                },
                SecondChild: {
                    allOf: [{ $ref: '#/definitions/Parent' }],
                    type: 'object',
                    properties: {
                        second: {
                            type: 'string',
                        },
                    },
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

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
        assert.strictEqual(result, expected, result);
    });
    it('should include allOf schemas', async () => {
        const baseSchema: JsonSchemaDraft04.Schema = {
            id: 'http://test/zzz/allOf/base',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
            },
            required: ['id'],
        };
        const extendedSchema: JsonSchemaDraft04.Schema = {
            id: 'http://test/zzz/allOf/extended',
            type: 'object',
            allOf: [{ $ref: '/zzz/allOf/base' }],
            properties: {
                value: {
                    type: 'number',
                },
            },
            required: ['value'],
        };
        const separateSchema: JsonSchemaDraft04.Schema = {
            id: 'http://test/separate',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                },
            },
            required: ['message'],
        };
        const combinedSchema: JsonSchemaDraft04.Schema = {
            id: 'http://test/combined',
            type: 'object',
            allOf: [{ $ref: '/zzz/allOf/extended' }, { $ref: '/separate' }],
        };

        const result = await dtsgenerator({
            contents: [
                baseSchema,
                extendedSchema,
                separateSchema,
                combinedSchema,
            ].map((s) => parseSchema(s)),
        });

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
                id: string;
                value: number;
            }
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('should inherited allOf schemas', async () => {
        const baseSchema: JsonSchemaDraft04.Schema = {
            id: 'http://inherited/allOf/base',
            type: 'object',
            properties: {
                id: { type: 'string' },
                value: { type: 'any' },
            },
            required: ['id', 'value'],
        };
        const numberSchema: JsonSchemaDraft04.Schema = {
            id: 'http://inherited/allOf/extended/number',
            type: 'object',
            allOf: [{ $ref: '/allOf/base' }],
            properties: {
                value: { type: 'number' },
            },
        };
        const stringSchema: JsonSchemaDraft04.Schema = {
            id: 'http://inherited/allOf/extended/string',
            type: 'object',
            allOf: [{ $ref: '/allOf/base' }],
            properties: {
                value: { type: 'string' },
            },
        };

        const result = await dtsgenerator({
            contents: [baseSchema, numberSchema, stringSchema].map((s) =>
                parseSchema(s)
            ),
        });

        const expected = `declare namespace Inherited {
    namespace AllOf {
        export interface Base {
            id: string;
            value: any;
        }
        namespace Extended {
            export interface Number {
                id: string;
                value: number;
            }
            export interface String {
                id: string;
                value: string;
            }
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('should work with oneOf', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/oneOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            oneOf: [{ required: ['s1'] }, { required: ['s2'] }],
            properties: {
                s1: {
                    type: 'string',
                },
                s2: {
                    type: 'string',
                },
            },
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export type OneOf = {
        s1: string;
        s2?: string;
    } | {
        s1?: string;
        s2: string;
    };
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('should work with patternProperties', async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/pattern_properties',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
            },
            patternProperties: {
                '^[0-9]+$': {
                    type: 'number',
                },
                '^[a-z]+$': {
                    type: 'string',
                },
            },
            required: ['name'],
        };
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface PatternProperties {
        name: string;
        [pattern: string]: number | string; /* Patterns: ^[0-9]+$ | ^[a-z]+$ */
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('support file type in OpenAPI v2', async () => {
        const schema: OpenApisV2.SchemaJson = {
            swagger: '2.0',
            info: {
                title: 'test for file type.',
                version: '1.0.0',
            },
            paths: {
                '/file': {
                    post: {
                        consumes: ['multipart/form-data'],
                        parameters: [
                            { $ref: '#/parameters/File' },
                            { $ref: '#/parameters/Note' },
                        ],
                        responses: {
                            '200': {
                                description: 'success',
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                File: {
                    in: 'formData',
                    name: 'file',
                    type: 'file',
                    required: true,
                },
                Note: {
                    in: 'formData',
                    name: 'note',
                    type: 'string',
                },
            },
        };

        const result = await dtsgenerator({ contents: [parseSchema(schema)] });
        const expected = `declare interface FormDataParameters {
    File?: Parameters.File;
    Note?: Parameters.Note;
}
declare namespace Parameters {
    export type File = unknown;
    export type Note = string;
}
declare namespace Paths {
    namespace File {
        namespace Post {
            namespace Parameters {
                export type $0 = Parameters.File;
                export type $1 = Parameters.Note;
            }
            namespace Responses {
                export type $200 = string;
            }
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
    it('support components property in OpenAPI v3', async () => {
        const schema: OpenApisV3.SchemaJson = {
            openapi: '3.0.3',
            info: {
                title: 'Test',
                version: '0.4.0',
            },
            paths: {
                '/geographies/{geographyId}': {
                    get: {
                        operationId: 'getGeography',
                        description: 'Get a single geography',
                        parameters: [
                            { $ref: '#/components/parameters/GeographyId' },
                        ],
                        tags: ['Geography'],
                        responses: {
                            '200': {
                                description: 'OK',
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/Geography',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: {
                    Geography: {
                        description: 'Information about a geography',
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                        },
                    },
                },
                parameters: {
                    GeographyId: {
                        name: 'geographyId',
                        in: 'path',
                        description: 'unique id of geography',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                },
            },
        };

        const result = await dtsgenerator({
            contents: [parseSchema(schema as JsonSchema)],
        });
        const expected = `declare namespace Components {
    namespace Parameters {
        export type GeographyId = string; // uuid
    }
    export interface PathParameters {
        GeographyId?: Parameters.GeographyId /* uuid */;
    }
    namespace Schemas {
        /**
         * Information about a geography
         */
        export interface Geography {
            name?: string;
        }
    }
}
declare namespace Paths {
    namespace GetGeography {
        namespace Parameters {
            export type $0 = Components.Parameters.GeographyId /* uuid */;
        }
        namespace Responses {
            export type $200 = /* Information about a geography */ Components.Schemas.Geography;
        }
    }
}
`;
        assert.strictEqual(result, expected, result);
    });
});
