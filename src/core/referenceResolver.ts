import 'cross-fetch/polyfill';
import Debug from 'debug';
import { getSubSchema, searchAllSubSchema } from './jsonSchema';
import SchemaId from './schemaId';
import { Schema, readSchemaFromUrl } from './type';

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

    public getAllRegisteredSchema(): IterableIterator<Schema> {
        return this.schemaCache.values();
    }
    public getAllRegisteredIdAndSchema(): IterableIterator<[string, Schema]> {
        return this.schemaCache.entries();
    }

    public async resolve(): Promise<void> {
        debug(
            `resolve reference: reference schema count=${this.referenceCache.size}.`,
        );
        // debug('  schemaCache:');
        // debug(Array.from(this.schemaCache.keys()).join('\n'));
        // debug('  referenceCache:');
        // debug(Array.from(this.referenceCache.keys()).join('\n'));
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
                debug(
                    `get from schema cache, fileId=${fileId}, exists=${String(
                        !!refSchema,
                    )}, ${id.getAbsoluteId()}`,
                );
                if (refSchema == null && id.isFetchable()) {
                    try {
                        debug(`fetch remote schema: id=[${fileId}].`);
                        const s = await readSchemaFromUrl(fileId);
                        this.registerSchema(s);
                    } catch (e) {
                        error.push(
                            `Fail to fetch the $ref target: ${id.getAbsoluteId()}, ${String(
                                e,
                            )}`,
                        );
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
                    const rootSchema = this.searchParentSchema(id);
                    if (rootSchema == null) {
                        error.push(
                            `The $ref targets root is not found: ${id.getAbsoluteId()}`,
                        );
                        continue;
                    }
                    const targetSchema = getSubSchema(
                        rootSchema,
                        id.getJsonPointerHash(),
                        id,
                    );
                    this.addSchema(targetSchema);
                    this.registerSchema(targetSchema);
                    this.referenceCache.set(id.getAbsoluteId(), targetSchema);
                } else {
                    error.push(
                        `The $ref target is not found: ${id.getAbsoluteId()}`,
                    );
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
    private searchParentSchema(id: SchemaId): Schema | undefined {
        const fileId = id.getFileId();
        const rootSchema = this.schemaCache.get(fileId);
        if (rootSchema != null) {
            return rootSchema;
        }
        const key = id.getAbsoluteId();
        for (const k of this.schemaCache.keys()) {
            if (key.startsWith(k)) {
                const s = this.schemaCache.get(k);
                if (s?.rootSchema) {
                    return s.rootSchema;
                }
            }
        }
        return;
    }

    public registerSchema(schema: Schema): void {
        debug(`register schema: schemaId=[${schema.id.getAbsoluteId()}].`);
        searchAllSubSchema(
            schema,
            (subSchema) => {
                this.addSchema(subSchema);
            },
            (refId) => {
                this.addReference(refId);
            },
        );
    }

    private addSchema(schema: Schema): void {
        const id = schema.id;
        const key = id.getAbsoluteId();
        if (!this.schemaCache.has(key)) {
            debug(` add schema: id=${key}`);
            this.schemaCache.set(key, schema);
            if (schema.rootSchema == null) {
                const fileId = id.getFileId();
                if (!this.schemaCache.has(fileId)) {
                    this.schemaCache.set(fileId, schema);
                }
            }
        }
    }
    private addReference(refId: SchemaId): void {
        if (!this.referenceCache.has(refId.getAbsoluteId())) {
            debug(` add reference: id=${refId.getAbsoluteId()}`);
            this.referenceCache.set(refId.getAbsoluteId(), undefined);
        }
    }

    public clear(): void {
        debug('clear resolver cache.');
        this.schemaCache.clear();
        this.referenceCache.clear();
    }
}
