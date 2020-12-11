import { Config, setConfig } from './config';
import DtsGenerator from './dtsGenerator';
import { Schema } from './type';

export { default as SchemaId } from './schemaId';
export * from './type';

export interface Options {
    contents: Schema[];
    config?: Partial<Config>;
}

export default async function dtsGenerator(options: Options): Promise<string> {
    if (options.config) {
        setConfig(options.config);
    }
    const generator = new DtsGenerator(options.contents);
    return await generator.generate();
}
