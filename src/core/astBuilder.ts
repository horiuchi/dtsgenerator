import * as ts from 'typescript';
import config from './config';
import {
    NormalizedSchema,
    NormalizedSchemaWithoutContentFalse,
} from './jsonSchema';
import SchemaId from './schemaId';
import { Schema } from './type';
import { toValidIdentifier, checkInvalidCharacter } from './validateIdentifier';

function buildTypeNameIdentifier(name: string): ts.Identifier {
    return ts.factory.createIdentifier(toValidIdentifier(name, config.target));
}
function buildPropertyNameIdentifier(name: string): ts.PropertyName {
    if (/^\d/.test(name)) {
        name = '$' + name;
    }
    if (checkInvalidCharacter(name, config.target)) {
        return ts.factory.createIdentifier(name);
    } else {
        return ts.factory.createStringLiteral(name);
    }
}

export function buildKeyword(
    kind: ts.KeywordTypeSyntaxKind
): ts.KeywordTypeNode {
    return ts.factory.createKeywordTypeNode(kind);
}
export function buildAnyKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.AnyKeyword);
}
export function buildNeverKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.NeverKeyword);
}
export function buildUnknownKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.UnknownKeyword);
}
export function buildVoidKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.VoidKeyword);
}
export function buildStringKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.StringKeyword);
}
export function buildSimpleArrayNode(element: ts.TypeNode): ts.ArrayTypeNode {
    return ts.factory.createArrayTypeNode(element);
}
export function buildNullKeyword(): ts.LiteralTypeNode {
    return ts.factory.createLiteralTypeNode(
        ts.factory.createToken(ts.SyntaxKind.NullKeyword)
    );
}
export function buildStringLiteralTypeNode(s: string): ts.LiteralTypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(s));
}
export function buildNumericLiteralTypeNode(n: string): ts.LiteralTypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(n));
}
export function buildBooleanLiteralTypeNode(b: boolean): ts.LiteralTypeNode {
    return ts.factory.createLiteralTypeNode(
        b ? ts.factory.createTrue() : ts.factory.createFalse()
    );
}

export function buildNamespaceNode(
    name: string,
    statements: ts.Statement[],
    root: boolean
): ts.ModuleDeclaration {
    const modifiers = root
        ? [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : undefined;
    return ts.factory.createModuleDeclaration(
        undefined,
        modifiers,
        buildTypeNameIdentifier(name),
        ts.factory.createModuleBlock(statements),
        ts.NodeFlags.Namespace |
            ts.NodeFlags.ExportContext |
            ts.NodeFlags.ContextFlags
    );
}

export function buildInterfaceNode(
    id: SchemaId,
    members: ts.TypeElement[],
    root: boolean
): ts.InterfaceDeclaration {
    const name = getLastTypeName(id);
    const modifiers = root
        ? [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];
    return ts.factory.createInterfaceDeclaration(
        undefined,
        modifiers,
        buildTypeNameIdentifier(name),
        undefined,
        undefined,
        members
    );
}

export function buildTypeAliasNode(
    id: SchemaId,
    type: ts.TypeNode,
    root: boolean
): ts.TypeAliasDeclaration {
    const name = getLastTypeName(id);
    const modifiers = root
        ? [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];
    return ts.factory.createTypeAliasDeclaration(
        undefined,
        modifiers,
        buildTypeNameIdentifier(name),
        undefined,
        type
    );
}

export function buildPropertySignature(
    _schema: NormalizedSchemaWithoutContentFalse,
    propertyName: string,
    valueType: ts.TypeNode,
    required: string[] | undefined,
    isPattern: boolean | undefined
): ts.PropertySignature | ts.IndexSignatureDeclaration {
    const modifiers = undefined;
    const questionToken =
        required == null || required.indexOf(propertyName) < 0
            ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
            : undefined;
    if (isPattern) {
        return ts.factory.createIndexSignature(
            undefined,
            modifiers,
            [
                ts.factory.createParameterDeclaration(
                    [],
                    [],
                    undefined,
                    ts.factory.createIdentifier('pattern'),
                    undefined,
                    ts.factory.createTypeReferenceNode('string', []),
                    undefined
                ),
            ],
            valueType
        );
    }
    return ts.factory.createPropertySignature(
        modifiers,
        buildPropertyNameIdentifier(propertyName),
        questionToken,
        valueType
    );
}

export function buildIndexSignatureNode(
    name: string,
    indexType: ts.TypeNode,
    valueType: ts.TypeNode
): ts.IndexSignatureDeclaration {
    return ts.factory.createIndexSignature(
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                buildTypeNameIdentifier(name),
                undefined,
                indexType,
                undefined
            ),
        ],
        valueType
    );
}

export function buildTypeLiteralNode(elements: ts.TypeElement[]): ts.TypeNode {
    return ts.factory.createTypeLiteralNode(elements);
}

export function buildFreeFormObjectTypeLiteralNode(): ts.TypeNode {
    return ts.factory.createTypeLiteralNode([
        buildIndexSignatureNode('key', buildStringKeyword(), buildAnyKeyword()),
    ]);
}

export function buildUnionTypeNode<T>(
    types: T[],
    builder: (t: T, index: number) => ts.TypeNode,
    terminate: boolean
): ts.TypeNode {
    const node = ts.factory.createUnionTypeNode(types.map(builder));
    if (terminate) {
        return node;
    }
    return ts.factory.createParenthesizedType(node);
}

export function buildTupleTypeNode(
    types: ts.TypeNode | ts.TypeNode[],
    minItems?: number,
    maxItems?: number,
    additionalItems?: ts.TypeNode | false
): ts.TypeNode {
    function typesIsArray<T>(types: T | T[]): types is T[] {
        return Array.isArray(types);
    }
    const typesLength = typesIsArray(types) ? types.length : 1;

    const nodes: ts.TypeNode[] = [];
    if (additionalItems === false && (minItems ?? 0) > typesLength) {
        return buildNeverKeyword();
    }
    const itemCount =
        maxItems != null
            ? additionalItems === false
                ? typesLength
                : maxItems
            : Math.max(typesLength, minItems ?? 0);
    for (let i = 0; i < itemCount; i++) {
        let node = typesIsArray(types)
            ? i < types.length
                ? types[i]
                : additionalItems !== undefined
                ? additionalItems === false
                    ? buildNeverKeyword()
                    : additionalItems
                : buildAnyKeyword()
            : types;
        if (minItems == null || i >= minItems) {
            node = ts.factory.createOptionalTypeNode(node);
        }
        nodes.push(node);
    }
    if (
        maxItems == null &&
        (!typesIsArray(types) || additionalItems !== false)
    ) {
        nodes.push(
            ts.factory.createRestTypeNode(
                ts.factory.createArrayTypeNode(
                    typesIsArray(types)
                        ? additionalItems !== undefined
                            ? (additionalItems as ts.TypeNode)
                            : buildAnyKeyword()
                        : types
                )
            )
        );
    }
    return ts.factory.createTupleTypeNode(nodes);
}

export function buildTypeReferenceNode(
    schema: NormalizedSchema,
    currentSchema: Schema
): ts.TypeReferenceNode {
    const typeName = getTypename(schema.id, currentSchema);
    if (typeName.length === 0) {
        throw new Error('TypeName array must not be empty.');
    }
    let node: ts.EntityName = buildTypeNameIdentifier(typeName[0]);
    for (let i = 1; i < typeName.length; i++) {
        node = ts.factory.createQualifiedName(
            node,
            buildTypeNameIdentifier(typeName[i])
        );
    }
    return ts.factory.createTypeReferenceNode(node, undefined);
}
function getTypename(id: SchemaId, baseSchema: Schema): string[] {
    const result = id.toNames();
    const baseId = baseSchema.id;
    if (baseId) {
        const baseTypes = baseId.toNames().slice(0, -1);
        for (const type of baseTypes) {
            if (result.length === 1) {
                break;
            }
            if (result[0] === type) {
                result.shift();
            } else {
                break;
            }
        }
    }
    return result;
}

export function addComment<T extends ts.Node>(
    node: T,
    schema: NormalizedSchema,
    terminate: boolean
): T {
    const comments =
        schema.content === false
            ? []
            : getComment(schema as NormalizedSchemaWithoutContentFalse);
    if (comments.length === 0) {
        return node;
    } else if (!terminate && comments.length === 1) {
        return ts.addSyntheticLeadingComment(
            node,
            ts.SyntaxKind.MultiLineCommentTrivia,
            ` ${comments[0]} `,
            false
        );
    } else {
        let result = '*\n';
        for (const comment of comments) {
            result += ' * ' + comment + '\n';
        }
        result += ' ';
        return ts.addSyntheticLeadingComment(
            node,
            ts.SyntaxKind.MultiLineCommentTrivia,
            result,
            true
        );
    }
}

function getComment(schema: NormalizedSchemaWithoutContentFalse): string[] {
    const content = schema.content;
    let comments: string[] = [];
    function protectComment(str: string): string {
        return str.replace(/\*\//g, '*\u200B/'); // Unicode [ZERO WIDTH SPACE]
    }
    function appendComment(value?: string): void {
        if (value == null) {
            return;
        }
        const s =
            typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        const lines = s.split('\n').map((line: string) => protectComment(line));
        comments = comments.concat(...lines);
    }

    if ('$comment' in content) {
        appendComment(content.$comment);
    }
    appendComment(content.title);
    appendComment(content.description);
    if ('example' in content || 'examples' in content) {
        appendComment('example:');
        if ('example' in content) {
            appendComment(content.example);
        }
        if ('examples' in content) {
            if (content.examples) {
                for (const e of content.examples) {
                    appendComment(e);
                }
            }
        }
    }
    return comments;
}

export function addOptionalInformation<T extends ts.Node>(
    node: T,
    schema: NormalizedSchema,
    terminate: boolean
): T {
    const comment = (function () {
        if (schema.content === false) {
            return 'false';
        } else if (schema.content.format) {
            return `${schema.content.format}`;
        } else if (schema.content.pattern) {
            return `${schema.content.pattern}`;
        }
        return undefined;
    })();

    if (comment === undefined) {
        return node;
    }

    const kind = terminate
        ? ts.SyntaxKind.SingleLineCommentTrivia
        : ts.SyntaxKind.MultiLineCommentTrivia;
    return ts.addSyntheticTrailingComment(
        node,
        kind,
        ` ${comment}${terminate ? '' : ' '}`,
        false
    );
}

function getLastTypeName(id: SchemaId): string {
    const names = id.toNames();
    if (names.length > 0) {
        return names[names.length - 1];
    } else {
        return '';
    }
}
