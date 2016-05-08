declare namespace json_schema_org {
  namespace draft_04 {
    export interface SchemaArray extends Array<Hyperschema> {}
    export interface LinkDescription {
      // a URI template, as defined by RFC 6570, with the addition of the $, ( and ) characters for pre-processing
      href: string;
      // relation to the target resource of the link
      rel: string;
      // a title for the link
      title?: string;
      // JSON Schema describing the link target
      targetSchema?: Hyperschema;
      // media type (as defined by RFC 2046) describing the link target
      mediaType?: string;
      // method for requesting the target of the link (e.g. for HTTP this might be "GET" or "DELETE")
      method?: string;
      // The media type in which to submit data along with the request
      encType?: string;
      // Schema describing the data to submit along with the request
      schema?: Hyperschema;
    }
    export interface Hyperschema {
      additionalItems?: boolean | Hyperschema;
      additionalProperties?: boolean | Hyperschema;
      dependencies?: any;
      items?: Hyperschema | SchemaArray;
      definitions?: any;
      patternProperties?: any;
      properties?: any;
      allOf?: SchemaArray;
      anyOf?: SchemaArray;
      oneOf?: SchemaArray;
      not?: Hyperschema;
      links?: LinkDescription[];
      fragmentResolution?: string;
      media?: {
        // A media type, as described in RFC 2046
        type?: string;
        // A content encoding scheme, as described in RFC 2045
        binaryEncoding?: string;
      };
      // Instances' URIs must start with this value for this schema to apply to them
      pathStart?: string; // uri
    }

    export type PositiveInteger = number;
    export interface PositiveIntegerDefault0 {}
    export interface SchemaArray extends Array<Schema> {}
    export interface StringArray extends Array<string> {}
    export interface SimpleTypes {}
    // Core schema meta-schema
    export interface Schema {
      id?: string; // uri
      $schema?: string; // uri
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
