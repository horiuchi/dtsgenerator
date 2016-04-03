declare namespace json_schema_org {
    namespace draft_04 {
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
            maxLength?: number;
            minLength?: number;
            pattern?: string; // regex
            additionalItems?: boolean | this;
            items?: this | this[];
            maxItems?: number;
            minItems?: number;
            uniqueItems?: boolean;
            maxProperties?: number;
            minProperties?: number;
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
            type?: ("array" | "boolean" | "integer" | "null" | "number" | "object" | "string") | ("array" | "boolean" | "integer" | "null" | "number" | "object" | "string")[];
            allOf?: this[];
            anyOf?: this[];
            oneOf?: this[];
            not?: this;
        }
    }
}
