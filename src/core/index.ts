import DtsGenerator from './dtsGenerator';
import ReferenceResolver from './referenceResolver';
import { Config, setConfig } from './config';
import { Schema } from './type';

export { default as SchemaId } from './schemaId';
export * from './type';
export { DefaultTypeNameConvertor } from './typeNameConvertor';

export interface Options {
    contents: Schema[];
    config?: Partial<Config>;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const resolver = new ReferenceResolver();

    options.contents.forEach((schema) => resolver.registerSchema(schema));
    if (options.config != null) {
        setConfig(options.config);
    }

    const generator = new DtsGenerator(resolver);
    return await generator.generate();
}
