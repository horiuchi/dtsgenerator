import Debug from 'debug';
import * as ts from 'typescript';
import SimpleTypes = JsonSchemaOrg.Draft04.Schema.Definitions.SimpleTypes;

const debug = Debug('dtsgen');

export function toTSType(type: string, debugSource?: any) {
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

export function mergeSchema(a: any, b: any): any {
    Object.keys(b).forEach((key: string) => {
        const value = b[key];
        if (a[key] != null && typeof value !== typeof a[key]) {
            debug(`mergeSchema warning: type is mismatched, key=${key}`);
        }
        if (Array.isArray(value)) {
            a[key] = (a[key] || []).concat(value);
        } else if (typeof value === 'object') {
            a[key] = Object.assign(a[key] || {}, value);
        } else {
            a[key] = value;
        }
    });
    return a;
}
