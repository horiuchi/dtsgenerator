import { Statement, TransformerFactory } from 'typescript';
import SchemaId from './schemaId';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { JsonSchemaDraft07 } from './jsonSchemaDraft07';

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

export interface PluginContext {
    option?: any;
    inputSchemas: Iterator<[string, Schema]>;
}

export interface Plugin {
    meta: {
        description: string;
    };
    create: (context: PluginContext) => Promise<TransformerFactory<Statement> | undefined>;
}
