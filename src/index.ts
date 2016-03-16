import _generator = require('./generator');

try {
    // optional
    require('source-map-support').install();
} catch (e) {
}

function dtsgenerator(schemas: JsonSchema[], prefix?: string): string {
    _generator.clear();
    schemas.forEach((schema) => {
        _generator.add(schema);
    });
    return _generator.generate(prefix);
}

namespace dtsgenerator {
    export var generator = _generator;
}

export = dtsgenerator;

