/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as JsonPointer from '../jsonPointer';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { OpenApisV2 } from './openApiV2';
import { OpenApisV3 } from './openApiV3';
import SchemaId from './schemaId';
import {
    Schema,
    JsonSchemaObject,
    SchemaType,
    JsonSchema,
    isJsonSchemaDraft04,
} from './type';
import { checkValidMIMEType } from './utils';

type OpenApiSchema = OpenApisV2.SchemaJson | OpenApisV3.SchemaJson;
type ParametersList =
    | OpenApisV2.SchemaJson.Definitions.ParametersList
    | OpenApisV3.SchemaJson.Definitions.ParameterOrReference[];
type ParameterOrReference =
    | OpenApisV2.SchemaJson.Definitions.Parameter
    | OpenApisV2.SchemaJson.Definitions.JsonReference
    | OpenApisV3.SchemaJson.Definitions.ParameterOrReference;
type Parameter =
    | OpenApisV2.SchemaJson.Definitions.Parameter
    | OpenApisV3.SchemaJson.Definitions.Parameter;

export interface NormalizedSchema extends Schema {
    content: JsonSchemaObject;
}

export function getSubSchema(
    rootSchema: Schema,
    pointer: string,
    id?: SchemaId,
): Schema {
    const content = JsonPointer.get(
        rootSchema.content,
        JsonPointer.parse(pointer),
    ) as JsonSchema;
    if (id == null) {
        const subId =
            typeof content === 'boolean'
                ? undefined
                : getId(rootSchema.type, content);
        const getParentIds = (s: Schema, result: string[]): string[] => {
            result.push(s.id.getAbsoluteId());
            return s.rootSchema == null
                ? result
                : getParentIds(s.rootSchema, result);
        };
        if (subId) {
            id = new SchemaId(subId, getParentIds(rootSchema, []));
        } else {
            id = new SchemaId(pointer, getParentIds(rootSchema, []));
        }
    }
    return {
        type: rootSchema.type,
        id,
        content,
        rootSchema,
    };
}

const Draft04Id = 'id';
const Draft07Id = '$id';

export function getId(type: SchemaType, content: JsonSchemaObject): string {
    if (isJsonSchemaDraft04(content, type)) {
        return content[Draft04Id] ?? '';
    } else {
        return content[Draft07Id] ?? '';
    }
}
export function setId(
    type: SchemaType,
    content: JsonSchemaObject,
    id: string,
): void {
    if (isJsonSchemaDraft04(content, type)) {
        content[Draft04Id] ??= id;
    } else {
        content[Draft07Id] ??= id;
    }
}

export function searchAllSubSchema(
    schema: Schema,
    onFoundSchema: (subSchema: Schema) => void,
    onFoundReference: (refId: SchemaId) => void,
): void {
    const walkArray = (
        array: JsonSchema[] | undefined,
        paths: string[],
        parentIds: string[],
    ): void => {
        if (array == null) {
            return;
        }
        array.forEach((item, index) => {
            walk(item, paths.concat(index.toString()), parentIds);
        });
    };
    const walkObject = (
        obj: { [name: string]: JsonSchema } | undefined,
        paths: string[],
        parentIds: string[],
    ): void => {
        if (obj == null) {
            return;
        }
        Object.keys(obj).forEach((key) => {
            const sub = obj[key];
            if (sub != null) {
                walk(sub, paths.concat(key), parentIds);
            }
        });
    };
    const walkMaybeArray = (
        item: JsonSchema | JsonSchema[] | undefined,
        paths: string[],
        parentIds: string[],
    ): void => {
        if (Array.isArray(item)) {
            walkArray(item, paths, parentIds);
        } else {
            walk(item, paths, parentIds);
        }
    };
    const walk = (
        s: JsonSchema | undefined,
        paths: string[],
        parentIds: string[],
    ) => {
        if (s == null || typeof s !== 'object') {
            return;
        }

        const id = getId(schema.type, s);
        if (id && typeof id === 'string') {
            const schemaId = new SchemaId(id, parentIds);
            const subSchema: Schema = {
                type: schema.type,
                id: schemaId,
                content: s,
                rootSchema: schema,
            };
            onFoundSchema(subSchema);
            parentIds = parentIds.concat([schemaId.getAbsoluteId()]);
        }
        if (typeof s.$ref === 'string') {
            const schemaId = new SchemaId(s.$ref, parentIds);
            s.$ref = schemaId.getAbsoluteId();
            onFoundReference(schemaId);
        }

        walkArray(s.allOf, paths.concat('allOf'), parentIds);
        walkArray(s.anyOf, paths.concat('anyOf'), parentIds);
        walkArray(s.oneOf, paths.concat('oneOf'), parentIds);
        walk(s.not, paths.concat('not'), parentIds);

        walkMaybeArray(s.items, paths.concat('items'), parentIds);
        walk(s.additionalItems, paths.concat('additionalItems'), parentIds);
        walk(
            s.additionalProperties,
            paths.concat('additionalProperties'),
            parentIds,
        );
        walkObject(s.definitions, paths.concat('definitions'), parentIds);
        walkObject(s.properties, paths.concat('properties'), parentIds);
        walkObject(
            s.patternProperties,
            paths.concat('patternProperties'),
            parentIds,
        );
        walkMaybeArray(s.dependencies, paths.concat('dependencies'), parentIds);
        if (schema.type === 'Draft07') {
            if ('propertyNames' in s) {
                walk(s.propertyNames, paths.concat('propertyNames'), parentIds);
                walk(s.contains, paths.concat('contains'), parentIds);
                walk(s.if, paths.concat('if'), parentIds);
                walk(s.then, paths.concat('then'), parentIds);
                walk(s.else, paths.concat('else'), parentIds);
            }
        }
    };

    function searchOpenApiSubSchema(openApi: OpenApiSchema): void {
        function createId(paths: string[]): string {
            return '#/' + paths.join('/');
        }
        function convertKeyToTypeName(key: string): string {
            key = key.replace(/\/(.)/g, (_match: string, p1: string) => {
                return p1.toUpperCase();
            });
            return key
                .replace(/}/g, '')
                .replace(/{/g, '$')
                .replace(/^\//, '')
                .replace(/[^0-9A-Za-z_$]+/g, '_');
        }
        function setSubIdToAnyObject<T>(
            f: (t: T, keys: string[]) => void,
            obj: { [key: string]: T } | undefined,
            keys: string[],
        ): void {
            if (obj == null) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const item = obj[key];
                if (item != null) {
                    f(item, keys.concat(convertKeyToTypeName(key)));
                }
            });
        }

        // for OpenAPI
        function setSubIdToParameterObject(
            obj:
                | OpenApisV2.SchemaJson.Definitions.ParameterDefinitions
                | OpenApisV3.SchemaJson.Definitions.ParametersOrReferences
                | undefined,
            keys: string[],
        ): void {
            if (obj == null) {
                return;
            }
            addParameterSchema(Object.entries(obj), keys);
        }
        function setSubIdToParameters(
            array: ParametersList | undefined,
            keys: string[],
        ): void {
            if (array == null) {
                return;
            }
            addParameterSchema(
                array.map(
                    (
                        item: ParameterOrReference,
                        index: number,
                    ): [string, ParameterOrReference] => {
                        const key = 'name' in item ? item.name : `${index}`;
                        return [key, item];
                    },
                ),
                keys,
            );
        }
        function addParameterSchema(
            input: readonly [string, ParameterOrReference][],
            keys: string[],
        ): void {
            const map = new Map<string, [string, Parameter][]>();
            const pushItem = (key: string, po: [string, Parameter]) => {
                let work = map.get(key);
                if (work == null) {
                    work = [];
                    map.set(key, work);
                }
                work.push(po);
            };

            for (const [key, item] of input) {
                if ('schema' in item) {
                    setSubId(item.schema, keys.concat(key));
                    pushItem(item.in, [key, item]);
                }
                if ('content' in item) {
                    setSubIdToMediaTypes(item.content, keys.concat(key));
                    pushItem(item.in, [key, item]);
                }
                if ('$ref' in item) {
                    setSubId(item, keys.concat(key));
                }
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if ('type' in item && item.in !== undefined) {
                    setSubId(
                        item as JsonSchemaDraft04.Schema,
                        keys.concat(key),
                    );
                    pushItem(item.in, [key, item]);
                }
            }
            for (const [key, params] of map) {
                const [paths, obj] = buildParameterSchema(key, params, keys);
                setSubId(obj, paths);
            }
        }
        function buildParameterSchema(
            inType: string,
            params: [string, Parameter][],
            keys: string[],
        ): [string[], JsonSchemaObject] {
            const paths = keys
                .slice(0, keys.length - 1)
                .concat(inType + 'Parameters');
            const properties: { [name: string]: JsonSchemaDraft04.Schema } = {};
            params.forEach(([key, _]) => {
                properties[key] = {
                    $ref: createId(keys.concat(key)),
                };
            });
            return [
                paths,
                {
                    id: createId(paths),
                    type: 'object',
                    properties,
                    required: params
                        .filter(([_, item]) => item.required === true)
                        .map(([_, item]) => item.name),
                },
            ];
        }

        /// for OpenAPI V2 only
        const setSubIdToResponsesV2 = (
            responses: OpenApisV2.SchemaJson.Definitions.Responses | undefined,
            keys: string[],
        ) => setSubIdToAnyObject(setSubIdToResponseV2, responses, keys);
        function setSubIdToResponseV2(
            response:
                | OpenApisV2.SchemaJson.Definitions.ResponseValue
                | undefined,
            keys: string[],
        ): void {
            if (response == null) {
                return;
            }
            if ('schema' in response) {
                const s = response.schema;
                if (s != null && s.type === 'file') {
                    return;
                }
                setSubId(s as JsonSchemaObject, keys);
            }
        }
        function setSubIdToOperationV2(
            ops: OpenApisV2.SchemaJson.Definitions.Operation | undefined,
            keys: string[],
        ): void {
            if (ops == null) {
                return;
            }
            const operationId = ops.operationId;
            if (operationId) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                keys = [keys[0]!, convertKeyToTypeName(operationId)];
            }
            setSubIdToParameters(ops.parameters, keys.concat('parameters'));
            setSubIdToResponsesV2(ops.responses, keys.concat('responses'));
        }
        const setSubIdToPathsV2 = (
            paths: OpenApisV2.SchemaJson.Definitions.Paths,
            keys: string[],
        ) => setSubIdToAnyObject(setSubIdToPathItemV2, paths, keys);
        function setSubIdToPathItemV2(
            pathItem: OpenApisV2.SchemaJson.Definitions.PathItem,
            keys: string[],
        ): void {
            setSubIdToParameters(
                pathItem.parameters,
                keys.concat('parameters'),
            );
            setSubIdToOperationV2(pathItem.get, keys.concat('get'));
            setSubIdToOperationV2(pathItem.put, keys.concat('put'));
            setSubIdToOperationV2(pathItem.post, keys.concat('post'));
            setSubIdToOperationV2(pathItem.delete, keys.concat('delete'));
            setSubIdToOperationV2(pathItem.options, keys.concat('options'));
            setSubIdToOperationV2(pathItem.head, keys.concat('head'));
            setSubIdToOperationV2(pathItem.patch, keys.concat('patch'));
        }

        /// for OpenAPI V3 only
        function setSubIdToMediaTypes(
            types: OpenApisV3.SchemaJson.Definitions.MediaTypes | undefined,
            keys: string[],
        ): void {
            if (types == null) {
                return;
            }
            for (const mime of Object.keys(types)) {
                if (checkValidMIMEType(mime)) {
                    const mt = types[mime];
                    if (mt != null) {
                        setSubId(mt.schema, keys);
                    }
                }
            }
        }
        const setSubIdToRequestBodies = (
            bodies:
                | OpenApisV3.SchemaJson.Definitions.RequestBodiesOrReferences
                | undefined,
            keys: string[],
        ) => setSubIdToAnyObject(setSubIdToRequestBody, bodies, keys);
        function setSubIdToRequestBody(
            body:
                | OpenApisV3.SchemaJson.Definitions.RequestBodyOrReference
                | undefined,
            keys: string[],
        ): void {
            if (body == null) {
                return;
            }
            if ('content' in body) {
                setSubIdToMediaTypes(body.content, keys);
            } else if ('$ref' in body) {
                setSubId(body, keys);
            } else {
                setSubId({ type: 'object' }, keys);
            }
        }
        const setSubIdToResponsesV3 = (
            responses:
                | OpenApisV3.SchemaJson.Definitions.ResponsesOrReferences
                | undefined,
            keys: string[],
        ) => setSubIdToAnyObject(setSubIdToResponseV3, responses, keys);
        function setSubIdToResponseV3(
            response:
                | OpenApisV3.SchemaJson.Definitions.ResponseOrReference
                | undefined,
            keys: string[],
        ): void {
            if (response == null) {
                return;
            }
            if ('content' in response) {
                setSubIdToMediaTypes(response.content, keys);
            } else if ('$ref' in response) {
                setSubId(response, keys);
            } else {
                setSubId({ type: 'object' }, keys);
            }
        }
        function setSubIdToOperationV3(
            ops: OpenApisV3.SchemaJson.Definitions.Operation | undefined,
            keys: string[],
        ): void {
            if (ops == null) {
                return;
            }
            const operationId = ops.operationId;
            if (operationId) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                keys = [keys[0]!, convertKeyToTypeName(operationId)];
            }
            setSubIdToParameters(ops.parameters, keys.concat('parameters'));
            setSubIdToRequestBody(ops.requestBody, keys.concat('requestBody'));
            setSubIdToResponsesV3(ops.responses, keys.concat('responses'));
        }
        const setSubIdToPathsV3 = (
            paths: OpenApisV3.SchemaJson.Definitions.Paths,
            keys: string[],
        ) => setSubIdToAnyObject(setSubIdToPathItemV3, paths, keys);
        function setSubIdToPathItemV3(
            pathItem: OpenApisV3.SchemaJson.Definitions.PathItem,
            keys: string[],
        ): void {
            setSubIdToParameters(
                pathItem.parameters,
                keys.concat('parameters'),
            );
            setSubIdToOperationV3(pathItem.get, keys.concat('get'));
            setSubIdToOperationV3(pathItem.put, keys.concat('put'));
            setSubIdToOperationV3(pathItem.post, keys.concat('post'));
            setSubIdToOperationV3(pathItem.delete, keys.concat('delete'));
            setSubIdToOperationV3(pathItem.options, keys.concat('options'));
            setSubIdToOperationV3(pathItem.head, keys.concat('head'));
            setSubIdToOperationV3(pathItem.patch, keys.concat('patch'));
            setSubIdToOperationV3(pathItem.trace, keys.concat('trace'));
        }

        function setSubIdToObject(
            obj: { [name: string]: JsonSchema } | undefined,
            paths: string[],
        ): void {
            if (obj == null) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const sub = obj[key];
                setSubId(sub, paths.concat(key));
            });
        }
        function setSubId(s: JsonSchema | undefined, paths: string[]): void {
            switch (typeof s) {
                case 'object': {
                    const id = createId(paths);
                    setId(schema.type, s, id);
                    walk(s, paths, []);
                    break;
                }
                case 'boolean': {
                    const id = createId(paths);
                    const schemaId = new SchemaId(id, []);
                    const subSchema: Schema = {
                        type: schema.type,
                        id: schemaId,
                        content: s,
                        rootSchema: schema,
                    };
                    onFoundSchema(subSchema);
                    break;
                }
            }
        }

        if ('swagger' in openApi) {
            setSubIdToObject(openApi.definitions, ['definitions']);
            setSubIdToParameterObject(openApi.parameters, ['parameters']);
            setSubIdToResponsesV2(openApi.responses, ['responses']);

            setSubIdToPathsV2(openApi.paths, ['paths']);
        } else {
            if (openApi.components) {
                const components = openApi.components;
                setSubIdToObject(components.schemas, ['components', 'schemas']);
                setSubIdToResponsesV3(components.responses, [
                    'components',
                    'responses',
                ]);
                setSubIdToParameterObject(components.parameters, [
                    'components',
                    'parameters',
                ]);
                setSubIdToRequestBodies(components.requestBodies, [
                    'components',
                    'requestBodies',
                ]);
            }
            setSubIdToPathsV3(openApi.paths, ['paths']);
        }
    }

    if (schema.openApiVersion != null) {
        const obj = schema.content as OpenApiSchema;
        searchOpenApiSubSchema(obj);
        return;
    }
    walk(schema.content, ['#'], []);
}

export function selectSchemaType(content: JsonSchema | OpenApiSchema): {
    type: SchemaType;
    openApiVersion?: 2 | 3;
} {
    if (typeof content === 'boolean') {
        return { type: 'Draft07' };
    }
    if (typeof content !== 'object') {
        throw new Error(
            `expect parameter of type object, received ${typeof content}`,
        );
    }
    if ('$schema' in content) {
        const schema = content['$schema'] ?? '';
        if (/^https?:\/\/json-schema.org\/schema#?$/.test(schema)) {
            return { type: 'Latest' };
        }
        const match =
            /^https?:\/\/json-schema\.org\/(?:draft\/(\d{4}-\d{2})|draft-(\d+))\/schema#?$/.exec(
                schema,
            );
        if (match) {
            if (match[1] != null) {
                switch (match[1]) {
                    case '2019-09':
                        return { type: '2019-09' };
                    case '2020-12':
                        return { type: '2020-12' };
                }
            }
            const version = Number(match[2]);
            if (version <= 4) {
                return { type: 'Draft04' };
            } else {
                return { type: 'Draft07' };
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ('swagger' in content && content.swagger === '2.0') {
        return {
            type: 'Draft04',
            openApiVersion: 2,
        };
    }
    if ('openapi' in content && content.openapi) {
        const { openapi } = content;
        if (/^3\.\d+\.\d+$/.test(openapi)) {
            return {
                type: 'Draft07',
                openApiVersion: 3,
            };
        }
    }
    // fallback to old version JSON Schema
    return { type: 'Draft04' };
}
