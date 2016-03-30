import * as http from 'http';
import * as request from 'request';
import * as JsonPointer from './jsonPointer';
import { SchemaId } from './schemaid';
import { TypeDefenition } from './typeDefenition';
import { WriteProcessor } from './writeProcessor';


export class JsonSchemaParser {
    private typeCache = new Map<string, TypeDefenition>();
    private schemaReference = new Map<string, TypeDefenition>();
    private referenceCache = new Map<JsonSchema, Map<SchemaId, TypeDefenition>>();

    public async generateDts(prefix?: string, header?: string): Promise<string> {
        await this.resolveReference();
        const process = new WriteProcessor((baseSchema: JsonSchema, refId: SchemaId): TypeDefenition => {
            const map = this.referenceCache.get(baseSchema);
            if (map == null) {
                return undefined;
            }
            return map.get(refId);
        }, prefix);
        if (header) {
            process.outputLine(header);
        }
        const env = this.createHierarchicalMap(this.typeCache);
        this.walk(process, env);
        return process.toDefinition();
    }
    private createHierarchicalMap(types: Map<string, TypeDefenition>): any {
        const map: any = {};
        types.forEach((type: TypeDefenition, uri: string) => {
            const id = new SchemaId(uri, []);
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
        const error: string[] = [];
        for (let schema of this.referenceCache.keys()) {
            const map = this.referenceCache.get(schema);
            for (let [ref, type] of map) {
                if (type != null) {
                    continue;
                }
                const fileId = ref.getFileId();
                if (fileId && !this.schemaReference.has(fileId)) {
                    if (!ref.isFetchable) {
                        error.push(`$ref target is not found: ${ref.getAbsoluteId()}`);
                        continue;
                    }
                    try {
                        const fetchedSchema = await this.fetchRemoteSchema(fileId);
                        this.parseSchema(fetchedSchema);
                    } catch (e) {
                        error.push(`fail to fetch the $ref target: ${ref.getAbsoluteId()}, ${e}`);
                        continue;
                    }
                }
                if (ref.isJsonPointerHash()) {
                    const pointer = ref.getJsonPointerHash();
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
            throw error;
        }
        return true;
    }
    private fetchRemoteSchema(fileId: string): Promise<JsonSchema> {
        return new Promise<JsonSchema>((resolve: (schema: JsonSchema) => void, reject: (err: any) => void) => {
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

    public parseSchema(schema: JsonSchema): void {
        if (typeof schema === 'string') {
            schema = JSON.parse(<string>schema);
        }
        if (schema.id) {
            this.addType(new TypeDefenition(schema, []));
        }

        const walk = (obj: any, paths: string[]): void => {
            if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
                return;
            }
            Object.keys(obj).forEach((key) => {
                const sub = obj[key];
                if (sub) {
                    const subPaths = paths.concat(key);
                    if (sub.id) {
                        const type = new TypeDefenition(schema, subPaths);
                        sub.id = type.id.getAbsoluteId();
                        this.addType(type);
                    }
                    if (typeof sub.$ref === 'string') {
                        sub.$ref = this.addReference(schema, sub.$ref);
                    }
                    walk(sub, subPaths);
                }
            });
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
    private addReference(schema: JsonSchema, ref: string): SchemaId {
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
        this.typeCache.clear();
        this.schemaReference.clear();
        this.referenceCache.clear();
    }
}

