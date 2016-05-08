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
declare namespace swagger_io {
  namespace v2 {
    // Any property starting with x- is valid.
    export interface VendorExtension {
      [name: string]: any;
    }
    // General information about the API.
    export interface Info {
      // A unique and precise title of the API.
      title: string;
      // A semantic version number of the API.
      version: string;
      // A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The terms of service for the API.
      termsOfService?: string;
      contact?: Contact;
      license?: License;
    }
    // The transfer protocol of the API.
    export interface SchemesList extends Array<("http" | "https" | "ws" | "wss")> {}
    export interface MediaTypeList extends Array<MimeType> {}
    // Relative paths to the individual endpoints. They must be relative to the 'basePath'.
    export interface Paths {}
    // One or more JSON objects describing the schemas being consumed and produced by the API.
    export interface Definitions {
      [name: string]: Schema;
    }
    // One or more JSON representations for parameters
    export interface ParameterDefinitions {
      [name: string]: Parameter;
    }
    // One or more JSON representations for parameters
    export interface ResponseDefinitions {
      [name: string]: Response;
    }
    export interface Security extends Array<SecurityRequirement> {}
    export interface SecurityDefinitions {
      [name: string]: BasicAuthenticationSecurity | ApiKeySecurity | Oauth2ImplicitSecurity | Oauth2PasswordSecurity | Oauth2ApplicationSecurity | Oauth2AccessCodeSecurity;
    }
    export interface Tag {
      name: string;
      description?: string;
      externalDocs?: ExternalDocs;
    }
    // information about external documentation
    export interface ExternalDocs {
      description?: string;
      url: string; // uri
    }
    // Contact information for the owners of the API.
    export interface Contact {
      // The identifying name of the contact person/organization.
      name?: string;
      // The URL pointing to the contact information.
      url?: string; // uri
      // The email address of the contact person/organization.
      email?: string; // email
    }
    export interface License {
      // The name of the license type. It's encouraged to use an OSI compatible license.
      name: string;
      // The URL pointing to the license.
      url?: string; // uri
    }
    export interface PathItem {
      $ref?: string;
      get?: Operation;
      put?: Operation;
      post?: Operation;
      delete?: Operation;
      options?: Operation;
      head?: Operation;
      patch?: Operation;
      parameters?: ParametersList;
    }
    // A deterministic version of a JSON Schema object.
    export interface Schema {
      $ref?: string;
      format?: string;
      title?: Title;
      description?: Description;
      default?: Default;
      multipleOf?: MultipleOf;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: PositiveInteger;
      minLength?: PositiveIntegerDefault0;
      pattern?: Pattern;
      maxItems?: PositiveInteger;
      minItems?: PositiveIntegerDefault0;
      uniqueItems?: UniqueItems;
      maxProperties?: PositiveInteger;
      minProperties?: PositiveIntegerDefault0;
      required?: StringArray;
      enum?: Enum;
      additionalProperties?: Schema | boolean;
      type?: Type;
      items?: Schema | Schema[];
      allOf?: Schema[];
      properties?: {
        [name: string]: Schema;
      };
      discriminator?: string;
      readOnly?: boolean;
      xml?: Xml;
      externalDocs?: ExternalDocs;
      example?: any;
    }
    export interface Parameter {}
    export interface Response {
      description: string;
      schema?: Schema | FileSchema;
      headers?: Headers;
      examples?: Examples;
    }
    // The parameters needed to send a valid API call.
    export interface ParametersList extends Array<(Parameter | JsonReference)> {}
    // Response objects names can either be any valid HTTP status code or 'default'.
    export interface Responses {}
    export interface Operation {
      tags?: string[];
      // A brief summary of the operation.
      summary?: string;
      // A longer description of the operation, GitHub Flavored Markdown is allowed.
      description?: string;
      externalDocs?: ExternalDocs;
      // A unique identifier of the operation.
      operationId?: string;
      // A list of MIME types the API can produce.
      produces?: MediaTypeList;
      // A list of MIME types the API can consume.
      consumes?: MediaTypeList;
      parameters?: ParametersList;
      responses: Responses;
      schemes?: SchemesList;
      deprecated?: boolean;
      security?: Security;
    }
    export interface ResponseValue {}
    export interface JsonReference {
      $ref: string;
    }
    // A deterministic version of a JSON Schema object.
    export interface FileSchema {
      format?: string;
      title?: Title;
      description?: Description;
      default?: Default;
      required?: StringArray;
      type: "file";
      readOnly?: boolean;
      externalDocs?: ExternalDocs;
      example?: any;
    }
    export interface Headers {
      [name: string]: Header;
    }
    export interface Examples {
      [name: string]: any;
    }
    export interface Header {
      type: "string" | "number" | "integer" | "boolean" | "array";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormat;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
      description?: string;
    }
    export interface PrimitivesItems {
      type?: "string" | "number" | "integer" | "boolean" | "array";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormat;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
    }
    export type CollectionFormat = ("csv" | "ssv" | "tsv" | "pipes");
    export interface Default extends Default{};export type Maximum = Maximum;
    export type ExclusiveMaximum = ExclusiveMaximum;
    export type Minimum = Minimum;
    export type ExclusiveMinimum = ExclusiveMinimum;
    export type MaxLength = PositiveInteger;
    export interface MinLength extends PositiveIntegerDefault0{};export type Pattern = Pattern;
    export type MaxItems = PositiveInteger;
    export interface MinItems extends PositiveIntegerDefault0{};export type UniqueItems = UniqueItems;
    export interface Enum extends Enum{};export type MultipleOf = MultipleOf;
    export type CollectionFormatWithMulti = ("csv" | "ssv" | "tsv" | "pipes" | "multi");
    export interface HeaderParameterSubSchema {
      // Determines whether or not this parameter is required or optional.
      required?: boolean;
      // Determines the location of the parameter.
      in?: "header";
      // A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The name of the parameter.
      name?: string;
      type?: "string" | "number" | "boolean" | "integer" | "array";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormat;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
    }
    export interface FormDataParameterSubSchema {
      // Determines whether or not this parameter is required or optional.
      required?: boolean;
      // Determines the location of the parameter.
      in?: "formData";
      // A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The name of the parameter.
      name?: string;
      // allows sending a parameter by name only or with an empty value.
      allowEmptyValue?: boolean;
      type?: "string" | "number" | "boolean" | "integer" | "array" | "file";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormatWithMulti;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
    }
    export interface QueryParameterSubSchema {
      // Determines whether or not this parameter is required or optional.
      required?: boolean;
      // Determines the location of the parameter.
      in?: "query";
      // A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The name of the parameter.
      name?: string;
      // allows sending a parameter by name only or with an empty value.
      allowEmptyValue?: boolean;
      type?: "string" | "number" | "boolean" | "integer" | "array";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormatWithMulti;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
    }
    export interface PathParameterSubSchema {
      // Determines whether or not this parameter is required or optional.
      required: "true";
      // Determines the location of the parameter.
      in?: "path";
      // A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The name of the parameter.
      name?: string;
      type?: "string" | "number" | "boolean" | "integer" | "array";
      format?: string;
      items?: PrimitivesItems;
      collectionFormat?: CollectionFormat;
      default?: Default;
      maximum?: Maximum;
      exclusiveMaximum?: ExclusiveMaximum;
      minimum?: Minimum;
      exclusiveMinimum?: ExclusiveMinimum;
      maxLength?: MaxLength;
      minLength?: MinLength;
      pattern?: Pattern;
      maxItems?: MaxItems;
      minItems?: MinItems;
      uniqueItems?: UniqueItems;
      enum?: Enum;
      multipleOf?: MultipleOf;
    }
    export interface BodyParameter {
      // A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
      description?: string;
      // The name of the parameter.
      name: string;
      // Determines the location of the parameter.
      in: "body";
      // Determines whether or not this parameter is required or optional.
      required?: boolean;
      schema: Schema;
    }
    export interface NonBodyParameter {}
    export interface Xml {
      name?: string;
      namespace?: string;
      prefix?: string;
      attribute?: boolean;
      wrapped?: boolean;
    }
    export interface SecurityRequirement {
      [name: string]: string[];
    }
    export interface BasicAuthenticationSecurity {
      type: "basic";
      description?: string;
    }
    export interface ApiKeySecurity {
      type: "apiKey";
      name: string;
      in: "header" | "query";
      description?: string;
    }
    export interface Oauth2ImplicitSecurity {
      type: "oauth2";
      flow: "implicit";
      scopes?: Oauth2Scopes;
      authorizationUrl: string; // uri
      description?: string;
    }
    export interface Oauth2PasswordSecurity {
      type: "oauth2";
      flow: "password";
      scopes?: Oauth2Scopes;
      tokenUrl: string; // uri
      description?: string;
    }
    export interface Oauth2ApplicationSecurity {
      type: "oauth2";
      flow: "application";
      scopes?: Oauth2Scopes;
      tokenUrl: string; // uri
      description?: string;
    }
    export interface Oauth2AccessCodeSecurity {
      type: "oauth2";
      flow: "accessCode";
      scopes?: Oauth2Scopes;
      authorizationUrl: string; // uri
      tokenUrl: string; // uri
      description?: string;
    }
    export interface Oauth2Scopes {
      [name: string]: string;
    }
    // The MIME type of the HTTP message.
    export type MimeType = string;
    export interface Schemajson {
      // The Swagger version of this document.
      swagger: "2.0";
      info: Info;
      // The host (name or ip) of the API. Example: 'swagger.io'
      host?: string; // ^[^{}/ :\\]+(?::\d+)?$
      // The base path to the API. Example: '/api'.
      basePath?: string; // ^/
      schemes?: SchemesList;
      // A list of MIME types accepted by the API.
      consumes?: MediaTypeList;
      // A list of MIME types the API can produce.
      produces?: MediaTypeList;
      paths: Paths;
      definitions?: Definitions;
      parameters?: ParameterDefinitions;
      responses?: ResponseDefinitions;
      security?: Security;
      securityDefinitions?: SecurityDefinitions;
      tags?: Tag[];
      externalDocs?: ExternalDocs;
    }
  }
}
