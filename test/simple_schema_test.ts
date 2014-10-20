/// <reference path="../typings/tsd.d.ts" />

import assert = require("power-assert");

import dtsgenerator = require("../lib/index");

describe("simple schema test", () => {

  it("no property schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/no_prop',
      type: 'object',
    };
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
'  export interface INoProp {\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it("one line schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/one_line',
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    };
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
'  export interface IOneLine {\n' +
'    name: string;\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it("include array schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
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
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
'  export interface IIncArray {\n' +
'    id: number;\n' +
'    array: string[];\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });
  it("all simple type schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
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
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
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
  it("inner object schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
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
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
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
  it("object array schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
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
    var result = dtsgenerator([schema]);

    var expected =
'declare module test {\n' +
'  export interface IObjectArray {\n' +
'    array: {\n' +
'      name: string;\n' +
'      items: string[];\n' +
'    }[];\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result, result);
  });

});

