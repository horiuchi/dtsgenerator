declare namespace JsonSchemaOrg {
    /**
     * Core schema meta-schema
     */
    export interface Schema {
        id?: string; // uri
        $schema?: string; // uri
        $ref?: string; // uri
        title?: string;
        description?: string;
        example?: string;
        default?: any;
        format?: string;
        multipleOf?: number;
        maximum?: number;
        exclusiveMaximum?: boolean;
        minimum?: number;
        exclusiveMinimum?: boolean;
        maxLength?: Schema.Definitions.PositiveInteger;
        minLength?: Schema.Definitions.PositiveIntegerDefault0;
        pattern?: string; // regex
        additionalItems?: boolean | Schema;
        items?: Schema | Schema.Definitions.SchemaArray;
        maxItems?: Schema.Definitions.PositiveInteger;
        minItems?: Schema.Definitions.PositiveIntegerDefault0;
        uniqueItems?: boolean;
        maxProperties?: Schema.Definitions.PositiveInteger;
        minProperties?: Schema.Definitions.PositiveIntegerDefault0;
        required?: Schema.Definitions.StringArray;
        additionalProperties?: boolean | Schema;
        definitions?: {
            [name: string]: Schema;
        };
        properties?: {
            [name: string]: Schema;
        };
        patternProperties?: {
            [name: string]: Schema;
        };
        dependencies?: {
            [name: string]: Schema | Schema.Definitions.StringArray;
        };
        enum?: any[];
        type?: Schema.Definitions.SimpleTypes | Schema.Definitions.SimpleTypes[];
        allOf?: Schema.Definitions.SchemaArray;
        anyOf?: Schema.Definitions.SchemaArray;
        oneOf?: Schema.Definitions.SchemaArray;
        not?: Schema;
    }
    namespace Schema {
        namespace Definitions {
            export type PositiveInteger = number;
            export type PositiveIntegerDefault0 = number;
            export interface SchemaArray extends Array<Schema> {
            }
            export type SimpleTypes = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string' | 'any' | 'undefined';
            export interface StringArray extends Array<string> {
            }
        }
    }
}
