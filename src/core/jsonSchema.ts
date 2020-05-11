import * as JsonPointer from '../jsonPointer';
import SchemaId from './schemaId';
import { Schema, JsonSchemaObject, SchemaType, JsonSchema } from './type';
import { OpenApisV2 } from './openApiV2';
import { OpenApisV3 } from './openApiV3';

type OpenApiSchema = OpenApisV2.SchemaJson | OpenApisV3.SchemaJson;

interface ParameterObject { name: string; in: string; required?: boolean; schema?: JsonSchemaObject; }
type Parameter = ParameterObject | { $ref?: string; };

export interface NormalizedSchema extends Schema {
    content: JsonSchemaObject;
}

export function parseSchema(content: any, url?: string): Schema {
    const { type, openApiVersion } = selectSchemaType(content);
    if (url != null) {
        setId(type, content, url);
    }
    const id = getId(type, content);
    return {
        type,
        openApiVersion,
        id: id ? new SchemaId(id) : SchemaId.empty,
        content,
    };
}

export function getSubSchema(rootSchema: Schema, pointer: string, id?: SchemaId): Schema {
    const content = JsonPointer.get(rootSchema.content, JsonPointer.parse(pointer));
    if (id == null) {
        const subId = getId(rootSchema.type, content);
        const getParentIds = (s: Schema, result: string[]): string[] => {
            result.push(s.id.getAbsoluteId());
            return s.rootSchema == null ? result : getParentIds(s.rootSchema, result);
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

export function getId(type: SchemaType, content: any): string | undefined {
    return content[getIdPropertyName(type)];
}
function setId(type: SchemaType, content: any, id: string): void {
    const key = getIdPropertyName(type);
    if (content[key] == null) {
        content[key] = id;
    }
}
function getIdPropertyName(type: SchemaType): string {
    switch (type) {
        case 'Draft04': return 'id';
        case 'Draft07': return '$id';
    }
}

export function searchAllSubSchema(schema: Schema, onFoundSchema: (subSchema: Schema) => void, onFoundReference: (refId: SchemaId) => void): void {
    const walkArray = (array: JsonSchema[] | undefined, paths: string[], parentIds: string[]): void => {
        if (array == null) {
            return;
        }
        array.forEach((item, index) => {
            walk(item, paths.concat(index.toString()), parentIds);
        });
    };
    const walkObject = (obj: { [name: string]: JsonSchema; } | undefined, paths: string[], parentIds: string[]): void => {
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
    const walkMaybeArray = (item: JsonSchema | JsonSchema[] | undefined, paths: string[], parentIds: string[]): void => {
        if (Array.isArray(item)) {
            walkArray(item, paths, parentIds);
        } else {
            walk(item, paths, parentIds);
        }
    };
    const walk = (s: JsonSchema | undefined, paths: string[], parentIds: string[]) => {
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
        walk(s.additionalProperties, paths.concat('additionalProperties'), parentIds);
        walkObject(s.definitions, paths.concat('definitions'), parentIds);
        walkObject(s.properties, paths.concat('properties'), parentIds);
        walkObject(s.patternProperties, paths.concat('patternProperties'), parentIds);
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
            key = key.replace(/\/(.)/g, (_match, p1) => {
                return p1.toUpperCase();
            });
            return key.replace(/}/g, '').replace(/{/g, '$')
                    .replace(/^\//, '').replace(/[^0-9A-Za-z_$]+/g, '_');
        }
        function setSubIdToAnyObject<T>(f: (t: T, keys: string[]) => void, obj: { [key: string]: T } | undefined, keys: string[]): void {
            if (obj == null) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const item = obj[key];
                f(item, keys.concat(convertKeyToTypeName(key)));
            });
        }

        // for OpenAPI
        const setSubIdToParameterObject = (obj: { [name: string]: Parameter; } | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToParameter, obj, keys);
        function setSubIdToParameter(param: Parameter, keys: string[]): void {
            if ('schema' in param) {
                setSubId(param.schema, keys.concat(param.name));
            }
        }
        function setSubIdToParameters(array: Parameter[] | undefined, keys: string[]): void {
            if (array == null) {
                return;
            }
            const map = new Map<string, ParameterObject[]>();
            array.forEach((item) => {
                if ('schema' in item) {
                    setSubIdToParameter(item, keys);

                    let work = map.get(item.in);
                    if (work == null) {
                        work = [];
                        map.set(item.in, work);
                    }
                    work.push(item);
                }
            });
            addParameterSchema(map, keys);
        }
        function addParameterSchema(input: Map<string, ParameterObject[]>, keys: string[]): void {
            for (const [key, params] of input) {
                const [paths, obj] = buildParameterSchema(key, params, keys);
                setSubId(obj, paths);
            }
        }
        function buildParameterSchema(inType: string, params: ParameterObject[], keys: string[]): [string[], JsonSchemaObject] {
            const paths = keys.slice(0, keys.length - 1).concat(inType + 'Parameters');
            const properties: any = {};
            params.forEach((item) => {
                properties[item.name] = { $ref: createId(keys.concat(item.name)) };
            });
            return [paths, {
                id: createId(paths),
                type: 'object',
                properties,
                required: params.filter((item) => item.required === true).map((item) => item.name),
            }];
        }

        /// for OpenAPI V2 only
        const setSubIdToResponsesV2 = (responses: OpenApisV2.SchemaJson.Definitions.Responses | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToResponseV2, responses, keys);
        function setSubIdToResponseV2(response: OpenApisV2.SchemaJson.Definitions.ResponseValue | undefined, keys: string[]): void {
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
        function setSubIdToOperationV2(ops: OpenApisV2.SchemaJson.Definitions.Operation | undefined, keys: string[]): void {
            if (ops == null) {
                return;
            }
            const operationId = ops.operationId;
            if (operationId) {
                keys = [keys[0], convertKeyToTypeName(operationId)];
            }
            setSubIdToParameters(ops.parameters, keys.concat('parameters'));
            setSubIdToResponsesV2(ops.responses, keys.concat('responses'));
        }
        const setSubIdToPathsV2 = (paths: OpenApisV2.SchemaJson.Definitions.Paths, keys: string[]) => setSubIdToAnyObject(setSubIdToPathItemV2, paths, keys);
        function setSubIdToPathItemV2(pathItem: OpenApisV2.SchemaJson.Definitions.PathItem, keys: string[]): void {
            setSubIdToParameters(pathItem.parameters, keys.concat('parameters'));
            setSubIdToOperationV2(pathItem.get, keys.concat('get'));
            setSubIdToOperationV2(pathItem.put, keys.concat('put'));
            setSubIdToOperationV2(pathItem.post, keys.concat('post'));
            setSubIdToOperationV2(pathItem.delete, keys.concat('delete'));
            setSubIdToOperationV2(pathItem.options, keys.concat('options'));
            setSubIdToOperationV2(pathItem.head, keys.concat('head'));
            setSubIdToOperationV2(pathItem.patch, keys.concat('patch'));
        }

        /// for OpenAPI V3 only
        function setSubIdToMediaTypes(types: OpenApisV3.SchemaJson.Definitions.MediaTypes | undefined, keys: string[]): void {
            if (types == null) {
                return;
            }
            for (const mime of Object.keys(types)) {
                if (/^text\/|^(?:application\/x-www-form-urlencoded|application\/([a-z0-9-_]+\+)?json)$/.test(mime)) {
                    const mt = types[mime];
                    setSubId(mt.schema, keys);
                }
            }
        }
        const setSubIdToRequestBodies = (bodys: OpenApisV3.SchemaJson.Definitions.RequestBodiesOrReferences | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToRequestBody, bodys, keys);
        function setSubIdToRequestBody(body: OpenApisV3.SchemaJson.Definitions.RequestBodyOrReference | undefined, keys: string[]): void {
            if (body == null) {
                return;
            }
            if ('content' in body) {
                setSubIdToMediaTypes(body.content, keys);
            }
            if ('$ref' in body) {
                setSubId(body, keys);
            }
        }
        const setSubIdToResponsesV3 = (responses: OpenApisV3.SchemaJson.Definitions.ResponsesOrReferences | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToResponseV3, responses, keys);
        function setSubIdToResponseV3(response: OpenApisV3.SchemaJson.Definitions.ResponseOrReference | undefined, keys: string[]): void {
            if (response == null) {
                return;
            }
            if ('content' in response) {
                setSubIdToMediaTypes(response.content, keys);
            }
            if ('$ref' in response) {
                setSubId(response, keys);
            }
        }
        function setSubIdToOperationV3(ops: OpenApisV3.SchemaJson.Definitions.Operation | undefined, keys: string[]): void {
            if (ops == null) {
                return;
            }
            const operationId = ops.operationId;
            if (operationId) {
                keys = [keys[0], convertKeyToTypeName(operationId)];
            }
            setSubIdToParameters(ops.parameters, keys.concat('parameters'));
            setSubIdToRequestBody(ops.requestBody, keys.concat('requestBody'));
            setSubIdToResponsesV3(ops.responses, keys.concat('responses'));
        }
        const setSubIdToPathsV3 = (paths: OpenApisV3.SchemaJson.Definitions.Paths, keys: string[]) => setSubIdToAnyObject(setSubIdToPathItemV3, paths, keys);
        function setSubIdToPathItemV3(pathItem: OpenApisV3.SchemaJson.Definitions.PathItem, keys: string[]): void {
            setSubIdToParameters(pathItem.parameters, keys.concat('parameters'));
            setSubIdToOperationV3(pathItem.get, keys.concat('get'));
            setSubIdToOperationV3(pathItem.put, keys.concat('put'));
            setSubIdToOperationV3(pathItem.post, keys.concat('post'));
            setSubIdToOperationV3(pathItem.delete, keys.concat('delete'));
            setSubIdToOperationV3(pathItem.options, keys.concat('options'));
            setSubIdToOperationV3(pathItem.head, keys.concat('head'));
            setSubIdToOperationV3(pathItem.patch, keys.concat('patch'));
            setSubIdToOperationV3(pathItem.trace, keys.concat('trace'));
        }

        function setSubIdToObject(obj: { [name: string]: JsonSchema; } | undefined, paths: string[]): void {
            if (obj == null) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const sub = obj[key];
                setSubId(sub, paths.concat(key));
            });
        }
        function setSubId(s: JsonSchema | undefined, paths: string[]): void {
            if (typeof s !== 'object') {
                return;
            }

            if (typeof s.$ref === 'string') {
                const schemaId = new SchemaId(s.$ref);
                s.$ref = schemaId.getAbsoluteId();
                onFoundReference(schemaId);
            }
            const id = createId(paths);
            setId(schema.type, s, id);
            walk(s, paths, []);
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
                setSubIdToResponsesV3(components.responses, ['components', 'responses']);
                setSubIdToParameterObject(components.parameters, ['components', 'parameters']);
                setSubIdToRequestBodies(components.requestBodies, ['components', 'requestBodies']);
            }
            if (openApi.paths) {
                setSubIdToPathsV3(openApi.paths, ['paths']);
            }
        }
    }

    if (schema.openApiVersion != null) {
        const obj = schema.content as OpenApisV3.SchemaJson;
        searchOpenApiSubSchema(obj);
        return;
    }
    walk(schema.content, ['#'], []);
}

function selectSchemaType(content: any): { type: SchemaType; openApiVersion?: 2 | 3; } {
    if (content.$schema) {
        const schema = content.$schema;
        const match = schema.match(/http\:\/\/json-schema\.org\/draft-(\d+)\/schema#?/);
        if (match) {
            const version = Number(match[1]);
            if (version <= 4) {
                return { type: 'Draft04' };
            } else {
                return { type: 'Draft07' };
            }
        }
    }
    if (content.swagger === '2.0') {
        return {
            type: 'Draft04',
            openApiVersion: 2,
        };
    }
    if (content.openapi) {
        const openapi = content.openapi;
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
