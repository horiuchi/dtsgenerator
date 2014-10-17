/// <reference path="../typings/tsd.d.ts" />

import _model = require("./model");
_model;
import _generator = require("./generator");

try {
  // optional
  require('source-map-support').install();
} catch (e) {
}

function dtsgenerator(schemas: _model.IJsonSchema[]): string {
  _generator.clear();
  schemas.forEach((schema) => {
    _generator.add(schema);
  });
  return _generator.generate();
}

module dtsgenerator {
  export import model = _model;
  export import generator = _generator;
}

export = dtsgenerator;

