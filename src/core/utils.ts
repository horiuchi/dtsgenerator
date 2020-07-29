import Debug from 'debug';
import ts from 'typescript';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { JsonSchemaObject } from './type';

import SimpleTypes = JsonSchemaDraft04.Schema.Definitions.SimpleTypes;

const debug = Debug('dtsgen');

export function toTSType(type: string, debugSource?: JsonSchemaObject): ts.KeywordTypeNode['kind'] | undefined {
    switch (type) {
        case 'any':
            return ts.SyntaxKind.AnyKeyword;
        case 'boolean':
            return ts.SyntaxKind.BooleanKeyword;
        case 'integer':
            return ts.SyntaxKind.NumberKeyword;
        case 'null':
            return ts.SyntaxKind.NullKeyword;
        case 'number':
            return ts.SyntaxKind.NumberKeyword;
        case 'string':
            return ts.SyntaxKind.StringKeyword;
        case 'undefined':
            return ts.SyntaxKind.UndefinedKeyword;
        case 'object':
        case 'array':
            return undefined;
        default:
            if (debugSource) {
                debug(`toTSType: unknown type: ${JSON.stringify(debugSource, null, 2)}`);
            }
            throw new Error('unknown type: ' + type);
    }
}

export function reduceTypes(types: SimpleTypes[]): SimpleTypes[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<SimpleTypes>(types);
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function mergeSchema(a: any, b: any): any {
    if ('$ref' in a || '$ref' in b) {
        return { '$ref': b['$ref'] || a['$ref'] };
    }
    Object.keys(b).forEach((key: string) => {
        const value = b[key];
        if (a[key] != null && typeof value !== typeof a[key]) {
            debug(`mergeSchema warning: type is mismatched, key=${key}`);
        }
        if (Array.isArray(value)) {
            a[key] = (a[key] || []).concat(value);
        } else if (typeof value === 'object') {
            a[key] = mergeSchema(a[key] || {}, value);
        } else {
            a[key] = value;
        }
    });
    return a;
}
