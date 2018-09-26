import * as JsonPointer from '../jsonPointer';
import SchemaId from './schemaId';
import { normalizeTypeName } from './typeNameConvertor';

export type JsonSchema = JsonSchemaOrg.Draft04.Schema | JsonSchemaOrg.Draft07.Schema;
export type JsonSchemaObject = JsonSchemaOrg.Draft04.Schema | JsonSchemaOrg.Draft07.SchemaObject;
type OpenApiSchema = SwaggerIo.V2.SchemaJson | OpenApisOrg.V3.SchemaJson;

export type SchemaType = 'Draft04' | 'Draft07';

export interface Schema {
    type: SchemaType;
    openApiVersion?: 2 | 3;
    id: SchemaId;
    content: JsonSchema;
    rootSchema?: Schema;
}
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
        function setSubIdToAnyObject<T>(f: (t: T, keys: string[]) => void, obj: { [key: string]: T } | undefined, keys: string[]): void {
            if (obj == null) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const item = obj[key];
                f(item, keys.concat(normalizeTypeName(key)));
            });
        }
        function setSubIdToMediaTypes(types: OpenApisOrg.V3.SchemaJson.Definitions.MediaTypes | undefined, keys: string[]): void {
            if (types == null) {
                return;
            }
            const mime = 'application/json';
            const mt = types[mime];
            if (mt != null) {
                setSubId(mt.schema, keys);
            }
        }
        const setSubIdToParameterObject = (array: OpenApisOrg.V3.SchemaJson.Definitions.ParametersOrReferences | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToParameter, array, keys);
        const setSubIdToParameters = (array: OpenApisOrg.V3.SchemaJson.Definitions.ParameterOrReference[] | undefined, keys: string[]) => {
            if (array == null) {
                return;
            }
            array.forEach((item) => {
                setSubIdToParameter(item, keys);
            });
        };
        function setSubIdToParameter(param: OpenApisOrg.V3.SchemaJson.Definitions.ParameterOrReference | undefined, keys: string[]) {
            if (param == null) {
                return;
            }
            if ('schema' in param) {
                setSubId(param.schema, keys.concat(param.name));
            }
        }
        const setSubIdToRequestBodies = (bodys: OpenApisOrg.V3.SchemaJson.Definitions.RequestBodiesOrReferences | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToRequestBody, bodys, keys);
        function setSubIdToRequestBody(body: OpenApisOrg.V3.SchemaJson.Definitions.RequestBodyOrReference | undefined, keys: string[]) {
            if (body == null) {
                return;
            }
            if ('content' in body) {
                setSubIdToMediaTypes(body.content, keys);
            }
        }
        const setSubIdToResponses = (responses: OpenApisOrg.V3.SchemaJson.Definitions.ResponsesOrReferences | undefined, keys: string[]) => setSubIdToAnyObject(setSubIdToResponse, responses, keys);
        function setSubIdToResponse(response: OpenApisOrg.V3.SchemaJson.Definitions.ResponseOrReference | undefined, keys: string[]) {
            if (response == null) {
                return;
            }
            if ('content' in response) {
                setSubIdToMediaTypes(response.content, keys);
            }
        }
        function setSubIdToOperation(ops: OpenApisOrg.V3.SchemaJson.Definitions.Operation | undefined, keys: string[]) {
            if (ops == null) {
                return;
            }
            // const operationId = ops.operationId;
            setSubIdToParameters(ops.parameters, keys.concat('parameters'));
            setSubIdToRequestBody(ops.requestBody, keys.concat('requestBody'));
            setSubIdToResponses(ops.responses, keys.concat('responses'));
        }
        const setSubIdToPaths = (paths: OpenApisOrg.V3.SchemaJson.Definitions.Paths, keys: string[]) => setSubIdToAnyObject(setSubIdToPathItem, paths, keys);
        function setSubIdToPathItem(pathItem: OpenApisOrg.V3.SchemaJson.Definitions.PathItem, keys: string[]) {
            setSubIdToParameters(pathItem.parameters, keys.concat('parameters'));
            setSubIdToOperation(pathItem.get, keys.concat('get'));
            setSubIdToOperation(pathItem.put, keys.concat('put'));
            setSubIdToOperation(pathItem.post, keys.concat('post'));
            setSubIdToOperation(pathItem.delete, keys.concat('delete'));
            setSubIdToOperation(pathItem.options, keys.concat('options'));
            setSubIdToOperation(pathItem.head, keys.concat('head'));
            setSubIdToOperation(pathItem.patch, keys.concat('patch'));
            setSubIdToOperation(pathItem.trace, keys.concat('trace'));
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
            } else {
                const id = createId(paths);
                setId(schema.type, s, id);
                walk(s, paths, []);
            }
        }

        if ('swagger' in openApi) {
            setSubIdToObject(openApi.definitions, ['definitions']);
        } else {
            if (openApi.components) {
                const components = openApi.components;
                setSubIdToObject(components.schemas, ['components', 'schemas']);
                setSubIdToResponses(components.responses, ['components', 'responses']);
                setSubIdToParameterObject(components.parameters, ['components', 'parameters']);
                setSubIdToRequestBodies(components.requestBodies, ['components', 'requestBodies']);
            }
            if (openApi.paths) {
                setSubIdToPaths(openApi.paths, ['paths']);
            }
        }
    }

    if (schema.openApiVersion != null) {
        const obj = schema.content as OpenApisOrg.V3.SchemaJson;
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
