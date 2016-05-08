declare namespace json_schema_org {
  namespace draft_04 {
    export type PositiveInteger = number;
    export interface PositiveIntegerDefault0 {}
    export interface SchemaArray extends Array<Schema> {}
    export interface StringArray extends Array<string> {}
    export interface SimpleTypes {}
    // Core schema meta-schema
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
      maxLength?: PositiveInteger;
      minLength?: PositiveIntegerDefault0;
      pattern?: string; // regex
      additionalItems?: boolean | Schema;
      items?: Schema | SchemaArray;
      maxItems?: PositiveInteger;
      minItems?: PositiveIntegerDefault0;
      uniqueItems?: boolean;
      maxProperties?: PositiveInteger;
      minProperties?: PositiveIntegerDefault0;
      required?: StringArray;
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
        [name: string]: Schema | StringArray;
      };
      enum?: any[];
      type?: SimpleTypes | SimpleTypes[];
      allOf?: SchemaArray;
      anyOf?: SchemaArray;
      oneOf?: SchemaArray;
      not?: Schema;
    }

  }
}
