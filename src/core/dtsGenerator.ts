import Debug from 'debug';
import * as ts from 'typescript';
import { tilde } from '../jsonPointer';
import * as ast from './astBuilder';
import config from './config';
import { getSubSchema, NormalizedSchema } from './jsonSchema';
import ReferenceResolver from './referenceResolver';
import {
    Plugin,
    Schema,
    JsonSchema,
    JsonSchemaObject,
    PreProcessHandler,
    loadPlugin,
} from './type';
import { buildTypeTree, TypeTree } from './typeTree';
import * as utils from './utils';

const debug = Debug('dtsgen');

interface PluginConfig {
    plugin: Plugin;
    option: boolean | Record<string, unknown>;
}

export default class DtsGenerator {
    private resolver = new ReferenceResolver();
    private currentSchema!: NormalizedSchema;
    private contents: Schema[];
    constructor(contents: Schema[]) {
        this.contents = contents;
    }

    public async generate(): Promise<string> {
        const plugins = await this.getPlugins();
        const preProcess = await this.getPreProcess(plugins.pre);
        for (const p of preProcess) {
            this.contents = p(this.contents);
        }

        debug('generate type definition files.');
        this.contents.forEach((schema) => this.resolver.registerSchema(schema));
        await this.resolver.resolve();

        const tree = buildTypeTree(this.resolver.getAllRegisteredSchema());
        const root = this.walk(tree);
        const file = ts.createSourceFile(
            '_.d.ts',
            '',
            config.target,
            false,
            ts.ScriptKind.TS
        );
        Object.assign(file, {
            statements: ts.factory.createNodeArray(root),
        });

        const postProcess = await this.getPostProcess(plugins.post);
        const result = ts.transform(file, postProcess);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const transformedNodes = result.transformed[0]!;

        const transformedContent = config.outputAST
            ? JSON.stringify(transformedNodes, null, 2)
            : (function () {
                  const printer = ts.createPrinter();
                  return printer.printNode(
                      ts.EmitHint.SourceFile,
                      transformedNodes,
                      file
                  );
              })();

        result.dispose();
        return transformedContent;
    }

    private async getPlugins(): Promise<{
        pre: PluginConfig[];
        post: PluginConfig[];
    }> {
        const pre: PluginConfig[] = [];
        const post: PluginConfig[] = [];
        for (const [name, option] of Object.entries(config.plugins)) {
            const plugin = await loadPlugin(name, option);
            if (plugin == null) {
                continue;
            }
            if (plugin.preProcess != null) {
                pre.push({ plugin, option });
            }
            if (plugin.postProcess != null) {
                post.push({ plugin, option });
            }
        }
        return { pre, post };
    }
    private async getPreProcess(
        pre: PluginConfig[]
    ): Promise<PreProcessHandler[]> {
        debug('load pre process plugin.');
        const result: PreProcessHandler[] = [];
        const inputSchemas = this.resolver.getAllRegisteredIdAndSchema();
        for (const pc of pre) {
            const p = pc.plugin.preProcess;
            if (p == null) {
                continue;
            }
            const handler = await p({ inputSchemas, option: pc.option });
            if (handler != null) {
                result.push(handler);
                debug(
                    '  pre process plugin:',
                    pc.plugin.meta.name,
                    pc.plugin.meta.description
                );
            }
        }
        return result;
    }
    private async getPostProcess(
        post: PluginConfig[]
    ): Promise<ts.TransformerFactory<ts.SourceFile>[]> {
        debug('load post process plugin.');
        const result: ts.TransformerFactory<ts.SourceFile>[] = [];
        const inputSchemas = this.resolver.getAllRegisteredIdAndSchema();
        for (const pc of post) {
            const p = pc.plugin.postProcess;
            if (p == null) {
                continue;
            }
            const factory = await p({ inputSchemas, option: pc.option });
            if (factory != null) {
                result.push(factory);
                debug(
                    '  pre process plugin:',
                    pc.plugin.meta.name,
                    pc.plugin.meta.description
                );
            }
        }
        return result;
    }

    private walk(tree: TypeTree, root = true): ts.Statement[] {
        const result: ts.Statement[] = [];
        const keys = [...tree.children.keys()].sort();
        for (const key of keys) {
            const value = tree.children.get(key);
            if (value === undefined) {
                continue;
            }
            if (value.schema !== undefined) {
                const schema = value.schema;
                debug(
                    `  walk doProcess: key=${key} schemaId=${schema.id.getAbsoluteId()}`
                );
                result.push(this.walkSchema(schema, root));
            }
            if (value.children.size > 0) {
                result.push(
                    ast.buildNamespaceNode(key, this.walk(value, false), root)
                );
            }
        }
        return result;
    }

    private walkSchema(schema: Schema, root: boolean): ts.DeclarationStatement {
        const normalized = this.normalizeContent(schema);
        this.currentSchema = normalized;

        return ast.addOptionalInformation(
            ast.addComment(
                this.parseSchema(normalized, root),
                normalized,
                true
            ),
            normalized,
            true
        );
    }

    private parseSchema(
        schema: NormalizedSchema,
        root = false
    ): ts.DeclarationStatement {
        const type = schema.content.type;
        switch (type) {
            case 'any':
                return this.generateAnyTypeModel(schema, root);
            case 'array':
                return this.generateTypeCollection(schema, root);
            case 'object':
            default:
                return this.generateDeclareType(schema, root);
        }
    }

    private normalizeContent(
        schema: Schema,
        pointer?: string
    ): NormalizedSchema {
        if (pointer != null) {
            schema = getSubSchema(schema, pointer);
        }
        return Object.assign(schema, {
            content: this.normalizeSchemaContent(schema.content),
        });
    }

    private normalizeSchemaContent(content: JsonSchema): JsonSchemaObject {
        if (typeof content === 'boolean') {
            content = content ? {} : { not: {} };
        } else {
            if (content.allOf) {
                const work = {};
                const allOf = content.allOf;
                delete content.allOf;
                for (const sub of allOf) {
                    if (typeof sub === 'object' && sub.$ref) {
                        const ref = this.resolver.dereference(sub.$ref);
                        const normalized = this.normalizeContent(ref).content;
                        utils.mergeSchema(work, normalized);
                    } else {
                        const normalized = this.normalizeSchemaContent(sub);
                        utils.mergeSchema(work, normalized);
                    }
                }
                utils.mergeSchema(work, content);
                content = Object.assign(content, work);
            }
            if (
                content.type === undefined &&
                (content.properties || content.additionalProperties)
            ) {
                content.type = 'object';
            }
            if (content.nullable) {
                const type = content.type;
                const anyOf = content.anyOf;
                if (Array.isArray(anyOf)) {
                    anyOf.push({ type: 'null' });
                } else if (type == null) {
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
        return content;
    }
    private generateDeclareType(
        schema: NormalizedSchema,
        root: boolean
    ): ts.DeclarationStatement {
        const content = schema.content;
        if (
            content.$ref ||
            content.oneOf ||
            content.anyOf ||
            content.enum ||
            'const' in content ||
            content.type !== 'object'
        ) {
            const type = this.generateTypeProperty(schema);
            return ast.buildTypeAliasNode(schema.id, type, root);
        } else {
            const members = this.generateProperties(schema);
            return ast.buildInterfaceNode(schema.id, members, root);
        }
    }

    private generateAnyTypeModel(
        schema: NormalizedSchema,
        root: boolean
    ): ts.DeclarationStatement {
        const member = ast.buildIndexSignatureNode(
            'name',
            ast.buildStringKeyword(),
            ast.buildAnyKeyword()
        );
        return ast.buildInterfaceNode(schema.id, [member], root);
    }

    private generateTypeCollection(
        schema: NormalizedSchema,
        root: boolean
    ): ts.DeclarationStatement {
        const type = this.generateArrayTypeProperty(schema);
        return ast.buildTypeAliasNode(schema.id, type, root);
    }

    private generateProperties(baseSchema: NormalizedSchema): ts.TypeElement[] {
        const result: ts.TypeElement[] = [];
        const content = baseSchema.content;
        if (content.additionalProperties) {
            const schema = this.normalizeContent(
                baseSchema,
                '/additionalProperties'
            );
            const valueType =
                content.additionalProperties === true
                    ? ast.buildAnyKeyword()
                    : this.generateTypeProperty(schema);
            const node = ast.buildIndexSignatureNode(
                'name',
                ast.buildStringKeyword(),
                valueType
            );
            result.push(ast.addOptionalInformation(node, schema, true));
        }
        if (content.properties) {
            for (const propertyName of Object.keys(content.properties)) {
                const schema = this.normalizeContent(
                    baseSchema,
                    '/properties/' + tilde(propertyName)
                );
                const node = ast.buildPropertySignature(
                    schema,
                    propertyName,
                    this.generateTypeProperty(schema),
                    baseSchema.content.required,
                    false
                );
                result.push(
                    ast.addOptionalInformation(
                        ast.addComment(node, schema, true),
                        schema,
                        true
                    )
                );
            }
        }
        if (content.patternProperties) {
            const properties = Object.keys(content.patternProperties);
            const node = ast.buildPropertySignature(
                { content: { readOnly: false } } as NormalizedSchema,
                'pattern',
                ast.buildUnionTypeNode(
                    properties,
                    (propertyName) =>
                        this.generateTypeProperty(
                            this.normalizeContent(
                                baseSchema,
                                '/patternProperties/' + tilde(propertyName)
                            )
                        ),
                    true
                ),
                baseSchema.content.required,
                true
            );
            result.push(
                ts.addSyntheticTrailingComment(
                    node,
                    ts.SyntaxKind.MultiLineCommentTrivia,
                    ` Patterns: ${properties.join(' | ')} `
                )
            );
        }
        return result;
    }
    private generateTypeProperty(
        schema: NormalizedSchema,
        terminate = true
    ): ts.TypeNode {
        const content = schema.content;
        if (content.$ref) {
            const ref = this.resolver.dereference(content.$ref);
            const refSchema = this.normalizeContent(ref);
            const node = ast.addOptionalInformation(
                ast.addComment(
                    ast.buildTypeReferenceNode(refSchema, this.currentSchema),
                    refSchema,
                    false
                ),
                refSchema,
                false
            );
            return node;
        }
        if (content.anyOf) {
            const mergeContent = Object.assign({}, content);
            delete mergeContent.anyOf;
            return this.generateUnionType(
                schema,
                content.anyOf,
                mergeContent,
                '/anyOf/',
                terminate
            );
        }
        if (content.oneOf) {
            const mergeContent = Object.assign({}, content);
            delete mergeContent.oneOf;
            return this.generateUnionType(
                schema,
                content.oneOf,
                mergeContent,
                '/oneOf/',
                terminate
            );
        }
        return this.generateLiteralTypeProperty(schema, terminate);
    }
    private generateLiteralTypeProperty(
        schema: NormalizedSchema,
        terminate = true
    ): ts.TypeNode {
        const content = schema.content;
        if (content.enum) {
            return ast.buildUnionTypeNode(
                content.enum,
                (value) => {
                    return this.generateLiteralTypeNode(content, value);
                },
                terminate
            );
        } else if (content.not) {
            return ast.buildVoidKeyword();
        } else if ('const' in content) {
            return this.generateLiteralTypeNode(content, content.const);
        } else {
            return this.generateType(schema, terminate);
        }
    }
    private checkExistOtherType(
        content: JsonSchemaObject,
        base: NormalizedSchema
    ): ts.TypeNode | undefined {
        const schema = Object.assign({}, base, { content });
        const result = this.generateLiteralTypeProperty(schema, false);
        if (result.kind === ts.SyntaxKind.AnyKeyword) {
            return undefined;
        } else if (result.kind === ts.SyntaxKind.TypeLiteral) {
            const node = result as ts.TypeLiteralNode;
            if (
                node.members.length === 1 &&
                node.members[0]?.kind === ts.SyntaxKind.IndexSignature
            ) {
                return undefined;
            }
        }
        return result;
    }
    private generateLiteralTypeNode(
        content: JsonSchemaObject,
        value: any
    ): ts.LiteralTypeNode {
        switch (content.type) {
            case 'integer':
            case 'number':
                return ast.buildNumericLiteralTypeNode(String(value));
            case 'boolean':
                return ast.buildBooleanLiteralTypeNode(Boolean(value));
            case 'null':
                return ast.buildNullKeyword();
            case 'string':
                return ast.buildStringLiteralTypeNode(String(value));
        }
        if (value === null) {
            return ast.buildNullKeyword();
        }
        switch (typeof value) {
            case 'number':
                return ast.buildNumericLiteralTypeNode(`${value}`);
            case 'boolean':
                return ast.buildBooleanLiteralTypeNode(value);
            case 'string':
                return ast.buildStringLiteralTypeNode(value);
        }
        return ast.buildStringLiteralTypeNode(String(value));
    }

    private generateUnionType(
        baseSchema: NormalizedSchema,
        contents: JsonSchema[],
        mergeContent: JsonSchemaObject,
        path: string,
        terminate: boolean
    ): ts.TypeNode {
        const merged: boolean[] = [];
        const children = contents.map((_, index) => {
            const schema = this.normalizeContent(
                baseSchema,
                path + index.toString()
            );
            merged.push(utils.mergeSchema(schema.content, mergeContent));
            return schema;
        });
        const allRef = merged.every((b) => !b);
        const baseType = this.checkExistOtherType(mergeContent, baseSchema);

        const result = ast.addOptionalInformation(
            ast.addComment(
                ast.buildUnionTypeNode(
                    children,
                    (schema, index) => {
                        const node = schema.id.isEmpty()
                            ? ast.addOptionalInformation(
                                  this.generateTypeProperty(schema, false),
                                  schema,
                                  false
                              )
                            : ast.addOptionalInformation(
                                  ast.buildTypeReferenceNode(
                                      schema,
                                      this.currentSchema
                                  ),
                                  schema,
                                  false
                              );
                        if (baseType != null && !allRef && !merged[index]) {
                            return ast.buildIntersectionTypeNode(
                                [baseType, node],
                                false
                            );
                        }
                        return node;
                    },
                    terminate
                ),
                baseSchema,
                false
            ),
            baseSchema,
            terminate
        );
        if (baseType != null && allRef) {
            return ast.buildIntersectionTypeNode([baseType, result], terminate);
        }
        return result;
    }

    private generateArrayTypeProperty(
        schema: NormalizedSchema,
        terminate = true
    ): ts.TypeNode {
        const items = schema.content.items;
        const minItems = schema.content.minItems;
        const maxItems = schema.content.maxItems;
        const getAdditionalItemNode = () => {
            const additionalItems = schema.content.additionalItems
                ? this.normalizeContent(schema, '/additionalItems')
                : schema.content.additionalItems === false
                ? false
                : undefined;

            return additionalItems === undefined
                ? undefined
                : additionalItems === false
                ? false
                : this.generateTypeProperty(additionalItems, false);
        };

        if (items == null) {
            return ast.buildSimpleArrayNode(ast.buildAnyKeyword());
        } else if (!Array.isArray(items)) {
            const subSchema = this.normalizeContent(schema, '/items');
            const node = this.generateTypeProperty(subSchema, false);
            if (minItems != null && maxItems != null && maxItems < minItems) {
                return ast.buildNeverKeyword();
            } else if (
                (minItems === undefined || minItems === 0) &&
                maxItems === undefined
            ) {
                return ast.buildSimpleArrayNode(
                    ast.addOptionalInformation(node, subSchema, false)
                );
            } else {
                return ast.addOptionalInformation(
                    ast.buildTupleTypeNode(node, minItems, maxItems),
                    schema,
                    terminate
                );
            }
        } else if (
            items.length === 0 &&
            (minItems === undefined || minItems === 0) &&
            maxItems === undefined
        ) {
            const additionalItemsNode = getAdditionalItemNode();
            return additionalItemsNode === false
                ? ast.buildTupleTypeNode([], 0, 0, additionalItemsNode)
                : ast.buildSimpleArrayNode(
                      additionalItemsNode === undefined
                          ? ast.buildAnyKeyword()
                          : additionalItemsNode
                  );
        } else if (
            minItems != null &&
            maxItems != null &&
            maxItems < minItems
        ) {
            return ast.buildNeverKeyword();
        } else {
            const types: ts.TypeNode[] = [];
            for (let i = 0; i < items.length; i++) {
                const type = this.normalizeContent(
                    schema,
                    '/items/' + i.toString()
                );
                if (type.id.isEmpty()) {
                    types.push(this.generateTypeProperty(type, false));
                } else {
                    types.push(
                        ast.addOptionalInformation(
                            ast.buildTypeReferenceNode(
                                type,
                                this.currentSchema
                            ),
                            type,
                            false
                        )
                    );
                }
            }

            const additionalItemsNode = getAdditionalItemNode();
            return ast.addOptionalInformation(
                ast.buildTupleTypeNode(
                    types,
                    minItems,
                    maxItems,
                    additionalItemsNode
                ),
                schema,
                terminate
            );
        }
    }

    private generateType(
        schema: NormalizedSchema,
        terminate: boolean
    ): ts.TypeNode {
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
                return ast.buildUnionTypeNode(
                    types,
                    (t) => {
                        return this.generateTypeName(schema, t, false);
                    },
                    terminate
                );
            }
        }
    }
    private generateTypeName(
        schema: NormalizedSchema,
        type: string,
        terminate: boolean
    ): ts.TypeNode {
        const tsType = utils.toTSType(type, schema.content);
        if (tsType) {
            if (tsType === ts.SyntaxKind.NullKeyword) {
                return ast.buildNullKeyword();
            } else {
                return ast.buildKeyword(tsType);
            }
        } else if (type === 'object') {
            const elements = this.generateProperties(schema);
            if (elements.length > 0) {
                return ast.buildTypeLiteralNode(elements);
            } else {
                return ast.buildFreeFormObjectTypeLiteralNode();
            }
        } else if (type === 'array') {
            return this.generateArrayTypeProperty(schema, terminate);
        } else {
            throw new Error('unknown type: ' + type);
        }
    }
}
