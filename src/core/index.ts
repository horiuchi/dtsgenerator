import DtsGenerator from './dtsGenerator';
import { parseSchema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import { TypeNameConvertor } from './typeNameConvertor';

export { default as SchemaId } from './schemaId';
export * from './type';
export { DefaultTypeNameConvertor } from './typeNameConvertor';

export interface Options {
    contents?: any[];
    inputUrls?: string[];
    typeNameConvertor?: TypeNameConvertor;
    namespaceName?: string;
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

    const generator = new DtsGenerator(resolver);
    return await generator.generate();
}
