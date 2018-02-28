import Debug from 'debug';
import { getSubSchema, JsonSchema, NormalizedSchema, Schema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import SchemaConvertor from './schemaConvertor';
import * as utils from './utils';

const debug = Debug('dtsgen');
const typeMaker = Symbol();

export default class DtsGenerator {

    private currentSchema!: NormalizedSchema;

    constructor(private resolver: ReferenceResolver, private convertor: SchemaConvertor) {}

    public async generate(): Promise<string> {
        debug('generate type definition files.');
        await this.resolver.resolve();

        const map = this.resolver.getAllSchemaMergedMap(typeMaker);
        this.convertor.start();
        this.walk(map);
        const result = this.convertor.end();

        return result;
    }

    private walk(map: any): void {
        const keys = Object.keys(map).sort();
        for (const key of keys) {
            const value = map[key];
            if (value.hasOwnProperty(typeMaker)) {
                const schema = value[typeMaker] as Schema;
                debug(`  walk doProcess: schemaId=${schema.id.getAbsoluteId()}`);
                this.walkSchema(schema);
                delete value[typeMaker];
            }
            if (typeof value === 'object' && Object.keys(value).length > 0) {
                this.convertor.startNest(key);
                this.walk(value);
                this.convertor.endNest();
            }
        }
    }

    private walkSchema(schema: Schema): void {
        const normalized = this.normalizeContent(schema);
        this.currentSchema = normalized;
        this.convertor.outputComments(normalized);

        const type = normalized.content.type;
        switch (type) {
            case 'object':
            case 'any':
                return this.generateTypeModel(normalized);
            case 'array':
                return this.generateTypeCollection(normalized);
            default:
                return this.generateDeclareType(normalized);
        }
    }

    private normalizeContent(schema: Schema, pointer?: string): NormalizedSchema {
        if (pointer != null) {
            schema = getSubSchema(schema, pointer);
        }
        let content = schema.content;
        if (typeof content === 'boolean') {
            content = content ? {} : { not: {} };
        } else {
            if (content.allOf) {
                const work = content;
                for (let sub of content.allOf) {
                    if (typeof sub === 'object' && sub.$ref) {
                        const ref = this.resolver.dereference(sub.$ref);
                        sub = this.normalizeContent(ref).content;
                    }
                    utils.mergeSchema(work, sub);
                }
                delete content.allOf;
                content = work;
            }
            const types = content.type;
            if (types === undefined && (content.properties || content.additionalProperties)) {
                content.type = 'object';
            } else if (Array.isArray(types)) {
                const reduced = utils.reduceTypes(types);
                content.type = reduced.length === 1 ? reduced[0] : reduced;
            }
        }
        return Object.assign({}, schema, { content });
    }
    private generateDeclareType(schema: NormalizedSchema): void {
        const name = schema.id.getInterfaceName();
        this.convertor.outputExportType(name);
        this.generateTypeProperty(schema, true);
    }

    private generateTypeModel(schema: NormalizedSchema): void {
        const name = schema.id.getInterfaceName();
        this.convertor.startInterfaceNest(name);
        if (schema.content.type === 'any') {
            this.convertor.outputRawValue('[name: string]: any; // any', true);
        }
        this.generateProperties(schema);
        this.convertor.endInterfaceNest();
    }

    private generateTypeCollection(schema: NormalizedSchema): void {
        const name = schema.id.getInterfaceName();
        this.convertor.outputExportType(name);
        this.generateArrayTypeProperty(schema, true);
    }

    private generateProperties(baseSchema: NormalizedSchema): void {
        const content = baseSchema.content;
        if (content.additionalProperties) {
            this.convertor.outputRawValue('[name: string]: ');
            const schema = this.normalizeContent(baseSchema, '/additionalProperties');
            if (content.additionalProperties === true) {
                this.convertor.outputStringTypeName(schema, 'any', true);
            } else {
                this.generateTypeProperty(schema, true);
            }
        }
        if (content.properties) {
            for (const propertyName of Object.keys(content.properties)) {
                const schema = this.normalizeContent(baseSchema, '/properties/' + propertyName);
                this.convertor.outputComments(schema);
                this.convertor.outputPropertyName(schema, propertyName, baseSchema.content.required);
                this.generateTypeProperty(schema);
            }
        }
    }
    private generateTypeProperty(schema: NormalizedSchema, terminate = true): void {
        const content = schema.content;
        if (content.$ref) {
            const ref = this.resolver.dereference(content.$ref);
            if (ref.id == null) {
                throw new Error('target referenced id is nothing: ' + content.$ref);
            }
            const refSchema = this.normalizeContent(ref);
            return this.convertor.outputTypeIdName(refSchema, this.currentSchema, terminate);
        }
        if (content.anyOf || content.oneOf) {
            this.generateArrayedType(schema, content.anyOf, '/anyOf/', terminate);
            this.generateArrayedType(schema, content.oneOf, '/oneOf/', terminate);
            return;
        }
        if (content.enum) {
            return this.convertor.outputArrayedType(schema, content.enum, (value) => {
                if (content.type === 'integer') {
                    this.convertor.outputRawValue('' + value);
                } else {
                    this.convertor.outputRawValue(`"${value}"`);
                }
            }, terminate);
        }
        this.generateType(schema, terminate);
    }
    private generateArrayedType(baseSchema: NormalizedSchema, contents: JsonSchema[] | undefined, path: string, terminate: boolean): void {
        if (contents) {
            this.convertor.outputArrayedType(baseSchema, contents, (_content, index) => {
                const schema = this.normalizeContent(baseSchema, path + index);
                if (schema.id.isEmpty()) {
                    this.generateTypeProperty(schema, false);
                } else {
                    this.convertor.outputTypeIdName(schema, this.currentSchema, false);
                }
            }, terminate);
        }
    }


    private generateArrayTypeProperty(schema: NormalizedSchema, terminate = true): void {
        const items = schema.content.items;
        const minItems = schema.content.minItems;
        if (items == null) {
            this.convertor.outputStringTypeName(schema, 'any[]', terminate);
        } else if (!Array.isArray(items)) {
            this.generateTypeProperty(this.normalizeContent(schema, '/items'), false);
            this.convertor.outputStringTypeName(schema, '[]', terminate);
        } else if (items.length === 0 && minItems === undefined) {
            this.convertor.outputStringTypeName(schema, 'any[]', terminate);
        } else {
            const effectiveMaxItems = 1 + Math.max(minItems || 0, items.length);
            for (
                let unionIndex = minItems === undefined ? 1 : minItems;
                unionIndex <= effectiveMaxItems;
                unionIndex++
            ) {
                this.convertor.outputRawValue('[');
                for (let i = 0; i < unionIndex; i++) {
                    if (i > 0) {
                        this.convertor.outputRawValue(', ');
                    }
                    if (i < items.length) {
                        const type = this.normalizeContent(schema, '/items/' + i);
                        if (type.id.isEmpty()) {
                            this.generateTypeProperty(type, false);
                        } else {
                            this.convertor.outputTypeIdName(type, this.currentSchema, false);
                        }
                    } else {
                        if (i < effectiveMaxItems - 1) {
                            this.convertor.outputStringTypeName(schema, 'Object', false, false);
                        } else {
                            this.convertor.outputStringTypeName(schema, 'any', false, false);
                        }
                    }
                }
                this.convertor.outputRawValue(']');
                if (unionIndex < effectiveMaxItems) {
                    this.convertor.outputRawValue(' | ');
                }
            }
            this.convertor.outputStringTypeName(schema, '', terminate);
        }
    }

    private generateType(schema: NormalizedSchema, terminate: boolean, outputOptional = true): void {
        const type = schema.content.type;
        if (type == null) {
            this.convertor.outputPrimitiveTypeName(schema, 'any', terminate, outputOptional);
        } else if (typeof type === 'string') {
            this.generateTypeName(schema, type, terminate, outputOptional);
        } else {
            const types = utils.reduceTypes(type);
            if (types.length <= 1) {
                schema.content.type = types[0];
                this.generateType(schema, terminate, outputOptional);
            } else {
                this.convertor.outputArrayedType(schema, types, (t) => {
                    this.generateTypeName(schema, t, false, false);
                }, terminate);
            }
        }
    }
    private generateTypeName(schema: NormalizedSchema, type: string, terminate: boolean, outputOptional = true): void {
        const tsType = utils.toTSType(type, schema.content);
        if (tsType) {
            this.convertor.outputPrimitiveTypeName(schema, tsType, terminate, outputOptional);
        } else if (type === 'object') {
            this.convertor.startTypeNest();
            this.generateProperties(schema);
            this.convertor.endTypeNest(terminate);
        } else if (type === 'array') {
            this.generateArrayTypeProperty(schema, terminate);
        } else {
            throw new Error('unknown type: ' + type);
        }
    }
}
