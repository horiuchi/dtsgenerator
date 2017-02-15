declare var global: any;
if (!global._babelPolyfill) {
    /* tslint:disable:no-var-requires */
    require('babel-polyfill');
}
import opts from './commandOptions';
import { JsonSchemaParser } from './jsonSchemaParser';
import { DefaultNamingStrategy } from './naming/defaultNamingStrategy';
import { NoExtensionNamingStrategy } from './naming/noExtensionNamingStrategy';
import { SchemaId } from './schemaid';

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
        initializeNamingStrategy();
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

function initializeNamingStrategy() {
    switch (opts.naming) {
        case 'include-extensions':
            SchemaId.namingStrategy = new DefaultNamingStrategy();
            break;
        case 'exclude-extensions':
            SchemaId.namingStrategy = new NoExtensionNamingStrategy();
            break;
        default:
            throw new Error('Unknown naming strategy: ' + opts.naming);
    }
}
