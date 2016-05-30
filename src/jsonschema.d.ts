declare namespace json_schema_org {
    export type PositiveInteger = number;
    export type PositiveIntegerDefault0 = number;
    export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
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
        maxLength?: PositiveInteger;
        minLength?: PositiveIntegerDefault0;
        pattern?: string; // regex
        additionalItems?: boolean | this;
        // items?: this | this[];
        items?: this;
        maxItems?: PositiveInteger;
        minItems?: PositiveIntegerDefault0;
        uniqueItems?: boolean;
        maxProperties?: PositiveInteger;
        minProperties?: PositiveIntegerDefault0;
        required?: string[];
        additionalProperties?: boolean | this;
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
            [name: string]: Schema | string[];
        };
        enum?: any[];
        type?: SimpleTypes | SimpleTypes[];
        allOf?: this[];
        anyOf?: this[];
        oneOf?: this[];
        not?: this;
    }
}
