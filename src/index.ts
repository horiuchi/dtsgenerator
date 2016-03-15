import _model = require('./model');
import _generator = require('./generator');

try {
    // optional
    require('source-map-support').install();
} catch (e) {
}

function dtsgenerator(schemas: _model.IJsonSchema[], prefix?: string): string {
    _generator.clear();
    schemas.forEach((schema) => {
        _generator.add(schema);
    });
    return _generator.generate(prefix);
}

namespace dtsgenerator {
    export import model = _model;
    export var generator = _generator;
}

export = dtsgenerator;

