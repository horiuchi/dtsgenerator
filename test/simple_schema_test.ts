require('source-map-support').install();

import * as assert from 'power-assert';
import dtsgenerator from '../src/';


describe('simple schema test', () => {

    it('no property schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/no_prop',
            type: 'object',
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface NoProp {
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('one line schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/one_line',
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        };
        const result = await dtsgenerator([schema], 'I');

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
            id: '/test/no_type'
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    export type INoType = any;
}
`;
        assert.equal(result, expected, result);
    });
    it('include array schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inc_array',
            type: 'object',
            properties: {
                id: {
                    type: 'integer'
                },
                array: {
                    type: 'array',
                    items: {
                        type: ['string', 'integer']
                    }
                }
            }
        };
        const result = await dtsgenerator([schema], 'T');

        const expected = `declare namespace Test {
    export interface TIncArray {
        id?: number;
        array?: (string | number)[];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('all simple type schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
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
                                    type: 'string'
                                }
                            }
                        ]
                    }
                },
                boolean: {
                    type: 'boolean'
                },
                integer: {
                    type: 'integer'
                },
                null: {
                    type: 'null'
                },
                number: {
                    type: 'number'
                },
                object: {
                    type: 'object'
                },
                string: {
                    type: 'string'
                },
            },
            required: [
                'array', 'boolean', 'integer'
            ]
        };
        const result = await dtsgenerator([schema], 'I');

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
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('inner object schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/inner_object',
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                },
                options: {
                    type: 'object',
                    properties: {
                        A: { type: 'integer' },
                        B: { type: 'number' },
                        C: { type: 'string' },
                    }
                }
            }
        };
        const result = await dtsgenerator([schema], 'I');

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
        const schema: JsonSchemaOrg.Schema = {
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
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    export interface IObjectArray {
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
        const schema: JsonSchemaOrg.Schema = {
            id: 'test/root/root_array',
            type: 'array',
            items: {
                type: 'string'
            }
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    namespace Root {
        export type IRootArray = string[];
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('root any schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: 'test/root/root_any',
            description: 'This is any type schema',
            additionalProperties: true
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    namespace Root {
        /**
         * This is any type schema
         */
        export interface IRootAny {
            [name: string]: any;
        }
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include example schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: 'test/example/root',
            example: 'How get this schema.\nAlso, How get this data from hoge.',
            properties: {
                name: {
                    type: ['string', 'null'],
                    example: 'how get name property'
                }
            }
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    namespace Example {
        /**
         * example:
         *   How get this schema.
         *   Also, How get this data from hoge.
         */
        export interface IRoot {
            /**
             * example: how get name property
             */
            name?: string;
        }
    }
}
`;
        assert.equal(result, expected, result);
    });
    it('include $ref schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: 'test/ref/include_ref',
            type: 'object',
            definitions: {
                name: {
                    type: 'string'
                }
            },
            properties: {
                'sub-name': {
                    $ref: '#/definitions/name'
                }
            }
        };
        const result = await dtsgenerator([schema], 'I');

        const expected = `declare namespace Test {
    namespace Ref {
        export interface IIncludeRef {
            "sub-name"?: IncludeRef.Definitions.IName;
        }
        namespace IncludeRef {
            namespace Definitions {
                export type IName = string;
            }
        }
    }
}
`;
        assert.equal(result, expected, result);
    });

});

