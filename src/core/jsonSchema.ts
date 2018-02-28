import * as JsonPointer from '../jsonPointer';
import SchemaId from './schemaId';

export type JsonSchema = JsonSchemaOrg.Draft04.Schema | JsonSchemaOrg.Draft07.Schema;
export type JsonSchemaObject = JsonSchemaOrg.Draft04.Schema | JsonSchemaOrg.Draft07.SchemaObject;

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
    const id = getId(type, content) || url;
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
    switch (type) {
        case 'Draft04': return content.id;
        case 'Draft07': return content.$id;
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
        if (schema.openApiVersion === 3 && paths.length === 0) {
            const obj = s as any;
            if (obj.components && obj.components.schema) {
                walkObject(obj.components.schema, paths.concat('components', 'schema'), parentIds);
            }
        }
    };

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
        // Add `id` property in #/definitions/*
        if (content.definitions) {
            setSubIds(content.definitions, 'id', 'definitions');
        }
        return {
            type: 'Draft04',
            openApiVersion: 2,
        };
    }
    if (content.openapi) {
        const openapi = content.openapi;
        if (/^3\.\d+\.\d+$/.test(openapi)) {
            // Add `id` property in #/components/schemas/*
            if (content.components && content.components.schema) {
                setSubIds(content.components.schema, '$id', 'components/schema');
            }
            return {
                type: 'Draft07',
                openApiVersion: 3,
            };
        }
    }
    // fallback to old version JSON Schema
    return { type: 'Draft04' };
}
function setSubIds(obj: any, idPropertyName: string, prefix: string): void {
    Object.keys(obj).forEach((key) => {
        const sub = obj[key];
        if (sub != null) {
            if (sub[idPropertyName] == null) {
                sub[idPropertyName] = `#/${prefix}/${key}`;
            }
        }
    });
}
