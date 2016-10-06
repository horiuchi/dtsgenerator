declare var global: any;
if (!global._babelPolyfill) {
    require('babel-polyfill');
}
import { JsonSchemaParser } from './jsonSchemaParser';

try {
    // optional
    require('source-map-support').install();
} catch (e) {
}

export default function dtsgenerator(schemas: JsonSchemaOrg.Schema[]): Promise<string> {
    const parser = new JsonSchemaParser();
    try {
        schemas.forEach((schema) => {
            parser.parseSchema(schema);
        });
        return parser.generateDts();
    } catch (e) {
        return Promise.reject<string>(e);
    }
}

