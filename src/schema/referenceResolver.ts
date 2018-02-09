import 'cross-fetch/polyfill';
import Debug from 'debug';
import { parseFileContent } from '../utils';
import { getSubSchema, parseSchema, Schema, searchAllSubSchema } from './';
import { SchemaId } from './schemaId';

const debug = Debug('dtsgen');

export class ReferenceResolver {
    private schemaCache = new Map<string, Schema>();
    private referenceCache = new Map<string, Schema | undefined>();

    public dereference(refId: SchemaId): Schema {
        const result = this.referenceCache.get(refId.getAbsoluteId());
        if (result == null) {
            throw new Error('Target reference is not found: ' + refId.getAbsoluteId());
        }
        return result;
    }

    public async resolve(): Promise<void> {
        debug(`resolve reference: reference schema count=${this.referenceCache.size}.`);
        const error: string[] = [];
        for (const [key, schema] of this.referenceCache.entries()) {
            if (schema != null) {
                continue;
            }
            const id = new SchemaId(key);
            const fileId = id.getFileId();
            const refSchema = this.schemaCache.get(fileId);
            if (refSchema == null) {
                if (!id.isFetchable()) {
                    error.push(`The $ref target is not found: ${id.getAbsoluteId()}`);
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
            debug(`resolve reference: ref=[${id.getAbsoluteId()}]`);
            const result = this.schemaCache.get(id.getAbsoluteId());
            if (result != null) {
                this.referenceCache.set(key, result);
            } else {
                if (id.existsJsonPointerHash()) {
                    const rootSchema = this.schemaCache.get(fileId);
                    if (rootSchema == null) {
                        error.push(`The $ref target is not found: ${id.getAbsoluteId()}`);
                        continue;
                    }
                    const targetSchema = getSubSchema(id, rootSchema, id.getJsonPointerHash());
                    this.registerSchema(targetSchema);
                    this.schemaCache.set(key, targetSchema);
                } else {
                    error.push(`The $ref target is not found: ${id.getAbsoluteId()}`);
                    continue;
                }
            }
        }
        if (error.length > 0) {
            throw new Error(error.join('\n'));
        }
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
        debug(`add schema: id=${id.getAbsoluteId()}`);
        this.schemaCache.set(id.getAbsoluteId(), schema);
        if (schema.rootSchema == null) {
            const fileId = id.getFileId();
            if (!this.schemaCache.has(fileId)) {
                this.schemaCache.set(fileId, schema);
            }
        }
    }
    private addReference(refId: SchemaId): void {
        debug(`add reference: id=${refId.getAbsoluteId()}`);
        this.referenceCache.set(refId.getAbsoluteId(), undefined);
    }

    public clear(): void {
        debug('clear resolver cache.');
        this.schemaCache.clear();
        this.referenceCache.clear();
    }
}
