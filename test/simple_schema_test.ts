import assert = require('power-assert');

import dtsgenerator = require('../src/index');

describe('simple schema test', () => {

    it('no property schema', () => {
        const schema: JsonSchema = {
            id: '/test/no_prop',
            type: 'object',
        };
        const result = dtsgenerator([schema]);

        const expected = `declare namespace test {
    export interface NoProp {
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('one line schema', () => {
        const schema: JsonSchema = {
            id: '/test/one_line',
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        };
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    export interface IOneLine {
        name: string;
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('no type schema', () => {
        const schema: any = {
            id: '/test/no_type'
        };
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    export interface INoType {
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('include array schema', () => {
        const schema: JsonSchema = {
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
        const result = dtsgenerator([schema], 'T');

        const expected = `declare namespace test {
    export interface TIncArray {
        id: number;
        array: (string | number)[];
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('all simple type schema', () => {
        const schema: JsonSchema = {
            id: '/test/all_simple_type',
            type: 'object',
            properties: {
                any: {
                    type: 'any'
                },
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
            }
        };
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    export interface IAllSimpleType {
        any: any;
        array: (string | string[])[];
        boolean: boolean;
        integer: number;
        null: any;
        number: number;
        object: {
        };
        string: string;
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('inner object schema', () => {
        const schema: JsonSchema = {
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
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    export interface IInnerObject {
        title: string;
        options: {
            A: number;
            B: number;
            C: string;
        };
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('object array schema', () => {
        const schema: JsonSchema = {
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
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    export interface IObjectArray {
        array: {
            name: string;
            items: string[];
        }[];
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('root array schema', () => {
        const schema: JsonSchema = {
            id: 'test/root/root_array',
            type: 'array',
            items: {
                type: 'string'
            }
        };
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    namespace root {
        export interface IRootArray extends Array<string> {
        }
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('root any schema', () => {
        const schema: JsonSchema = {
            id: 'test/root/root_any',
            type: 'any',
            description: 'This is any type schema'
        };
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    namespace root {
        /**
         * This is any type schema
         */
        export interface IRootAny {
            [name: string]: any; // any
        }
    }
}
`;
        assert.equal(expected, result, result);
    });
    it('include $ref schema', () => {
        const schema: JsonSchema = {
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
        const result = dtsgenerator([schema], 'I');

        const expected = `declare namespace test {
    namespace ref {
        export interface IIncludeRef {
            "sub-name": string;
        }
    }
}
`;
        assert.equal(expected, result, result);
    });

});

