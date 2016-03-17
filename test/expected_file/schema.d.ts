/**
 * Core schema meta-schema
 */
export interface JsonSchema {
    id?: string; // uri
    $schema?: string; // uri
    $ref?: string; // uri
    title?: string;
    description?: string;
    default?: any;
    format?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string; // regex
    additionalItems?: boolean | JsonSchema;
    items?: JsonSchema | JsonSchema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean | JsonSchema;
    definitions?: {
        [name: string]: JsonSchema;
    };
    properties?: {
        [name: string]: JsonSchema;
    };
    patternProperties?: {
        [name: string]: JsonSchema;
    };
    dependencies?: {
        [name: string]: JsonSchema | string[];
    };
    enum?: string[];
    type?: ("any" | "array" | "boolean" | "integer" | "null" | "number" | "object" | "string") | ("any" | "array" | "boolean" | "integer" | "null" | "number" | "object" | "string")[];
    allOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    not?: JsonSchema;
}
