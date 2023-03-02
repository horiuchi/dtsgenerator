/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Debug from 'debug';
import * as ts from 'typescript';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { JsonSchemaObject } from './type';

import SimpleTypes = JsonSchemaDraft04.Schema.Definitions.SimpleTypes;

const debug = Debug('dtsgen');

export function toTSType(
    type: string,
    debugSource?: JsonSchemaObject
): ts.KeywordTypeSyntaxKind | ts.SyntaxKind.NullKeyword | undefined {
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
        case 'file': // 'file' is a valid type only in OpenAPI v2.
            return ts.SyntaxKind.UnknownKeyword;
        default:
            if (debugSource) {
                debug(
                    `toTSType: unknown type: ${JSON.stringify(
                        debugSource,
                        null,
                        2
                    )}`
                );
            }
            throw new Error('unknown type: ' + type);
    }
}

export function reduceTypes(types: SimpleTypes[]): SimpleTypes[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<SimpleTypes>(types);
    return Array.from(set.values());
}

export function checkValidMIMEType(mime: string): boolean {
    const type = mime.toLowerCase().split(';')[0]?.trim();
    if (type == null) {
        return false;
    }
    if (
        [
            'application/octet-stream',
            'application/x-www-form-urlencoded',
            'multipart/form-data',

            'application/jwt',
            'application/vnd.apple.pkpass',
        ].includes(type)
    ) {
        return true;
    }
    if (type.startsWith('text/') || type.startsWith('image/')) {
        return true;
    }
    return /^application\/(?:[a-z0-9-_.]+\+)?json5?$/.test(type);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mergeSchema(a: any, b: any): boolean {
    if ('$ref' in a || '$ref' in b) {
        a.$ref = b.$ref || a.$ref;
        return false;
    }
    Object.keys(b as object).forEach((key: string) => {
        const value = b[key];
        if (a[key] != null && typeof value !== typeof a[key]) {
            debug(`mergeSchema warning: type is mismatched, key=${key}`);
        }
        if (Array.isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            a[key] = (a[key] ?? []).concat(value);
        } else if (value != null && typeof value === 'object') {
            a[key] ??= {};
            mergeSchema(a[key], value);
        } else {
            a[key] = value;
        }
    });
    return true;
}
