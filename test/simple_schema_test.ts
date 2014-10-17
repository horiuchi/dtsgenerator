/// <reference path="../typings/tsd.d.ts" />

import assert = require("power-assert");

import dtsgenerator = require("../lib/index");

describe("simple schema test", () => {

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
    console.log(result);
    var expected =
'declare module test {\n' +
'  export interface IOneLine {\n' +
'    name: string;\n' +
'  }\n' +
'}\n';
    assert.equal(expected, result);
  });

});

