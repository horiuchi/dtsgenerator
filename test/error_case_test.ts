/// <reference path="../typings/tsd.d.ts" />

import assert = require("power-assert");

import dtsgenerator = require("../lib/index");

console.error = function() {}

describe("error schema test", () => {

  it("no id schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      type: 'object',
    };
    try {
      dtsgenerator([schema]);
      assert.fail();
    } catch (e) {
      assert.equal("id is not found.", e.message);
    }
  });
  it("unkown type schema", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/unkown_type',
      type: 'hoge'
    };
    try {
      dtsgenerator([schema]);
      assert.fail();
    } catch (e) {
      assert.equal("unknown type: hoge", e.message);
    }
  });
  it("unkown type property", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/unkown_property',
      type: 'object',
      properties: {
        name: {
          type: 'fuga'
        }
      }
    };
    try {
      dtsgenerator([schema]);
      assert.fail();
    } catch (e) {
      assert.equal("unknown type: fuga", e.message);
    }
  });

  it("target of $ref is not found", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/target_not_found',
      type: 'object',
      properties: {
        ref: {
          $ref: '/notFound/id#'
        }
      }
    };
    try {
      dtsgenerator([schema]);
      assert.fail();
    } catch (e) {
      assert.equal("$ref target is not found: /notFound/id", e.message);
    }
  });
  it("target of $ref is invalid path", () => {
    var schema: dtsgenerator.model.IJsonSchema = {
      id: '/test/target_not_found',
      type: 'object',
      properties: {
        ref: {
          $ref: '#hogefuga'
        }
      }
    };
    try {
      dtsgenerator([schema]);
      assert.fail();
    } catch (e) {
      assert.equal("$ref path must be absolute path: hogefuga", e.message);
    }
  });

});

