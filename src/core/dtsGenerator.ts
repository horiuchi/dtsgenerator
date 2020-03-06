import Debug from 'debug';
import ts from 'typescript';
import { get, set, tilde } from '../jsonPointer';
import * as ast from './astBuilder';
import config from './config';
import { getSubSchema, JsonSchema, JsonSchemaObject, NormalizedSchema, Schema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import * as utils from './utils';

const debug = Debug('dtsgen');
const typeMarker = Symbol();

export default class DtsGenerator {

    private currentSchema!: NormalizedSchema;

    constructor(private resolver: ReferenceResolver) { }

    public async generate(): Promise<string> {
        debug('generate type definition files.');
        await this.resolver.resolve();

        const map = this.buildSchemaMergedMap(this.resolver.getAllRegisteredSchema());

        const root = this.walk(map, true);
        if (config.outputAST) {
            return JSON.stringify(root, null, 2);
        } else {
            const resultFile = ts.createSourceFile('_.d.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
            const printer = ts.createPrinter();
            const result = printer.printList(ts.ListFormat.Decorators, ts.createNodeArray(root, false), resultFile);
            return result;
        }
    }

    private buildSchemaMergedMap(schemas: IterableIterator<Schema>): any {
        const map: any = {};
        const paths: { path: string[]; type: Schema; }[] = [];
        for (const type of schemas) {
            const path = config.typeNameConvertor(type.id);
            paths.push({ path, type });
        }

        for (const item of paths) {
            const path = item.path;
            const parent = get(map, path, true);
            if (parent == null) {
                set(map, path, { [typeMarker]: item.type });
            } else {
                parent[typeMarker] = item.type;
            }
        }
        if (Object.keys(map).length === 0) {
            throw new Error('There is no schema in the input contents.');
        }
        return map;
    }

    private walk(map: any, root: boolean): ts.Statement[] {
        const result: ts.Statement[] = [];
        const keys = Object.keys(map).sort();
        for (const key of keys) {
            const value = map[key];
            if (value.hasOwnProperty(typeMarker)) {
                const schema = value[typeMarker] as Schema;
                debug(`  walk doProcess: key=${key} schemaId=${schema.id.getAbsoluteId()}`);
                result.push(this.walkSchema(schema, root));
            }
            if (typeof value === 'object' && Object.keys(value).length > 0) {
                result.push(ast.buildNamespaceNode(key, this.walk(value, false), root));
            }
        }
        return result;
    }

    private walkSchema(schema: Schema, root: boolean): ts.DeclarationStatement {
        const normalized = this.normalizeContent(schema);
        this.currentSchema = normalized;

        const getNode = () => {
            const type = normalized.content.type;
            switch (type) {
                case 'any':
                    return this.generateAnyTypeModel(normalized, root);
                case 'array':
                    return this.generateTypeCollection(normalized, root);
                case 'object':
                default:
                    return this.generateDeclareType(normalized, root);
            }
        };
        return ast.addOptionalInformation(ast.addComment(getNode(), normalized, true), normalized, true);
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
            if (content.type === undefined && (content.properties || content.additionalProperties)) {
                content.type = 'object';
            }
            if (content.nullable) {
                const type = content.type;
                if (type == null) {
                    content.type = 'null';
                } else if (!Array.isArray(type)) {
                    content.type = [type, 'null'];
                } else {
                    type.push('null');
                }
            }
            const types = content.type;
            if (Array.isArray(types)) {
                const reduced = utils.reduceTypes(types);
                content.type = reduced.length === 1 ? reduced[0] : reduced;
            }
        }
        return Object.assign({}, schema, { content });
    }
    private generateDeclareType(schema: NormalizedSchema, root: boolean): ts.DeclarationStatement {
        const content = schema.content;
        if (content.$ref || content.oneOf || content.anyOf || content.enum || 'const' in content || content.type !== 'object') {
            const type = this.generateTypeProperty(schema);
            return ast.buildTypeAliasNode(schema.id, type, root);
        } else {
            const members = this.generateProperties(schema);
            return ast.buildInterfaceNode(schema.id, members, root);
        }
    }

    private generateAnyTypeModel(schema: NormalizedSchema, root: boolean): ts.DeclarationStatement {
        const member = ast.buildIndexSignatureNode('name', ast.buildStringKeyword(), ast.buildAnyKeyword());
        return ast.buildInterfaceNode(schema.id, [member], root);
    }

    private generateTypeCollection(schema: NormalizedSchema, root: boolean): ts.DeclarationStatement {
        const type = this.generateArrayTypeProperty(schema);
        return ast.buildTypeAliasNode(schema.id, type, root);
    }

    private generateProperties(baseSchema: NormalizedSchema): ts.TypeElement[] {
        const result: ts.TypeElement[] = [];
        const content = baseSchema.content;
        if (content.additionalProperties) {
            const schema = this.normalizeContent(baseSchema, '/additionalProperties');
            const valueType = content.additionalProperties === true ? ast.buildAnyKeyword() : this.generateTypeProperty(schema);
            const node = ast.buildIndexSignatureNode('name', ast.buildStringKeyword(), valueType);
            result.push(ast.addOptionalInformation(node, schema, true));
        }
        if (content.properties) {
            for (const propertyName of Object.keys(content.properties)) {
                const schema = this.normalizeContent(baseSchema, '/properties/' + tilde(propertyName));
                const node = ast.buildPropertySignature(schema, propertyName, this.generateTypeProperty(schema), baseSchema.content.required);
                result.push(ast.addOptionalInformation(ast.addComment(node, schema, true), schema, true));
            }
        }
        return result;
    }
    private generateTypeProperty(schema: NormalizedSchema, terminate = true): ts.TypeNode {
        const content = schema.content;
        if (content.$ref) {
            const ref = this.resolver.dereference(content.$ref);
            if (ref.id == null) {
                throw new Error('target referenced id is nothing: ' + content.$ref);
            }
            const refSchema = this.normalizeContent(ref);
            const node = ast.buildTypeReferenceNode(refSchema, this.currentSchema);
            return ast.addOptionalInformation(ast.addComment(node, refSchema, false), refSchema, false);
        }
        if (content.anyOf) {
            return this.generateArrayedType(schema, content.anyOf, '/anyOf/', terminate);
        }
        if (content.oneOf) {
            return this.generateArrayedType(schema, content.oneOf, '/oneOf/', terminate);
        }
        if (content.enum) {
            return ast.buildUnionTypeNode(content.enum, (value) => {
                return this.generateLiteralTypeNode(content, value);
            }, terminate);
        } else if ('const' in content) {
            return this.generateLiteralTypeNode(content, content.const);
        } else {
            return this.generateType(schema, terminate);
        }
    }
    private generateLiteralTypeNode(content: JsonSchemaObject, value: any): ts.LiteralTypeNode {
        switch (content.type) {
            case 'integer':
            case 'number':
                return ast.buildNumericLiteralTypeNode('' + value);
            case 'boolean':
                return ast.buildBooleanLiteralTypeNode(value);
            default:
                return ast.buildStringLiteralTypeNode(value);
        }
    }

    private generateArrayedType(baseSchema: NormalizedSchema, contents: JsonSchema[], path: string, terminate: boolean): ts.TypeNode {
        return ast.addOptionalInformation(ast.addComment(ast.buildUnionTypeNode(contents, (_, index) => {
            const schema = this.normalizeContent(baseSchema, path + index);
            if (schema.id.isEmpty()) {
                return ast.addOptionalInformation(this.generateTypeProperty(schema, false), schema, false);
            } else {
                return ast.addOptionalInformation(ast.buildTypeReferenceNode(schema, this.currentSchema), schema, false);
            }
        }, terminate), baseSchema, false), baseSchema, terminate);
    }

    private generateArrayTypeProperty(schema: NormalizedSchema, terminate = true): ts.TypeNode {
        const items = schema.content.items;
        const minItems = schema.content.minItems;
        const maxItems = schema.content.maxItems;
        if (items == null) {
            return ast.buildSimpleArrayNode(ast.buildAnyKeyword());
        } else if (!Array.isArray(items)) {
            const subSchema = this.normalizeContent(schema, '/items');
            const node = this.generateTypeProperty(subSchema, false);
            return ast.buildSimpleArrayNode(ast.addOptionalInformation(node, subSchema, false));
        } else if (items.length === 0 && minItems === undefined && maxItems === undefined) {
            return ast.buildSimpleArrayNode(ast.buildAnyKeyword());
        } else if (minItems != null && maxItems != null && maxItems < minItems) {
            return ast.buildNeverKeyword();
        } else {
            const types: ts.TypeNode[] = [];
            for (let i = 0; i < items.length; i++) {
                const type = this.normalizeContent(schema, '/items/' + i);
                if (type.id.isEmpty()) {
                    types.push(this.generateTypeProperty(type, false));
                } else {
                    types.push(ast.addOptionalInformation(ast.buildTypeReferenceNode(type, this.currentSchema), type, false));
                }
            }
            return ast.addOptionalInformation(ast.buildTupleTypeNode(types, minItems, maxItems), schema, terminate);
        }
    }

    private generateType(schema: NormalizedSchema, terminate: boolean): ts.TypeNode {
        const type = schema.content.type;
        if (type == null) {
            return ast.buildAnyKeyword();
        } else if (typeof type === 'string') {
            return this.generateTypeName(schema, type, terminate);
        } else {
            const types = utils.reduceTypes(type);
            if (types.length <= 1) {
                schema.content.type = types[0];
                return this.generateType(schema, terminate);
            } else {
                return ast.buildUnionTypeNode(types, (t) => {
                    return this.generateTypeName(schema, t, false);
                }, terminate);
            }
        }
    }
    private generateTypeName(schema: NormalizedSchema, type: string, terminate: boolean): ts.TypeNode {
        const tsType = utils.toTSType(type, schema.content);
        if (tsType) {
            return ast.buildKeyword(tsType);
        } else if (type === 'object') {
            return ast.buildTypeLiteralNode(this.generateProperties(schema));
        } else if (type === 'array') {
            return this.generateArrayTypeProperty(schema, terminate);
        } else {
            throw new Error('unknown type: ' + type);
        }
    }
}
