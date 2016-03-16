/**
 * Core schema meta-schema
 */
declare interface JsonSchema {
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
    additionalItems?: any;
    items?: any;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: any;
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
        [name: string]: any;
    };
    enum?: string[];
    type?: any;
    allOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    not?: JsonSchema;
}

