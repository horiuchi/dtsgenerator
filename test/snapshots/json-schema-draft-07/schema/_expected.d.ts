declare namespace JsonSchemaOrg {
    namespace Draft07 {
        /**
         * Core schema meta-schema
         */
        export type Schema = {
            $id?: string; // uri-reference
            $schema?: string; // uri
            $ref?: string; // uri-reference
            $comment?: string;
            title?: string;
            description?: string;
            default?: any;
            readOnly?: boolean;
            examples?: any[];
            multipleOf?: number;
            maximum?: number;
            exclusiveMaximum?: number;
            minimum?: number;
            exclusiveMinimum?: number;
            maxLength?: Schema.Definitions.NonNegativeInteger;
            minLength?: Schema.Definitions.NonNegativeIntegerDefault0;
            pattern?: string; // regex
            additionalItems?: /* Core schema meta-schema */ Schema;
            items?: /* Core schema meta-schema */ Schema | Schema.Definitions.SchemaArray;
            maxItems?: Schema.Definitions.NonNegativeInteger;
            minItems?: Schema.Definitions.NonNegativeIntegerDefault0;
            uniqueItems?: boolean;
            contains?: /* Core schema meta-schema */ Schema;
            maxProperties?: Schema.Definitions.NonNegativeInteger;
            minProperties?: Schema.Definitions.NonNegativeIntegerDefault0;
            required?: Schema.Definitions.StringArray;
            additionalProperties?: /* Core schema meta-schema */ Schema;
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
            propertyNames?: /* Core schema meta-schema */ Schema;
            const?: any;
            enum?: [
                any,
                ...any[]
            ];
            type?: Schema.Definitions.SimpleTypes | [
                Schema.Definitions.SimpleTypes,
                ...Schema.Definitions.SimpleTypes[]
            ];
            format?: string;
            contentMediaType?: string;
            contentEncoding?: string;
            if?: /* Core schema meta-schema */ Schema;
            then?: /* Core schema meta-schema */ Schema;
            else?: /* Core schema meta-schema */ Schema;
            allOf?: Schema.Definitions.SchemaArray;
            anyOf?: Schema.Definitions.SchemaArray;
            oneOf?: Schema.Definitions.SchemaArray;
            not?: /* Core schema meta-schema */ Schema;
        } | boolean;
        namespace Schema {
            namespace Definitions {
                export type NonNegativeInteger = number;
                export type NonNegativeIntegerDefault0 = number;
                export type SchemaArray = [
                    /* Core schema meta-schema */ Schema,
                    .../* Core schema meta-schema */ Schema[]
                ];
                export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
                export type StringArray = string[];
            }
        }
    }
}
