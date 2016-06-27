import * as Debug from 'debug';
import * as http from 'http';
import * as request from 'request';
import * as JsonPointer from './jsonPointer';
import { SchemaId } from './schemaid';
import { TypeDefinition } from './typeDefinition';
import { WriteProcessor } from './writeProcessor';

const debug = Debug('dtsgen');

const walkMaker = '<<type>>';

export class JsonSchemaParser {
    private typeCache = new Map<string, TypeDefinition>();
    private schemaReference = new Map<string, TypeDefinition>();
    private referenceCache = new Map<json_schema_org.Schema, Map<string, TypeDefinition>>();

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
                debug('    ' + id);
            }
        }

        const process = new WriteProcessor((baseSchema: json_schema_org.Schema, ref: string): TypeDefinition => {
            debug(`Search Reference: schemaId=${baseSchema ? baseSchema.id : null}, ref=${ref}`);
            const map = this.referenceCache.get(baseSchema);
            if (map == null) {
                return undefined;
            }
            const refId = new SchemaId(ref);
            const result = map.get(refId.getAbsoluteId());
            if (result == null) {
                if (refId.isJsonPointerHash()) {
                    const fileId = refId.getFileId();
                    const schema = fileId ? this.schemaReference.get(fileId).targetSchema : baseSchema;
                    debug(`  fileId=${fileId}, schemaId=${schema.id}.`);
                    return JsonPointer.get(schema, refId.getJsonPointerHash());
                }
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
    private createHierarchicalMap(types: Map<string, TypeDefinition>): any {
        const map: any = {};
        if (types.size === 0) {
            throw new Error('There is no id in the input schema(s)');
        }
        for (let type of types.values()) {
            const names = type.schemaId.getTypeNames();
            JsonPointer.set(map, names.concat(walkMaker), type);
        }
        return map;
    }
    private walk(process: WriteProcessor, env: any, path: string[] = []): void {
        const keys = Object.keys(env).sort();
        keys.forEach((key) => {
            const val = env[key];
            const type = val[walkMaker];
            if (type instanceof TypeDefinition) {
                debug(`  walk doProcess: path=${JSON.stringify(path)}, schemaId=${type.schemaId.getAbsoluteId()}`);
                type.doProcess(process);
            }
            delete val[walkMaker];

            if (Object.keys(val).length > 0) {
                const nextPath = path.concat(key);
                if (process.indentLevel === 0) {
                    process.output('declare ');
                }
                process.output('namespace ').outputType(key, true).outputLine(' {');
                process.increaseIndent();
                this.walk(process, val, nextPath);
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
                const refId = new SchemaId(ref);
                const fileId = refId.getFileId();
                if (fileId && !this.schemaReference.has(fileId)) {
                    if (!refId.isFetchable()) {
                        error.push(`$ref target is not found: ${ref}`);
                        continue;
                    }
                    try {
                        debug(`fetch remote schema: id=[${fileId}].`);
                        const fetchedSchema = await this.fetchRemoteSchema(fileId);
                        this.parseSchema(fetchedSchema, fileId);
                    } catch (e) {
                        error.push(`fail to fetch the $ref target: ${ref}, ${e}`);
                        continue;
                    }
                }
                debug(`resolve reference: ref=[${ref}]`);
                if (refId.isJsonPointerHash()) {
                    const pointer = refId.getJsonPointerHash();
                    const targetSchema = fileId ? this.schemaReference.get(fileId).rootSchema : schema;
                    const type = new TypeDefinition(targetSchema, pointer, refId);
                    map.set(ref, type);
                    this.addType(type);
                } else {
                    const target = this.typeCache.get(ref);
                    if (target == null) {
                        error.push(`$ref target is not found: ${ref}`);
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
    private fetchRemoteSchema(fileId: string): Promise<json_schema_org.Schema> {
        return new Promise<json_schema_org.Schema>((resolve: (schema: json_schema_org.Schema) => void, reject: (err: any) => void) => {
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

    public parseSchema(schema: json_schema_org.Schema, url?: string): void {
        if (typeof schema === 'string') {
            schema = JSON.parse(<string>schema);
        }
        debug(`parse schema: schemaId=[${schema.id}], url=[${url}].`);

        if (schema.id == null) {
            schema.id = url;
        }
        const walk = (s: json_schema_org.Schema, paths: string[]): void => {
            function walkArray(array: json_schema_org.Schema[], pathArray: string[]): void {
                array.forEach((item: json_schema_org.Schema, index: number) => {
                    walk(item, pathArray.concat(index.toString()));
                });
            }
            function walkObject(obj: { [name: string]: json_schema_org.Schema; }, pathObject: string[], isDefinitions: boolean = false): void {
                Object.keys(obj).forEach((key) => {
                    const sub = obj[key];
                    if (sub != null) {
                        if (isDefinitions && sub.id == null) {
                            sub.id = `#/definitions/${key}`;
                        }
                        walk(sub, pathObject.concat(key));
                    }
                });
            }
            if (s == null || typeof s !== 'object') {
                return;
            }

            const anyOf = s.anyOf;
            if (anyOf != null) {
                walkArray(anyOf, paths.concat('anyOf'));
            }
            const oneOf = s.oneOf;
            if (oneOf != null) {
                walkArray(oneOf, paths.concat('oneOf'));
            }

            const items = s.items;
            if (items != null) {
                if (Array.isArray(items)) {
                    walkArray(items, paths.concat('items'));
                } else {
                    walk(items, paths.concat('items'));
                }
            }
            const additionalItems = s.additionalItems;
            if (additionalItems != null && typeof additionalItems !== 'boolean') {
                walk(additionalItems, paths.concat('additionalItems'));
            }

            const definitions = s.definitions;
            if (definitions != null) {
                walkObject(s.definitions, paths.concat('definitions'), true);
            }
            const properties = s.properties;
            if (properties != null) {
                walkObject(s.properties, paths.concat('properties'));
            }
            const patternProperties = s.patternProperties;
            if (patternProperties != null) {
                walkObject(s.patternProperties, paths.concat('patternProperties'));
            }
            const additionalProperties = s.additionalProperties;
            if (additionalProperties != null && typeof additionalProperties !== 'boolean') {
                walk(additionalProperties, paths.concat('additionalProperties'));
            }

            if (typeof s.id === 'string') {
                const type = new TypeDefinition(schema, paths);
                s.id = type.schemaId.getAbsoluteId();
                this.addType(type);
                // debug(`parse schema: id property found, id=[${obj.id}], paths=${JSON.stringify(paths)}.`);
            }
            if (typeof s.$ref === 'string') {
                s.$ref = this.addReference(schema, s.$ref);
                // debug(`parse schema: $ref property found, $ref=[${obj.$ref}], paths=${JSON.stringify(paths)}.`);
            }
        };
        walk(schema, []);
    }
    private addType(g: TypeDefinition): void {
        const id = g.schemaId;
        if (id) {
            this.typeCache.set(id.getAbsoluteId(), g);
            debug(`add type: id=${id.getAbsoluteId()}`);
            const fileId = id.getFileId();
            if (!this.schemaReference.has(fileId)) {
                this.schemaReference.set(fileId, g);
            }
        }
    }
    private addReference(schema: json_schema_org.Schema, ref: string): string {
        let map = this.referenceCache.get(schema);
        if (map == null) {
            map = new Map<string, TypeDefinition>();
            this.referenceCache.set(schema, map);
        }
        const refId = new SchemaId(ref, [schema.id]);
        map.set(refId.getAbsoluteId(), null);
        return refId.getAbsoluteId();
    }

    public clear(): void {
        debug('clear data cache.');
        this.typeCache.clear();
        this.schemaReference.clear();
        this.referenceCache.clear();
    }
}

