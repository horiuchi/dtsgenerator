import * as Debug from 'debug';
import * as http from 'http';
import * as request from 'request';
import * as JsonPointer from './jsonPointer';
import { SchemaId } from './schemaid';
import { TypeDefenition } from './typeDefenition';
import { WriteProcessor } from './writeProcessor';

const debug = Debug('dtsgen');


export class JsonSchemaParser {
    private typeCache = new Map<string, TypeDefenition>();
    private schemaReference = new Map<string, TypeDefenition>();
    private referenceCache = new Map<Schema, Map<SchemaId, TypeDefenition>>();

    public async generateDts(prefix?: string, header?: string): Promise<string> {
        debug(`generate d.ts: prefix=[${prefix}].`);
        await this.resolveReference();

        debug('TypeId list:');
        for (let typeId of this.typeCache.keys()) {
            debug('  ' + typeId);
        }
        debug('SchemaId list:');
        for (let ref of this.schemaReference.keys()) {
            debug('  ' + ref);
        }
        debug('Reference list:');
        for (let schema of this.referenceCache.keys()) {
            debug('  ' + schema.id);
            for (let id of this.referenceCache.get(schema).keys()) {
                debug('    ' + id.getAbsoluteId());
            }
        }

        const process = new WriteProcessor((baseSchema: Schema, refId: SchemaId): TypeDefenition => {
            debug(`Search Reference: schemaId=${baseSchema ? baseSchema.id : null}, refId=${refId.getAbsoluteId()}`);
            const map = this.referenceCache.get(baseSchema);
            if (map == null) {
                return undefined;
            }
            const result = map.get(refId);
            if (result == null && refId.getFileId() === '' && refId.isJsonPointerHash()) {
                return JsonPointer.get(baseSchema, refId.getJsonPointerHash());
            }
            return result;
        }, prefix);
        const env = this.createHierarchicalMap(this.typeCache);
        if (header) {
            process.outputLine(header);
        }
        this.walk(process, env);
        return process.toDefinition();
    }
    private createHierarchicalMap(types: Map<string, TypeDefenition>): any {
        const map: any = {};
        if (types.size === 0) {
            throw new Error('There is no id in the input schema(s)');
        }
        types.forEach((type: TypeDefenition, uri: string) => {
            const id = new SchemaId(uri);
            const names = id.getTypeNames();
            JsonPointer.set(map, names, type);
        });
        return map;
    }
    private walk(process: WriteProcessor, env: any): void {
        const keys = Object.keys(env).sort();
        keys.forEach((key) => {
            const val = env[key];
            if (val instanceof TypeDefenition) {
                val.doProcess(process);
            } else {
                if (process.indentLevel === 0) {
                    process.output('declare ');
                }
                process.output('namespace ').outputType(key, true).outputLine(' {');
                process.increaseIndent();
                this.walk(process, val);
                process.decreaseIndent();
                process.outputLine('}');
            }
        });
    }

    public async resolveReference(): Promise<boolean> {
        debug(`resolve reference: reference schema count=${this.referenceCache.size}.`);
        const error: string[] = [];
        for (let schema of this.referenceCache.keys()) {
            const map = this.referenceCache.get(schema);
            for (let [ref, type] of map) {
                if (type != null) {
                    continue;
                }
                const fileId = ref.getFileId();
                if (fileId && !this.schemaReference.has(fileId)) {
                    if (!ref.isFetchable()) {
                        error.push(`$ref target is not found: ${ref.getAbsoluteId()}`);
                        continue;
                    }
                    try {
                        debug(`fetch remote schema: id=[${fileId}].`);
                        const fetchedSchema = await this.fetchRemoteSchema(fileId);
                        this.parseSchema(fetchedSchema, fileId);
                    } catch (e) {
                        error.push(`fail to fetch the $ref target: ${ref.getAbsoluteId()}, ${e}`);
                        continue;
                    }
                }
                if (ref.isJsonPointerHash()) {
                    const pointer = ref.getJsonPointerHash();
                debug(`resolve reference: ref=[${ref.getAbsoluteId()}]`);
                    const targetSchema = fileId ? this.schemaReference.get(fileId).rootSchema : schema;
                    map.set(ref, new TypeDefenition(targetSchema, pointer));
                } else {
                    const target = this.typeCache.get(ref.getAbsoluteId());
                    if (target == null) {
                        error.push(`$ref target is not found: ${ref.getAbsoluteId()}`);
                        continue;
                    }
                    map.set(ref, target);
                }
            }
        }
        if (error.length > 0) {
            throw new Error(error.join('\n'));
        }
        return true;
    }
    private fetchRemoteSchema(fileId: string): Promise<Schema> {
        return new Promise<Schema>((resolve: (schema: Schema) => void, reject: (err: any) => void) => {
            request.get(fileId, (err: any, response: http.IncomingMessage, body: any) => {
                if (err) {
                    return reject(err);
                } else if (response.statusCode !== 200) {
                    return reject(body);
                } else {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }

    public parseSchema(schema: Schema, url?: string): void {
        if (typeof schema === 'string') {
            schema = JSON.parse(<string>schema);
        }
        debug(`parse schema: schemaId=[${schema.id}], url=[${url}].`);

        if (schema.id == null) {
            schema.id = url;
        }
        const walk = (obj: any, paths: string[]): void => {
            if (obj == null || typeof obj !== 'object') {
                return;
            }
            if (Array.isArray(obj)) {
                obj.forEach((item: any, index: number) => {
                    const subPaths = paths.concat('' + index);
                    walk(item, subPaths);
                });
                return;
            }
            Object.keys(obj).forEach((key) => {
                const sub = obj[key];
                if (sub != null) {
                    const subPaths = paths.concat(key);
                    walk(sub, subPaths);
                }
            });
            if (typeof obj.id === 'string') {
                const type = new TypeDefenition(schema, paths);
                obj.id = type.schemaId.getAbsoluteId();
                this.addType(type);
                debug(`parse schema: id property found, id=[${obj.id}], paths=[${JSON.stringify(paths)}].`);
            }
            if (typeof obj.$ref === 'string') {
                obj.$ref = this.addReference(schema, obj.$ref);
                debug(`parse schema: $ref property found, $ref=[${obj.$ref.getAbsoluteId()}], paths=[${JSON.stringify(paths)}].`);
            }
        };
        walk(schema, []);
    }
    private addType(g: TypeDefenition): void {
        const id = g.schemaId;
        if (id) {
            this.typeCache.set(id.getAbsoluteId(), g);
            const fileId = id.getFileId();
            if (!this.schemaReference.has(fileId)) {
                this.schemaReference.set(fileId, g);
            }
        }
    }
    private addReference(schema: Schema, ref: string): SchemaId {
        let map = this.referenceCache.get(schema);
        if (map == null) {
            map = new Map<SchemaId, TypeDefenition>();
            this.referenceCache.set(schema, map);
        }
        const id = new SchemaId(ref, []);
        map.set(id, null);
        return id;
    }

    public clear(): void {
        debug('clear data cache.');
        this.typeCache.clear();
        this.schemaReference.clear();
        this.referenceCache.clear();
    }
}

