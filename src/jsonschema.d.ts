/**
 * Core schema meta-schema
 */
declare interface Schema {
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
        [name: string]: Schema;
    };
    properties?: {
        [name: string]: Schema;
    };
    patternProperties?: {
        [name: string]: Schema;
    };
    dependencies?: {
        [name: string]: any;
    };
    enum?: string[];
    type?: string|string[];
    allOf?: Schema[];
    anyOf?: Schema[];
    oneOf?: Schema[];
    not?: Schema;
}

