declare var global: any;
if (!global._babelPolyfill) {
    /* tslint:disable:no-var-requires */
    require('babel-polyfill');
}
import opts from './commandOptions';
import { JsonSchemaParser } from './jsonSchemaParser';

try {
    // optional
    /* tslint:disable:no-var-requires */
    require('source-map-support').install();
} catch (e) {
    // do nothing
}

export { initialize } from './commandOptions';
export default async function dtsgenerator(schemas?: JsonSchemaOrg.Schema[]): Promise<string> {
    const parser = new JsonSchemaParser();
    try {
        if (schemas) {
            for (let schema of schemas) {
                parser.parseSchema(schema);
            }
        }
        for (let path of opts.files) {
            const lschemas = await parser.fetchLocalFileSchemas(path);
            for (let lschema of lschemas) {
                parser.parseSchema(lschema);
            }
        }
        for (let url of opts.urls) {
            parser.parseSchema(await parser.fetchRemoteSchema(url), url);
        }
        return parser.generateDts();
    } catch (e) {
        return Promise.reject(e);
    }
}

