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
            additionalItems?: boolean | Schema;
            items?: Schema | Schema.Definitions.SchemaArray;
            maxItems?: Schema.Definitions.PositiveInteger;
            minItems?: Schema.Definitions.PositiveIntegerDefault0;
            uniqueItems?: boolean;
            maxProperties?: Schema.Definitions.PositiveInteger;
            minProperties?: Schema.Definitions.PositiveIntegerDefault0;
            required?: Schema.Definitions.StringArray;
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
                [name: string]: Schema | Schema.Definitions.StringArray;
            };
            enum?: any[];
            type?: Schema.Definitions.SimpleTypes | Schema.Definitions.SimpleTypes[];
            format?: string;
            allOf?: Schema.Definitions.SchemaArray;
            anyOf?: Schema.Definitions.SchemaArray;
            oneOf?: Schema.Definitions.SchemaArray;
            not?: Schema;
        }
        namespace Schema {
            namespace Definitions {
                export type PositiveInteger = number;
                export type PositiveIntegerDefault0 = number;
                export type SchemaArray = Schema[];
                export type SimpleTypes = "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";
                export type StringArray = string[];
            }
            namespace Properties {
                export type Enum = any[];
                export type ExclusiveMaximum = boolean;
                export type ExclusiveMinimum = boolean;
                export type MaxItems = Definitions.PositiveInteger;
                export type MaxLength = Definitions.PositiveInteger;
                export type MaxProperties = Definitions.PositiveInteger;
                export type Maximum = number;
                export type MinItems = Definitions.PositiveIntegerDefault0;
                export type MinLength = Definitions.PositiveIntegerDefault0;
                export type MinProperties = Definitions.PositiveIntegerDefault0;
                export type Minimum = number;
                export type MultipleOf = number;
                export type Pattern = string; // regex
                export type Required = Definitions.StringArray;
                export type Title = string;
                export type UniqueItems = boolean;
            }
        }
    }
}
declare namespace OpenapisOrg {
    namespace V3 {
        /**
         * A JSON Schema for OpenAPI 3.0.
         * This is the root document object of the OpenAPI document.
         */
        export interface SchemaJson {
            openapi: string;
            info: SchemaJson.Definitions.Info;
            servers?: SchemaJson.Definitions.Server[];
            paths: SchemaJson.Definitions.Paths;
            components?: SchemaJson.Definitions.Components;
            security?: SchemaJson.Definitions.SecurityRequirement[];
            tags?: SchemaJson.Definitions.Tag[];
            externalDocs?: SchemaJson.Definitions.ExternalDocs;
        }
        namespace SchemaJson {
            namespace Definitions {
                export interface Any {
                    [name: string]: any;
                }
                export type AnyOrExpression = Any | Expression;
                export interface AnysOrExpressions {
                    [name: string]: AnyOrExpression;
                }
                /**
                 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a Path Item Object that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
                 */
                export interface Callback {
                }
                export type CallbackOrReference = Callback | Reference;
                export interface CallbacksOrReferences {
                    [name: string]: CallbackOrReference;
                }
                /**
                 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.
                 */
                export interface Components {
                    schemas?: SchemasOrReferences;
                    responses?: ResponsesOrReferences;
                    parameters?: ParametersOrReferences;
                    examples?: ExamplesOrReferences;
                    requestBodies?: RequestBodiesOrReferences;
                    headers?: HeadersOrReferences;
                    securitySchemes?: SecuritySchemesOrReferences;
                    links?: LinksOrReferences;
                    callbacks?: CallbacksOrReferences;
                }
                /**
                 * Contact information for the exposed API.
                 */
                export interface Contact {
                    name?: string;
                    url?: string; // uri
                    email?: string; // email
                }
                export type DefaultType = null | any[] | {
                } | number | boolean | string;
                /**
                 * When request bodies or response payloads may be one of a number of different schemas, a `discriminator` object can be used to aid in serialization, deserialization, and validation.  The discriminator is a specific object in a schema which is used to inform the consumer of the specification of an alternative schema based on the value associated with it.  When using the discriminator, _inline_ schemas will not be considered.
                 */
                export interface Discriminator {
                    propertyName: string;
                    mapping?: Strings;
                }
                /**
                 * A single encoding definition applied to a single schema property.
                 */
                export interface Encoding {
                    contentType?: string;
                    headers?: HeadersOrReferences;
                    style?: string;
                    explode?: boolean;
                    allowReserved?: boolean;
                }
                export interface Encodings {
                    [name: string]: Encoding;
                }
                /**
                 * 
                 */
                export interface Example {
                    summary?: string;
                    description?: string;
                    value?: Any;
                    externalValue?: string;
                }
                export type ExampleOrReference = Example | Reference;
                export interface ExamplesOrReferences {
                    [name: string]: ExampleOrReference;
                }
                export interface Expression {
                    [name: string]: any;
                }
                /**
                 * Allows referencing an external resource for extended documentation.
                 */
                export interface ExternalDocs {
                    description?: string;
                    url: string;
                }
                /**
                 * The Header Object follows the structure of the Parameter Object with the following changes:  1. `name` MUST NOT be specified, it is given in the corresponding `headers` map. 1. `in` MUST NOT be specified, it is implicitly in `header`. 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, `style`).
                 */
                export interface Header {
                    description?: string;
                    required?: boolean;
                    deprecated?: boolean;
                    allowEmptyValue?: boolean;
                    style?: string;
                    explode?: boolean;
                    allowReserved?: boolean;
                    schema?: SchemaOrReference;
                    example?: Any;
                    examples?: ExamplesOrReferences;
                    content?: MediaTypes;
                }
                export type HeaderOrReference = Header | Reference;
                export interface HeadersOrReferences {
                    [name: string]: HeaderOrReference;
                }
                /**
                 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
                 */
                export interface Info {
                    title: string;
                    description?: string;
                    termsOfService?: string;
                    contact?: Contact;
                    license?: License;
                    version: string;
                }
                /**
                 * License information for the exposed API.
                 */
                export interface License {
                    name: string;
                    url?: string;
                }
                /**
                 * The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.  Unlike _dynamic_ links (i.e. links provided **in** the response payload), the OAS linking mechanism does not require link information in the runtime response.  For computing links, and providing instructions to execute them, a runtime expression is used for accessing values in an operation and using them as parameters while invoking the linked operation.
                 */
                export interface Link {
                    operationRef?: string;
                    operationId?: string;
                    parameters?: AnysOrExpressions;
                    requestBody?: AnyOrExpression;
                    description?: string;
                    server?: Server;
                }
                export type LinkOrReference = Link | Reference;
                export interface LinksOrReferences {
                    [name: string]: LinkOrReference;
                }
                /**
                 * Each Media Type Object provides schema and examples for the media type identified by its key.
                 */
                export interface MediaType {
                    schema?: SchemaOrReference;
                    example?: Any;
                    examples?: ExamplesOrReferences;
                    encoding?: Encodings;
                }
                export interface MediaTypes {
                    [name: string]: MediaType;
                }
                /**
                 * Configuration details for a supported OAuth Flow
                 */
                export interface OauthFlow {
                    authorizationUrl?: string;
                    tokenUrl?: string;
                    refreshUrl?: string;
                    scopes?: Strings;
                }
                /**
                 * Allows configuration of the supported OAuth Flows.
                 */
                export interface OauthFlows {
                    implicit?: OauthFlow;
                    password?: OauthFlow;
                    clientCredentials?: OauthFlow;
                    authorizationCode?: OauthFlow;
                }
                /**
                 * Describes a single API operation on a path.
                 */
                export interface Operation {
                    tags?: string[];
                    summary?: string;
                    description?: string;
                    externalDocs?: ExternalDocs;
                    operationId?: string;
                    parameters?: ParameterOrReference[];
                    requestBody?: RequestBodyOrReference;
                    responses: Responses;
                    callbacks?: CallbacksOrReferences;
                    deprecated?: boolean;
                    security?: SecurityRequirement[];
                    servers?: Server[];
                }
                /**
                 * Describes a single operation parameter.  A unique parameter is defined by a combination of a name and location.
                 */
                export interface Parameter {
                    name: string;
                    in: string;
                    description?: string;
                    required?: boolean;
                    deprecated?: boolean;
                    allowEmptyValue?: boolean;
                    style?: string;
                    explode?: boolean;
                    allowReserved?: boolean;
                    schema?: SchemaOrReference;
                    example?: Any;
                    examples?: ExamplesOrReferences;
                    content?: MediaTypes;
                }
                export type ParameterOrReference = Parameter | Reference;
                export interface ParametersOrReferences {
                    [name: string]: ParameterOrReference;
                }
                /**
                 * Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
                 */
                export interface PathItem {
                    $ref?: string;
                    summary?: string;
                    description?: string;
                    get?: Operation;
                    put?: Operation;
                    post?: Operation;
                    delete?: Operation;
                    options?: Operation;
                    head?: Operation;
                    patch?: Operation;
                    trace?: Operation;
                    servers?: Server[];
                    parameters?: ParameterOrReference[];
                }
                /**
                 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the `Server Object` in order to construct the full URL.  The Paths MAY be empty, due to ACL constraints.
                 */
                export interface Paths {
                }
                /**
                 * A simple object to allow referencing other components in the specification, internally and externally.  The Reference Object is defined by JSON Reference and follows the same structure, behavior and rules.   For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.
                 */
                export interface Reference {
                    $ref: string;
                }
                export interface RequestBodiesOrReferences {
                    [name: string]: RequestBodyOrReference;
                }
                /**
                 * Describes a single request body.
                 */
                export interface RequestBody {
                    description?: string;
                    content: MediaTypes;
                    required?: boolean;
                }
                export type RequestBodyOrReference = RequestBody | Reference;
                /**
                 * Describes a single response from an API Operation, including design-time, static  `links` to operations based on the response.
                 */
                export interface Response {
                    description: string;
                    headers?: HeadersOrReferences;
                    content?: MediaTypes;
                    links?: LinksOrReferences;
                }
                export type ResponseOrReference = Response | Reference;
                /**
                 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.  The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.  The `default` MAY be used as a default response object for all HTTP codes  that are not covered individually by the specification.  The `Responses Object` MUST contain at least one response code, and it  SHOULD be the response for a successful operation call.
                 */
                export interface Responses {
                    default?: ResponseOrReference;
                }
                export interface ResponsesOrReferences {
                    [name: string]: ResponseOrReference;
                }
                /**
                 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the JSON Schema Specification Wright Draft 00.  For more information about the properties, see JSON Schema Core and JSON Schema Validation. Unless stated otherwise, the property definitions follow the JSON Schema.
                 */
                export interface Schema {
                    nullable?: boolean;
                    discriminator?: Discriminator;
                    readOnly?: boolean;
                    writeOnly?: boolean;
                    xml?: Xml;
                    externalDocs?: ExternalDocs;
                    example?: Any;
                    deprecated?: boolean;
                    title?: JsonSchemaOrg.Draft04.Schema.Properties.Title;
                    multipleOf?: JsonSchemaOrg.Draft04.Schema.Properties.MultipleOf;
                    maximum?: JsonSchemaOrg.Draft04.Schema.Properties.Maximum;
                    exclusiveMaximum?: JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMaximum;
                    minimum?: JsonSchemaOrg.Draft04.Schema.Properties.Minimum;
                    exclusiveMinimum?: JsonSchemaOrg.Draft04.Schema.Properties.ExclusiveMinimum;
                    maxLength?: JsonSchemaOrg.Draft04.Schema.Properties.MaxLength;
                    minLength?: JsonSchemaOrg.Draft04.Schema.Properties.MinLength;
                    pattern?: JsonSchemaOrg.Draft04.Schema.Properties.Pattern; // regex
                    maxItems?: JsonSchemaOrg.Draft04.Schema.Properties.MaxItems;
                    minItems?: JsonSchemaOrg.Draft04.Schema.Properties.MinItems;
                    uniqueItems?: JsonSchemaOrg.Draft04.Schema.Properties.UniqueItems;
                    maxProperties?: JsonSchemaOrg.Draft04.Schema.Properties.MaxProperties;
                    minProperties?: JsonSchemaOrg.Draft04.Schema.Properties.MinProperties;
                    required?: JsonSchemaOrg.Draft04.Schema.Properties.Required;
                    enum?: JsonSchemaOrg.Draft04.Schema.Properties.Enum;
                    type?: string;
                    allOf?: SchemaOrReference[];
                    oneOf?: SchemaOrReference[];
                    anyOf?: SchemaOrReference[];
                    not?: Schema;
                    items?: SchemaOrReference | SchemaOrReference[];
                    properties?: {
                        [name: string]: SchemaOrReference;
                    };
                    additionalProperties?: SchemaOrReference | boolean;
                    default?: DefaultType;
                    description?: string;
                    format?: string;
                }
                export type SchemaOrReference = Schema | Reference;
                export interface SchemasOrReferences {
                    [name: string]: SchemaOrReference;
                }
                /**
                 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the Security Schemes under the Components Object.  Security Requirement Objects that contain multiple schemes require that all schemes MUST be satisfied for a request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.  When a list of Security Requirement Objects is defined on the Open API object or Operation Object, only one of Security Requirement Objects in the list needs to be satisfied to authorize the request.
                 */
                export interface SecurityRequirement {
                }
                /**
                 * Defines a security scheme that can be used by the operations. Supported schemes are HTTP authentication, an API key (either as a header or as a query parameter), OAuth2's common flows (implicit, password, application and access code) as defined in RFC6749, and OpenID Connect Discovery.
                 */
                export interface SecurityScheme {
                    type: string;
                    description?: string;
                    name?: string;
                    in?: string;
                    scheme?: string;
                    bearerFormat?: string;
                    flows?: OauthFlows;
                    openIdConnectUrl?: string;
                }
                export type SecuritySchemeOrReference = SecurityScheme | Reference;
                export interface SecuritySchemesOrReferences {
                    [name: string]: SecuritySchemeOrReference;
                }
                /**
                 * An object representing a Server.
                 */
                export interface Server {
                    url: string;
                    description?: string;
                    variables?: ServerVariables;
                }
                /**
                 * An object representing a Server Variable for server URL template substitution.
                 */
                export interface ServerVariable {
                    enum?: string[];
                    default: string;
                    description?: string;
                }
                export interface ServerVariables {
                    [name: string]: ServerVariable;
                }
                /**
                 * Any property starting with x- is valid.
                 */
                export type SpecificationExtension = null | number | boolean | string | {
                } | any[];
                export interface Strings {
                    [name: string]: string;
                }
                /**
                 * Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
                 */
                export interface Tag {
                    name: string;
                    description?: string;
                    externalDocs?: ExternalDocs;
                }
                /**
                 * A metadata object that allows for more fine-tuned XML model definitions.  When using arrays, XML element names are *not* inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information. See examples for expected behavior.
                 */
                export interface Xml {
                    name?: string;
                    namespace?: string;
                    prefix?: string;
                    attribute?: boolean;
                    wrapped?: boolean;
                }
            }
        }
    }
}
