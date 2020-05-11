import fs from 'fs';
import { TransformerFactory, SourceFile } from 'typescript';
import { globFiles, parseFileContent, readStream, readUrl } from '../utils';
import SchemaId from './schemaId';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { JsonSchemaDraft07 } from './jsonSchemaDraft07';
import { getId, selectSchemaType, setId } from './jsonSchema';

// Schema types

export type JsonSchema = JsonSchemaDraft04.Schema | JsonSchemaDraft07.Schema;
export type JsonSchemaObject = JsonSchemaDraft04.Schema | JsonSchemaDraft07.SchemaObject;

export type SchemaType = 'Draft04' | 'Draft07';

export interface Schema {
    type: SchemaType;
    openApiVersion?: 2 | 3;
    id: SchemaId;
    content: JsonSchema;
    rootSchema?: Schema;
}

export function parseSchema(content: any, url?: string): Schema {
    const { type, openApiVersion } = selectSchemaType(content);
    if (url != null) {
        setId(type, content, url);
    }
    const id = getId(type, content);
    return {
        type,
        openApiVersion,
        id: id ? new SchemaId(id) : SchemaId.empty,
        content,
    };
}

export async function readSchemaFromStdin(): Promise<Schema> {
    const data = await readStream(process.stdin);
    const content = parseFileContent(data);
    return parseSchema(content);
}
export async function readSchemasFromFile(pattern: string): Promise<Schema[]> {
    const files = await globFiles(pattern);
    return Promise.all(files.map(async (file) => {
        const data = await fs.promises.readFile(file, { encoding: 'utf-8' });
        const content = parseFileContent(data);
        return parseSchema(content);
    }));
}
export async function readSchemaFromUrl(url: string): Promise<Schema> {
    const data = await readUrl(url);
    const content = parseFileContent(data, url);
    return parseSchema(content, url);
}

// Plugin Types

export interface PluginContext {
    option?: any;
    inputSchemas: Iterator<[string, Schema]>;
}

export type PreProcessHandler = (contents: Schema[]) => Schema[];

export type Plugin = {
    meta: {
        name: string;
        version: string;
        description?: string;
    };
    preProcess?: (context: PluginContext) => Promise<PreProcessHandler | undefined>;
    postProcess?: (context: PluginContext) => Promise<TransformerFactory<SourceFile> | undefined>;
}
