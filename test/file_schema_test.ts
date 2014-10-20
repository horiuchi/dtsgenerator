/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./expected_file/news.d.ts" />

import assert = require("power-assert");
import fs = require("fs");

import dtsgenerator = require("../lib/index");

describe("file schema test", () => {

  it("news schema", () => {
    var schema = fs.readFileSync("./schema/news.json", { encoding: "utf-8" });
    var actual = dtsgenerator([schema]);
    var expected = fs.readFileSync("./test/expected_file/news.d.ts", { encoding: "utf-8" });
    assert.equal(expected, actual, actual);
  });
  it("JSON Schema's schema", () => {
    var schema = fs.readFileSync("./schema/schema", { encoding: "utf-8" });
    var actual = dtsgenerator([schema]);
    var expected = fs.readFileSync("./test/expected_file/schema.d.ts", { encoding: "utf-8" });
    assert.equal(expected, actual, actual);
  });

});

