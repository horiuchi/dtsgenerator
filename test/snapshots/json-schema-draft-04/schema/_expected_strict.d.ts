declare namespace JsonSchemaOrg {
    namespace Draft04 {
        /**
         * Core schema meta-schema
         */
        export interface Schema {
            id?: string; // uri
            $schema?: string; // uri
            $ref?: string; // uri
            title?: string;
            description?: string;
            default?: any;
            multipleOf?: number;
            maximum?: number;
            exclusiveMaximum?: boolean;
            minimum?: number;
            exclusiveMinimum?: boolean;
            maxLength?: Schema.Definitions.PositiveInteger;
            minLength?: Schema.Definitions.PositiveIntegerDefault0;
            pattern?: string; // regex
            additionalItems?: boolean | /* Core schema meta-schema */ Schema;
            items?: /* Core schema meta-schema */ Schema | Schema.Definitions.SchemaArray;
            maxItems?: Schema.Definitions.PositiveInteger;
            minItems?: Schema.Definitions.PositiveIntegerDefault0;
            uniqueItems?: boolean;
            maxProperties?: Schema.Definitions.PositiveInteger;
            minProperties?: Schema.Definitions.PositiveIntegerDefault0;
            required?: Schema.Definitions.StringArray;
            additionalProperties?: boolean | /* Core schema meta-schema */ Schema;
            definitions?: {
                [name: string]: /* Core schema meta-schema */ Schema;
            };
            properties?: {
                [name: string]: /* Core schema meta-schema */ Schema;
            };
            patternProperties?: {
                [name: string]: /* Core schema meta-schema */ Schema;
            };
            dependencies?: {
                [name: string]: /* Core schema meta-schema */ Schema | Schema.Definitions.StringArray;
            };
            enum?: any[];
            type?: Schema.Definitions.SimpleTypes | [
                Schema.Definitions.SimpleTypes,
                ...Schema.Definitions.SimpleTypes[]
            ];
            format?: string;
            allOf?: Schema.Definitions.SchemaArray;
            anyOf?: Schema.Definitions.SchemaArray;
            oneOf?: Schema.Definitions.SchemaArray;
            not?: /* Core schema meta-schema */ Schema;
        }
        namespace Schema {
            namespace Definitions {
                export type PositiveInteger = number;
                export type PositiveIntegerDefault0 = number;
                export type SchemaArray = [
                    /* Core schema meta-schema */ Schema,
                    .../* Core schema meta-schema */ Schema[]
                ];
                export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
                export type StringArray = [
                    string,
                    ...string[]
                ];
            }
        }
    }
}
