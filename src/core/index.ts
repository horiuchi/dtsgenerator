import DtsGenerator from './dtsGenerator';
import { parseSchema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import SchemaConvertor from './schemaConvertor';
import WriteProcessor, { WriteProcessorOptions } from './writeProcessor';

export interface Options extends Partial<WriteProcessorOptions> {
    contents?: any[];
    inputUrls?: string[];
    header?: string;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const processor = new WriteProcessor(options);
    const resolver = new ReferenceResolver();
    const convertor = new SchemaConvertor(processor, options.header);

    if (options.contents != null) {
        options.contents
            .map((content) => parseSchema(content))
            .forEach((schema) => resolver.registerSchema(schema));
    }
    if (options.inputUrls != null) {
        await Promise.all(options.inputUrls.map((url) => resolver.registerRemoteSchema(url)));
    }

    const generator = new DtsGenerator(resolver, convertor);
    return await generator.generate();
}
