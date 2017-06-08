import * as Debug from 'debug';
import * as YAML from 'js-yaml';
import * as path from 'path';
import opts from './commandOptions';

const debug = Debug('dtsgen');

export function toTSType(type: string, debugSource?: any): string {
    switch (type) {
        case 'integer':
            return 'number';
        case 'any':
        case 'null':
        case 'undefined':
        case 'string':
        case 'number':
        case 'boolean':
            return type;
        case 'object':
        case 'array':
            return null;
        default:
            if (debugSource) {
                debug(`toTSType: unknown type: ${JSON.stringify(debugSource, null, 2)}`);
            }
            throw new Error('unknown type: ' + type);
    }
}

export function reduceTypes(types: JsonSchemaOrg.Schema.Definitions.SimpleTypes[]): JsonSchemaOrg.Schema.Definitions.SimpleTypes[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<JsonSchemaOrg.Schema.Definitions.SimpleTypes>(types);
    if (opts.target === 'v1') {
        set.delete('null');
    }
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}

export function toTypeName(str: string): string {
    if (!str) {
        return str;
    }
    str = str.trim();
    return str.split('$').map((s) => s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, (_, m) => {
        return m.toUpperCase();
    })).join('$');
}

export function mergeSchema(a: any, b: any): any {
    Object.keys(b).forEach((key: string) => {
        const value = b[key];
        if (a[key] != null && typeof value !== typeof a[key]) {
            debug(`mergeSchema warning: type is missmatched, key=${key}`);
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

export function parseFileContent(content: string, filename?: string): JsonSchemaOrg.Schema {
    const ext = filename ? path.extname(filename).toLowerCase() : '';
    const maybeYaml = ext === '.yaml' || ext === '.yml';
    try {
        if (maybeYaml) {
            return YAML.safeLoad(content);
        } else {
            return JSON.parse(content);
        }
    } catch (e) {
        if (maybeYaml) {
            return JSON.parse(content);
        } else {
            return YAML.safeLoad(content);
        }
    }
}

