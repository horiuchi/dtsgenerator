/// <reference path="../typings/tsd.d.ts" />
try {
  require('source-map-support').install();
} catch (e) {
}

import _model = require("./model");
import generator = require("./generator");

generator.add(
  require("../schema/news.json")
);

var dts = generator.generate();
console.log(dts);

