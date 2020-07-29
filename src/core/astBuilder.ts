import * as ts from 'typescript';
import config from './config';
import { NormalizedSchema } from './jsonSchema';
import SchemaId from './schemaId';
import { toValidIdentifier, checkInvalidCharacter } from './validateIdentifier';
import { Schema } from './type';

function buildTypeNameIdentifier(name: string): ts.Identifier {
    return ts.createIdentifier(toValidIdentifier(name, config.target));
}
function buildPropertyNameIdentifier(name: string): ts.PropertyName {
    if (/^\d/.test(name)) {
        name = '$' + name;
    }
    if (checkInvalidCharacter(name, config.target)) {
        return ts.createIdentifier(name);
    } else {
        return ts.createStringLiteral(name);
    }
}

export function buildKeyword(
    kind: ts.KeywordTypeNode['kind']
): ts.KeywordTypeNode {
    return ts.createKeywordTypeNode(kind);
}
export function buildAnyKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.AnyKeyword);
}
export function buildNeverKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.NeverKeyword);
}
export function buildStringKeyword(): ts.KeywordTypeNode {
    return buildKeyword(ts.SyntaxKind.StringKeyword);
}
export function buildSimpleArrayNode(element: ts.TypeNode): ts.ArrayTypeNode {
    return ts.createArrayTypeNode(element);
}

// TODO
export function buildStringLiteralTypeNode(s: string): ts.LiteralTypeNode {
    return ts.createLiteralTypeNode(ts.createStringLiteral(s));
}
export function buildNumericLiteralTypeNode(n: string): ts.LiteralTypeNode {
    return ts.createLiteralTypeNode(ts.createNumericLiteral(n));
}
export function buildBooleanLiteralTypeNode(b: boolean): ts.LiteralTypeNode {
    return ts.createLiteralTypeNode(b ? ts.createTrue() : ts.createFalse());
}

export function buildNamespaceNode(
    name: string,
    statements: ts.Statement[],
    root: boolean
): ts.ModuleDeclaration {
    const modifiers = root
        ? [ts.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : undefined;
    return ts.createModuleDeclaration(
        undefined,
        modifiers,
        buildTypeNameIdentifier(name),
        ts.createModuleBlock(statements),
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
        ? [ts.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : [ts.createModifier(ts.SyntaxKind.ExportKeyword)];
    return ts.createInterfaceDeclaration(
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
        ? [ts.createModifier(ts.SyntaxKind.DeclareKeyword)]
        : [ts.createModifier(ts.SyntaxKind.ExportKeyword)];
    return ts.createTypeAliasDeclaration(
        undefined,
        modifiers,
        buildTypeNameIdentifier(name),
        undefined,
        type
    );
}

export function buildPropertySignature(
    schema: NormalizedSchema,
    propertyName: string,
    valueType: ts.TypeNode,
    required: string[] | undefined,
    isPattern: boolean | undefined
): ts.PropertySignature | ts.IndexSignatureDeclaration {
    const content = schema.content;
    const modifiers =
        'readOnly' in content && content.readOnly
            ? [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)]
            : undefined;
    const questionToken =
        required == null || required.indexOf(propertyName) < 0
            ? ts.createToken(ts.SyntaxKind.QuestionToken)
            : undefined;
    if (isPattern) {
        return ts.createIndexSignature(
            undefined,
            modifiers,
            [
                ts.createParameter(
                    [],
                    [],
                    undefined,
                    ts.createIdentifier('pattern'),
                    undefined,
                    ts.createTypeReferenceNode('string', []),
                    undefined
                ),
            ],
            valueType
        );
    }
    return ts.createPropertySignature(
        modifiers,
        buildPropertyNameIdentifier(propertyName),
        questionToken,
        valueType,
        undefined
    );
}

export function buildIndexSignatureNode(
    name: string,
    indexType: ts.TypeNode,
    valueType: ts.TypeNode
): ts.IndexSignatureDeclaration {
    return ts.createIndexSignature(
        undefined,
        undefined,
        [
            ts.createParameter(
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
    return ts.createTypeLiteralNode(elements);
}

export function buildUnionTypeNode<T>(
    types: T[],
    builder: (t: T, index: number) => ts.TypeNode,
    terminate: boolean
): ts.TypeNode {
    const node = ts.createUnionTypeNode(types.map(builder));
    if (terminate) {
        return node;
    }
    return ts.createParenthesizedType(node);
}

export function buildTupleTypeNode(
    types: ts.TypeNode[],
    minItems?: number,
    maxItems?: number
): ts.TypeNode {
    const nodes: ts.TypeNode[] = [];
    const itemCount =
        maxItems != null ? maxItems : Math.max(types.length, minItems || 0);
    for (let i = 0; i < itemCount; i++) {
        let node = i < types.length ? types[i] : buildAnyKeyword();
        if (minItems == null || i >= minItems) {
            node = ts.createOptionalTypeNode(node);
        }
        nodes.push(node);
    }
    if (maxItems == null) {
        nodes.push(
            ts.createRestTypeNode(ts.createArrayTypeNode(buildAnyKeyword()))
        );
    }
    return ts.createTupleTypeNode(nodes);
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
        node = ts.createQualifiedName(
            node,
            buildTypeNameIdentifier(typeName[i])
        );
    }
    return ts.createTypeReferenceNode(node, undefined);
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
    const comments = getComment(schema);
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

function getComment(schema: NormalizedSchema): string[] {
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
    const format = schema.content.format;
    const pattern = schema.content.pattern;
    if (!format && !pattern) {
        return node;
    }

    let comment = '';
    if (format) {
        comment += ' ' + format;
    }
    if (pattern) {
        comment += ' ' + pattern;
    }

    if (!terminate) {
        comment += ' ';
    }
    const kind = terminate
        ? ts.SyntaxKind.SingleLineCommentTrivia
        : ts.SyntaxKind.MultiLineCommentTrivia;
    return ts.addSyntheticTrailingComment(node, kind, comment, false);
}

function getLastTypeName(id: SchemaId): string {
    const names = id.toNames();
    if (names.length > 0) {
        return names[names.length - 1];
    } else {
        return '';
    }
}
