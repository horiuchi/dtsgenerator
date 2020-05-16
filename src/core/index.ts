import DtsGenerator from './dtsGenerator';
import { Schema } from './type';

export { default as SchemaId } from './schemaId';
export * from './type';

export interface Options {
    contents: Schema[];
}

export default async function dtsGenerator(options: Options): Promise<string> {
    const generator = new DtsGenerator(options.contents);
    return await generator.generate();
}
