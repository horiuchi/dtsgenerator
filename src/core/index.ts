import DtsGenerator from './dtsGenerator';
import { parseSchema } from './jsonSchema';
import ReferenceResolver, { PreProcessor } from './referenceResolver';
import SchemaConvertor from './schemaConvertor';
import { TypeNameConvertor } from './typeNameConvertor';
import WriteProcessor, { WriteProcessorOptions } from './writeProcessor';

export { default as SchemaId } from './schemaId';
export { DefaultTypeNameConvertor } from './typeNameConvertor';

export interface Options extends Partial<WriteProcessorOptions> {
    contents?: any[];
    inputUrls?: string[];
    typeNameConvertor?: TypeNameConvertor;
    namespaceName?: string;
    preProcessor?: PreProcessor;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const { preProcessor } = options;
    const processor = new WriteProcessor(options);
    const resolver = new ReferenceResolver(options.preProcessor);
    const convertor = new SchemaConvertor(processor, options.typeNameConvertor, options.namespaceName);

    if (options.contents != null) {
        options.contents
            .map((content) => preProcessor ? preProcessor(content) : content)
            .map((content) => parseSchema(content))
            .forEach((schema) => resolver.registerSchema(schema));
    }
    if (options.inputUrls != null) {
        await Promise.all(options.inputUrls.map((url) => resolver.registerRemoteSchema(url)));
    }

    const generator = new DtsGenerator(resolver, convertor);
    return await generator.generate();
}
