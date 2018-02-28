import 'cross-fetch/polyfill';
import Debug from 'debug';
import * as JsonPointer from '../jsonPointer';
import { parseFileContent } from '../utils';
import { getSubSchema, parseSchema, Schema, searchAllSubSchema } from './jsonSchema';
import SchemaId from './schemaId';

const debug = Debug('dtsgen');

export default class ReferenceResolver {
    private readonly schemaCache = new Map<string, Schema>();
    private readonly referenceCache = new Map<string, Schema | undefined>();

    public dereference(refId: string): Schema {
        const result = this.referenceCache.get(refId);
        if (result == null) {
            throw new Error('Target reference is not found: ' + refId);
        }
        return result;
    }
    public getRegisteredSchema(id: string): Schema | undefined {
        return this.schemaCache.get(id);
    }

    public getAllSchemaMergedMap(typeMarker: symbol): any {
        const map: any = {};
        if (this.schemaCache.size === 0) {
            throw new Error('There is no schema in the input contents.');
        }
        for (const type of this.schemaCache.values()) {
            const names = type.id.getTypeNames();
            const parent = JsonPointer.get(map, names, true);
            if (parent == null) {
                JsonPointer.set(map, names, { [typeMarker]: type });
            } else {
                parent[typeMarker] = type;
            }
        }
        return map;
    }

    public async resolve(): Promise<void> {
        debug(`resolve reference: reference schema count=${this.referenceCache.size}.`);
        debug('  schemaCache:');
        debug(Array.from(this.schemaCache.keys()).join('\n'));
        debug('  referenceCache:');
        debug(Array.from(this.referenceCache.keys()).join('\n'));
        const error: string[] = [];
        for (const [key, schema] of this.referenceCache.entries()) {
            if (schema != null) {
                continue;
            }
            const id = new SchemaId(key);
            const fileId = id.getFileId();
            let result = this.schemaCache.get(id.getAbsoluteId());
            if (result == null) {
                const refSchema = this.schemaCache.get(fileId);
                if (refSchema == null) {
                    if (!id.isFetchable()) {
                        error.push(`The $ref target is not exists: ${id.getAbsoluteId()}`);
                        continue;
                    }
                    try {
                        debug(`fetch remote schema: id=[${fileId}].`);
                        this.registerRemoteSchema(fileId);
                    } catch (e) {
                        error.push(`Fail to fetch the $ref target: ${id.getAbsoluteId()}, ${e}`);
                        continue;
                    }
                }
                result = this.schemaCache.get(id.getAbsoluteId());
            }
            debug(`resolve reference: ref=[${id.getAbsoluteId()}]`);
            if (result != null) {
                this.referenceCache.set(id.getAbsoluteId(), result);
            } else {
                if (id.existsJsonPointerHash()) {
                    const rootSchema = this.schemaCache.get(fileId);
                    if (rootSchema == null) {
                        error.push(`The $ref targets root is not found: ${id.getAbsoluteId()}`);
                        continue;
                    }
                    const targetSchema = getSubSchema(rootSchema, id.getJsonPointerHash(), id);
                    this.addSchema(targetSchema);
                    this.registerSchema(targetSchema);
                    this.referenceCache.set(id.getAbsoluteId(), targetSchema);
                } else {
                    error.push(`The $ref target is not found: ${id.getAbsoluteId()}`);
                    continue;
                }
            }
        }
        if (error.length > 0) {
            throw new Error(error.join('\n'));
        }
        // debug('  resolve reference: resolved schema:');
        // debug(Array.from(this.referenceCache.keys()).join('\n'));
    }

    public async registerRemoteSchema(url: string): Promise<void> {
        const res = await fetch(url);
        const body = await res.text();
        if (!res.ok) {
            throw new Error(`Error on fetch from url(${url}): ${res.status}, ${body}`);
        }
        const content = parseFileContent(body, url);
        const schema = parseSchema(content, url);
        this.registerSchema(schema);
    }

    public registerSchema(schema: Schema): void {
        debug(`register schema: schemaId=[${schema.id.getAbsoluteId()}].`);
        searchAllSubSchema(schema, (subSchema) => {
            this.addSchema(subSchema);
        }, (refId) => {
            this.addReference(refId);
        });
    }

    private addSchema(schema: Schema): void {
        const id = schema.id;
        // debug(` add schema: id=${id.getAbsoluteId()}`);
        this.schemaCache.set(id.getAbsoluteId(), schema);
        if (schema.rootSchema == null) {
            const fileId = id.getFileId();
            if (!this.schemaCache.has(fileId)) {
                this.schemaCache.set(fileId, schema);
            }
        }
    }
    private addReference(refId: SchemaId): void {
        if (!this.referenceCache.has(refId.getAbsoluteId())) {
            // debug(` add reference: id=${refId.getAbsoluteId()}`);
            this.referenceCache.set(refId.getAbsoluteId(), undefined);
        }
    }

    public clear(): void {
        debug('clear resolver cache.');
        this.schemaCache.clear();
        this.referenceCache.clear();
    }
}
