/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Debug from 'debug';
import ts from 'typescript';
import { OpenApiSchema } from './jsonSchema';
import { JsonSchemaDraft04 } from './jsonSchemaDraft04';
import { $Ref, JsonSchemaObject } from './type';

import SimpleTypes = JsonSchemaDraft04.Schema.Definitions.SimpleTypes;

const debug = Debug('dtsgen');

export function toTSType(
    type: string,
    debugSource?: JsonSchemaObject
): ts.KeywordSyntaxKind | undefined {
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
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}

export function mergeSchema(
    firstSchema: Partial<OpenApiSchema> | Partial<$Ref>,
    secondSchema: Partial<OpenApiSchema> | Partial<$Ref>
): Partial<OpenApiSchema> | $Ref {
    if (typeof firstSchema !== 'object' || typeof secondSchema !== 'object') {
        throw new Error(
            `invalid parameter passed to mergeSchema, expected both parameters to be of type object but received ${typeof firstSchema}, ${typeof secondSchema}.`
        );
    }
    if (Reflect.has(secondSchema, '$ref') || Reflect.has(firstSchema, '$ref')) {
        return {
            $ref: (secondSchema as $Ref).$ref ?? (firstSchema as $Ref).$ref,
        };
    }
    Object.entries(secondSchema).forEach(([key, value]) => {
        const firstSchemaValue = (firstSchema as OpenApiSchema)[
            key as keyof OpenApiSchema
        ];
        if (!!firstSchemaValue && typeof value !== typeof firstSchemaValue) {
            debug(`mergeSchema warning: type mismatched, key=${key}`);
        }
        if (Array.isArray(value)) {
            Object.assign(firstSchema, {
                [key]: Array.isArray(firstSchemaValue)
                    ? [...firstSchemaValue, ...value]
                    : value,
            });
        } else if (typeof value === 'object') {
            Object.assign(firstSchema, {
                [key]: mergeSchema(
                    (firstSchemaValue ?? {}) as Partial<OpenApiSchema>,
                    value
                ),
            });
        } else {
            Object.assign(firstSchema, { [key]: value });
        }
    });
    return firstSchema as OpenApiSchema;
}
