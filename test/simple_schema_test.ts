import assert = require('power-assert');

import dtsgenerator = require('../src/index');

describe('simple schema test', () => {

  it('no property schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/no_prop',
      type: 'object',
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface INoProp {\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('one line schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/one_line',
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface IOneLine {\n' +
'    name: string;\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('no type schema', () => {
    const schema: any = {
      id: '/test/no_type'
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface INoType {\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('include array schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/inc_array',
      type: 'object',
      properties: {
        id: {
          type: 'integer'
        },
        array: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface IIncArray {\n' +
'    id: number;\n' +
'    array: string[];\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('all simple type schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/all_simple_type',
      type: 'object',
      properties: {
        any: {
          type: 'any'
        },
        array: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string'
            }
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
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface IAllSimpleType {\n' +
'    any: any;\n' +
'    array: string[][];\n' +
'    boolean: boolean;\n' +
'    integer: number;\n' +
'    null: any;\n' +
'    number: number;\n' +
'    object: {\n' +
'    };\n' +
'    string: string;\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('inner object schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
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
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface IInnerObject {\n' +
'    title: string;\n' +
'    options: {\n' +
'      A: number;\n' +
'      B: number;\n' +
'      C: string;\n' +
'    };\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('object array schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
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
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  export interface IObjectArray {\n' +
'    array: {\n' +
'      name: string;\n' +
'      items: string[];\n' +
'    }[];\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('root array schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: 'test/root/root_array',
      type: 'array',
      items: {
        type: 'string'
      }
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  namespace root {\n' +
'    export interface IRootArray extends Array<string> {\n' +
'    }\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('root any schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
      id: 'test/root/root_any',
      type: 'any',
      description: 'This is any type schema'
    };
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  namespace root {\n' +
'    /**\n' +
'     * This is any type schema\n' +
'     */\n' +
'    export interface IRootAny {\n' +
'      [name: string]: any; // any\n' +
'    }\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it('include $ref schema', () => {
    const schema: dtsgenerator.model.IJsonSchema = {
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
    const result = dtsgenerator([schema]);

    const expected =
'declare namespace test {\n' +
'  namespace ref {\n' +
'    export interface IIncludeRef {\n' +
'      "sub-name": string;\n' +
'    }\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });

});

