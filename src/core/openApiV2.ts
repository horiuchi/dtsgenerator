/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';

export namespace OpenApisV2 {
    /**
     * A JSON Schema for Swagger 2.0 API.
     */
    export interface SchemaJson {
        /**
         * The Swagger version of this document.
         */
        swagger: '2.0';
        info: SchemaJson.Definitions.Info;
        /**
         * The host (name or ip) of the API. Example: 'swagger.io'
         */
        host?: string; // ^[^{}/ :\\]+(?::\d+)?$
        /**
         * The base path to the API. Example: '/api'.
         */
        basePath?: string; // ^/
        schemes?: SchemaJson.Definitions.SchemesList;
        /**
         * A list of MIME types accepted by the API.
         */
        consumes?: SchemaJson.Definitions.MimeType[];
        /**
         * A list of MIME types the API can produce.
         */
        produces?: SchemaJson.Definitions.MimeType[];
        paths: SchemaJson.Definitions.Paths;
        definitions?: SchemaJson.Definitions.Definitions;
        parameters?: SchemaJson.Definitions.ParameterDefinitions;
        responses?: SchemaJson.Definitions.ResponseDefinitions;
        security?: SchemaJson.Definitions.Security;
        securityDefinitions?: SchemaJson.Definitions.SecurityDefinitions;
        tags?: SchemaJson.Definitions.Tag[];
        externalDocs?: SchemaJson.Definitions.ExternalDocs;
    }
    export namespace SchemaJson {
        export namespace Definitions {
            export interface ApiKeySecurity {
                type: 'apiKey';
                name: string;
                in: 'header' | 'query';
                description?: string;
            }
            export interface BasicAuthenticationSecurity {
                type: 'basic';
                description?: string;
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
                in: 'body';
                /**
                 * Determines whether or not this parameter is required or optional.
                 */
                required?: boolean;
                schema: JsonSchemaDraft04.Schema;
            }
            export type CollectionFormat = 'csv' | 'ssv' | 'tsv' | 'pipes';
            export type CollectionFormatWithMulti =
                | 'csv'
                | 'ssv'
                | 'tsv'
                | 'pipes'
                | 'multi';
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
            }
            export type Default = JsonSchemaDraft04.Schema.Properties.Default;
            /**
             * One or more JSON objects describing the schemas being consumed and produced by the API.
             */
            export interface Definitions {
                [name: string]: JsonSchemaDraft04.Schema;
            }
            export type Enum = JsonSchemaDraft04.Schema.Properties.Enum;
            export interface Examples {
                [name: string]: any;
            }
            export type ExclusiveMaximum = JsonSchemaDraft04.Schema.Properties.ExclusiveMaximum;
            export type ExclusiveMinimum = JsonSchemaDraft04.Schema.Properties.ExclusiveMinimum;
            /**
             * information about external documentation
             */
            export interface ExternalDocs {
                description?: string;
                url: string; // uri
            }
            /**
             * A deterministic version of a JSON Schema object.
             */
            export interface FileSchema {
                format?: string;
                title?: JsonSchemaDraft04.Schema.Properties.Title;
                description?: JsonSchemaDraft04.Schema.Properties.Description;
                default?: JsonSchemaDraft04.Schema.Properties.Default;
                required?: JsonSchemaDraft04.Schema.Definitions.StringArray;
                type: 'file';
                readOnly?: boolean;
                externalDocs?: ExternalDocs;
                example?: any;
            }
            export interface FormDataParameterSubSchema {
                /**
                 * Determines whether or not this parameter is required or optional.
                 */
                required?: boolean;
                /**
                 * Determines the location of the parameter.
                 */
                in?: 'formData';
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
                type?:
                    | 'string'
                    | 'number'
                    | 'boolean'
                    | 'integer'
                    | 'array'
                    | 'file';
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
            export interface Header {
                type: 'string' | 'number' | 'integer' | 'boolean' | 'array';
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
            export interface HeaderParameterSubSchema {
                /**
                 * Determines whether or not this parameter is required or optional.
                 */
                required?: boolean;
                /**
                 * Determines the location of the parameter.
                 */
                in?: 'header';
                /**
                 * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                 */
                description?: string;
                /**
                 * The name of the parameter.
                 */
                name?: string;
                type?: 'string' | 'number' | 'boolean' | 'integer' | 'array';
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
                contact?: Contact;
                license?: License;
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
            }
            export type MaxItems = JsonSchemaDraft04.Schema.Definitions.PositiveInteger;
            export type MaxLength = JsonSchemaDraft04.Schema.Definitions.PositiveInteger;
            export type Maximum = JsonSchemaDraft04.Schema.Properties.Maximum;
            export type MediaTypeList = MimeType[];
            /**
             * The MIME type of the HTTP message.
             */
            export type MimeType = string;
            export type MinItems = JsonSchemaDraft04.Schema.Definitions.PositiveIntegerDefault0;
            export type MinLength = JsonSchemaDraft04.Schema.Definitions.PositiveIntegerDefault0;
            export type Minimum = JsonSchemaDraft04.Schema.Properties.Minimum;
            export type MultipleOf = JsonSchemaDraft04.Schema.Properties.MultipleOf;
            export interface NonBodyParameter {}
            export interface Oauth2AccessCodeSecurity {
                type: 'oauth2';
                flow: 'accessCode';
                scopes?: Oauth2Scopes;
                authorizationUrl: string; // uri
                tokenUrl: string; // uri
                description?: string;
            }
            export interface Oauth2ApplicationSecurity {
                type: 'oauth2';
                flow: 'application';
                scopes?: Oauth2Scopes;
                tokenUrl: string; // uri
                description?: string;
            }
            export interface Oauth2ImplicitSecurity {
                type: 'oauth2';
                flow: 'implicit';
                scopes?: Oauth2Scopes;
                authorizationUrl: string; // uri
                description?: string;
            }
            export interface Oauth2PasswordSecurity {
                type: 'oauth2';
                flow: 'password';
                scopes?: Oauth2Scopes;
                tokenUrl: string; // uri
                description?: string;
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
                externalDocs?: ExternalDocs;
                /**
                 * A unique identifier of the operation.
                 */
                operationId?: string;
                /**
                 * A list of MIME types the API can produce.
                 */
                produces?: MimeType[];
                /**
                 * A list of MIME types the API can consume.
                 */
                consumes?: MimeType[];
                parameters?: ParametersList;
                responses: Responses;
                schemes?: SchemesList;
                deprecated?: boolean;
                security?: Security;
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
                parameters?: ParametersList;
            }
            export interface PathParameterSubSchema {
                /**
                 * Determines whether or not this parameter is required or optional.
                 */
                required: 'true';
                /**
                 * Determines the location of the parameter.
                 */
                in?: 'path';
                /**
                 * A brief description of the parameter. This could contain examples of use.  GitHub Flavored Markdown is allowed.
                 */
                description?: string;
                /**
                 * The name of the parameter.
                 */
                name?: string;
                type?: 'string' | 'number' | 'boolean' | 'integer' | 'array';
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
            /**
             * Relative paths to the individual endpoints. They must be relative to the 'basePath'.
             */
            export interface Paths {
                [path: string]: PathItem;
            }
            export type Pattern = JsonSchemaDraft04.Schema.Properties.Pattern; // regex
            export interface PrimitivesItems {
                type?: 'string' | 'number' | 'integer' | 'boolean' | 'array';
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
            export interface QueryParameterSubSchema {
                /**
                 * Determines whether or not this parameter is required or optional.
                 */
                required?: boolean;
                /**
                 * Determines the location of the parameter.
                 */
                in?: 'query';
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
                type?: 'string' | 'number' | 'boolean' | 'integer' | 'array';
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
            export interface Response {
                description: string;
                schema?: JsonSchemaDraft04.Schema | FileSchema;
                headers?: Headers;
                examples?: Examples;
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
                [name: string]: ResponseValue;
            }
            /**
             * A deterministic version of a JSON Schema object.
             */
            /**
             * The transfer protocol of the API.
             */
            export type SchemesList = ('http' | 'https' | 'ws' | 'wss')[];
            export type Security = SecurityRequirement[];
            export interface SecurityDefinitions {
                [name: string]:
                    | BasicAuthenticationSecurity
                    | ApiKeySecurity
                    | Oauth2ImplicitSecurity
                    | Oauth2PasswordSecurity
                    | Oauth2ApplicationSecurity
                    | Oauth2AccessCodeSecurity;
            }
            export interface SecurityRequirement {
                [name: string]: string[];
            }
            export interface Tag {
                name: string;
                description?: string;
                externalDocs?: ExternalDocs;
            }
            export type UniqueItems = JsonSchemaDraft04.Schema.Properties.UniqueItems;
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
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import SwaggerIo = OpenApisV2;
