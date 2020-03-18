import DtsGenerator from './dtsGenerator';
import { parseSchema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import { Config, setConfig } from './config';

export { default as SchemaId } from './schemaId';
export * from './type';
export { DefaultTypeNameConvertor } from './typeNameConvertor';

export interface Options {
    contents?: any[];
    inputUrls?: string[];
    config?: Partial<Config>;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const resolver = new ReferenceResolver();

    if (options.contents != null) {
        options.contents
            .map((content) => parseSchema(content))
            .forEach((schema) => resolver.registerSchema(schema));
    }
    if (options.inputUrls != null) {
        await Promise.all(options.inputUrls.map((url) => resolver.registerRemoteSchema(url)));
    }
    if (options.config != null) {
        setConfig(options.config);
    }

    const generator = new DtsGenerator(resolver);
    return await generator.generate();
}
