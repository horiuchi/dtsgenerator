declare namespace JsonSchemaOrg {
    namespace Draft04 {
        /**
         * Core schema meta-schema
         */
        export interface Schema {
            id?: string;
            $schema?: string;
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
            namespace Properties {
                export type Default = any;
                export type Description = string;
                export type Enum = any[];
                export type ExclusiveMaximum = boolean;
                export type ExclusiveMinimum = boolean;
                export type Maximum = number;
                export type Minimum = number;
                export type MultipleOf = number;
                export type Pattern = string; // regex
                export type Title = string;
                export type Type = Definitions.SimpleTypes | [
                    Definitions.SimpleTypes,
                    ...Definitions.SimpleTypes[]
                ];
                export type UniqueItems = boolean;
            }
        }
    }
}
declare namespace SwaggerIo {
    namespace V2 {
        /**
         * A JSON Schema for Swagger 2.0 API.
         */
        export interface SchemaJson {
            /**
             * The Swagger version of this document.
             */
            swagger: "2.0";
            info: /* General information about the API. */ SchemaJson.Definitions.Info;
            /**
             * The host (name or ip) of the API. Example: 'swagger.io'
             */
            host?: string; // ^[^{}/ :\\]+(?::\d+)?$
            /**
             * The base path to the API. Example: '/api'.
             */
            basePath?: string; // ^/
            schemes?: /* The transfer protocol of the API. */ SchemaJson.Definitions.SchemesList;
            /**
             * A list of MIME types accepted by the API.
             */
            consumes?: /* The MIME type of the HTTP message. */ SchemaJson.Definitions.MimeType[];
            /**
             * A list of MIME types the API can produce.
             */
            produces?: /* The MIME type of the HTTP message. */ SchemaJson.Definitions.MimeType[];
            paths: /* Relative paths to the individual endpoints. They must be relative to the 'basePath'. */ SchemaJson.Definitions.Paths;
            definitions?: /* One or more JSON objects describing the schemas being consumed and produced by the API. */ SchemaJson.Definitions.Definitions;
            parameters?: /* One or more JSON representations for parameters */ SchemaJson.Definitions.ParameterDefinitions;
            responses?: /* One or more JSON representations for responses */ SchemaJson.Definitions.ResponseDefinitions;
            security?: SchemaJson.Definitions.Security;
            securityDefinitions?: SchemaJson.Definitions.SecurityDefinitions;
            tags?: SchemaJson.Definitions.Tag[];
            externalDocs?: /* information about external documentation */ SchemaJson.Definitions.ExternalDocs;
            [pattern: string]: /* Any property starting with x- is valid. */ SchemaJson.Definitions.VendorExtension; /* Patterns: ^x- */
        }
        namespace SchemaJson {
            namespace Definitions {
                export interface ApiKeySecurity {
                    type: "apiKey";
                    name: string;
                    in: "header" | "query";
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface BasicAuthenticationSecurity {
                    type: "basic";
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface BodyParameter {
                    /**
                     * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The name of the parameter.
                     */
                    name: string;
                    /**
                     * Determines the location of the parameter.
                     */
                    in: "body";
                    /**
                     * Determines whether or not this parameter is required or optional.
                     */
                    required?: boolean;
                    schema: /* A deterministic version of a JSON Schema object. */ Schema;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export type CollectionFormat = "csv" | "ssv" | "tsv" | "pipes";
                export type CollectionFormatWithMulti = "csv" | "ssv" | "tsv" | "pipes" | "multi";
                /**
                 * Contact information for the owners of the API.
                 */
                export interface Contact {
                    /**
                     * The identifying name of the contact person/organization.
                     */
                    name?: string;
                    /**
                     * The URL pointing to the contact information.
                     */
                    url?: string; // uri
                    /**
                     * The email address of the contact person/organization.
                     */
                    email?: string; // email
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export type Default = JsonSchemaOrg.Draft04.Schema.Properties.Default;
                /**
                 * One or more JSON objects describing the schemas being consumed and produced by the API.
                 */
                export interface Definitions {
                    [name: string]: /* A deterministic version of a JSON Schema object. */ Schema;
                }
                export type Enum = JsonSchemaOrg.Draft04.Schema.Properties.Enum;
                export interface Examples {
                    [name: string]: any;
                }
                export type ExclusiveMaximum = JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMaximum;
                export type ExclusiveMinimum = JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMinimum;
                /**
                 * information about external documentation
                 */
                export interface ExternalDocs {
                    description?: string;
                    url: string; // uri
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                /**
                 * A deterministic version of a JSON Schema object.
                 */
                export interface FileSchema {
                    format?: string;
                    title?: JsonSchemaOrg.Draft04.Schema.Properties.Title;
                    description?: JsonSchemaOrg.Draft04.Schema.Properties.Description;
                    default?: JsonSchemaOrg.Draft04.Schema.Properties.Default;
                    required?: JsonSchemaOrg.Draft04.Schema.Definitions.StringArray;
                    type: "file";
                    readOnly?: boolean;
                    externalDocs?: /* information about external documentation */ ExternalDocs;
                    example?: any;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface FormDataParameterSubSchema {
                    /**
                     * Determines whether or not this parameter is required or optional.
                     */
                    required?: boolean;
                    /**
                     * Determines the location of the parameter.
                     */
                    in?: "formData";
                    /**
                     * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The name of the parameter.
                     */
                    name?: string;
                    /**
                     * allows sending a parameter by name only or with an empty value.
                     */
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface HeaderParameterSubSchema {
                    /**
                     * Determines whether or not this parameter is required or optional.
                     */
                    required?: boolean;
                    /**
                     * Determines the location of the parameter.
                     */
                    in?: "header";
                    /**
                     * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The name of the parameter.
                     */
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Headers {
                    [name: string]: Header;
                }
                /**
                 * General information about the API.
                 */
                export interface Info {
                    /**
                     * A unique and precise title of the API.
                     */
                    title: string;
                    /**
                     * A semantic version number of the API.
                     */
                    version: string;
                    /**
                     * A longer description of the API. Should be different from the title.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The terms of service for the API.
                     */
                    termsOfService?: string;
                    contact?: /* Contact information for the owners of the API. */ Contact;
                    license?: License;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface JsonReference {
                    $ref: string;
                }
                export interface License {
                    /**
                     * The name of the license type. It's encouraged to use an OSI compatible license.
                     */
                    name: string;
                    /**
                     * The URL pointing to the license.
                     */
                    url?: string; // uri
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export type MaxItems = JsonSchemaOrg.Draft04.Schema.Definitions.PositiveInteger;
                export type MaxLength = JsonSchemaOrg.Draft04.Schema.Definitions.PositiveInteger;
                export type Maximum = JsonSchemaOrg.Draft04.Schema.Properties.Maximum;
                export type MediaTypeList = /* The MIME type of the HTTP message. */ MimeType[];
                /**
                 * The MIME type of the HTTP message.
                 */
                export type MimeType = string;
                export type MinItems = JsonSchemaOrg.Draft04.Schema.Definitions.PositiveIntegerDefault0;
                export type MinLength = JsonSchemaOrg.Draft04.Schema.Definitions.PositiveIntegerDefault0;
                export type Minimum = JsonSchemaOrg.Draft04.Schema.Properties.Minimum;
                export type MultipleOf = JsonSchemaOrg.Draft04.Schema.Properties.MultipleOf;
                export type NonBodyParameter = HeaderParameterSubSchema | FormDataParameterSubSchema | QueryParameterSubSchema | PathParameterSubSchema;
                export interface Oauth2AccessCodeSecurity {
                    type: "oauth2";
                    flow: "accessCode";
                    scopes?: Oauth2Scopes;
                    authorizationUrl: string; // uri
                    tokenUrl: string; // uri
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Oauth2ApplicationSecurity {
                    type: "oauth2";
                    flow: "application";
                    scopes?: Oauth2Scopes;
                    tokenUrl: string; // uri
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Oauth2ImplicitSecurity {
                    type: "oauth2";
                    flow: "implicit";
                    scopes?: Oauth2Scopes;
                    authorizationUrl: string; // uri
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Oauth2PasswordSecurity {
                    type: "oauth2";
                    flow: "password";
                    scopes?: Oauth2Scopes;
                    tokenUrl: string; // uri
                    description?: string;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Oauth2Scopes {
                    [name: string]: string;
                }
                export interface Operation {
                    tags?: string[];
                    /**
                     * A brief summary of the operation.
                     */
                    summary?: string;
                    /**
                     * A longer description of the operation, GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    externalDocs?: /* information about external documentation */ ExternalDocs;
                    /**
                     * A unique identifier of the operation.
                     */
                    operationId?: string;
                    /**
                     * A list of MIME types the API can produce.
                     */
                    produces?: /* The MIME type of the HTTP message. */ MimeType[];
                    /**
                     * A list of MIME types the API can consume.
                     */
                    consumes?: /* The MIME type of the HTTP message. */ MimeType[];
                    parameters?: /* The parameters needed to send a valid API call. */ ParametersList;
                    responses: /* Response objects names can either be any valid HTTP status code or 'default'. */ Responses;
                    schemes?: /* The transfer protocol of the API. */ SchemesList;
                    deprecated?: boolean;
                    security?: Security;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export type Parameter = BodyParameter | NonBodyParameter;
                /**
                 * One or more JSON representations for parameters
                 */
                export interface ParameterDefinitions {
                    [name: string]: Parameter;
                }
                /**
                 * The parameters needed to send a valid API call.
                 */
                export type ParametersList = (Parameter | JsonReference)[];
                export interface PathItem {
                    $ref?: string;
                    get?: Operation;
                    put?: Operation;
                    post?: Operation;
                    delete?: Operation;
                    options?: Operation;
                    head?: Operation;
                    patch?: Operation;
                    parameters?: /* The parameters needed to send a valid API call. */ ParametersList;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface PathParameterSubSchema {
                    /**
                     * Determines whether or not this parameter is required or optional.
                     */
                    required: true;
                    /**
                     * Determines the location of the parameter.
                     */
                    in?: "path";
                    /**
                     * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The name of the parameter.
                     */
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                /**
                 * Relative paths to the individual endpoints. They must be relative to the 'basePath'.
                 */
                export interface Paths {
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension | PathItem; /* Patterns: ^x- | ^/ */
                }
                export type Pattern = JsonSchemaOrg.Draft04.Schema.Properties.Pattern /* regex */;
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface QueryParameterSubSchema {
                    /**
                     * Determines whether or not this parameter is required or optional.
                     */
                    required?: boolean;
                    /**
                     * Determines the location of the parameter.
                     */
                    in?: "query";
                    /**
                     * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                     */
                    description?: string;
                    /**
                     * The name of the parameter.
                     */
                    name?: string;
                    /**
                     * allows sending a parameter by name only or with an empty value.
                     */
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
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export interface Response {
                    description: string;
                    schema?: /* A deterministic version of a JSON Schema object. */ Schema | /* A deterministic version of a JSON Schema object. */ FileSchema;
                    headers?: Headers;
                    examples?: Examples;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                /**
                 * One or more JSON representations for responses
                 */
                export interface ResponseDefinitions {
                    [name: string]: Response;
                }
                export type ResponseValue = Response | JsonReference;
                /**
                 * Response objects names can either be any valid HTTP status code or 'default'.
                 */
                export interface Responses {
                    [pattern: string]: ResponseValue | /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^([0-9]{3})$|^(default)$ | ^x- */
                }
                /**
                 * A deterministic version of a JSON Schema object.
                 */
                export interface Schema {
                    $ref?: string;
                    format?: string;
                    title?: JsonSchemaOrg.Draft04.Schema.Properties.Title;
                    description?: JsonSchemaOrg.Draft04.Schema.Properties.Description;
                    default?: JsonSchemaOrg.Draft04.Schema.Properties.Default;
                    multipleOf?: JsonSchemaOrg.Draft04.Schema.Properties.MultipleOf;
                    maximum?: JsonSchemaOrg.Draft04.Schema.Properties.Maximum;
                    exclusiveMaximum?: JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMaximum;
                    minimum?: JsonSchemaOrg.Draft04.Schema.Properties.Minimum;
                    exclusiveMinimum?: JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMinimum;
                    maxLength?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveInteger;
                    minLength?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveIntegerDefault0;
                    pattern?: JsonSchemaOrg.Draft04.Schema.Properties.Pattern /* regex */;
                    maxItems?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveInteger;
                    minItems?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveIntegerDefault0;
                    uniqueItems?: JsonSchemaOrg.Draft04.Schema.Properties.UniqueItems;
                    maxProperties?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveInteger;
                    minProperties?: JsonSchemaOrg.Draft04.Schema.Definitions.PositiveIntegerDefault0;
                    required?: JsonSchemaOrg.Draft04.Schema.Definitions.StringArray;
                    enum?: JsonSchemaOrg.Draft04.Schema.Properties.Enum;
                    additionalProperties?: /* A deterministic version of a JSON Schema object. */ Schema | boolean;
                    type?: JsonSchemaOrg.Draft04.Schema.Properties.Type;
                    items?: /* A deterministic version of a JSON Schema object. */ Schema | [
                        /* A deterministic version of a JSON Schema object. */ Schema,
                        .../* A deterministic version of a JSON Schema object. */ Schema[]
                    ];
                    allOf?: [
                        /* A deterministic version of a JSON Schema object. */ Schema,
                        .../* A deterministic version of a JSON Schema object. */ Schema[]
                    ];
                    properties?: {
                        [name: string]: /* A deterministic version of a JSON Schema object. */ Schema;
                    };
                    discriminator?: string;
                    readOnly?: boolean;
                    xml?: Xml;
                    externalDocs?: /* information about external documentation */ ExternalDocs;
                    example?: any;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                /**
                 * The transfer protocol of the API.
                 */
                export type SchemesList = ("http" | "https" | "ws" | "wss")[];
                export type Security = SecurityRequirement[];
                export interface SecurityDefinitions {
                    [name: string]: BasicAuthenticationSecurity | ApiKeySecurity | Oauth2ImplicitSecurity | Oauth2PasswordSecurity | Oauth2ApplicationSecurity | Oauth2AccessCodeSecurity;
                }
                export interface SecurityRequirement {
                    [name: string]: string[];
                }
                export interface Tag {
                    name: string;
                    description?: string;
                    externalDocs?: /* information about external documentation */ ExternalDocs;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
                export type UniqueItems = JsonSchemaOrg.Draft04.Schema.Properties.UniqueItems;
                /**
                 * Any property starting with x- is valid.
                 */
                export interface VendorExtension {
                    [name: string]: any;
                }
                export interface Xml {
                    name?: string;
                    namespace?: string;
                    prefix?: string;
                    attribute?: boolean;
                    wrapped?: boolean;
                    [pattern: string]: /* Any property starting with x- is valid. */ VendorExtension; /* Patterns: ^x- */
                }
            }
        }
    }
}
