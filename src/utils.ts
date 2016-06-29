export function toTSType(type: string, debugSource?: any): string {
    switch (type) {
        case 'integer':
            return 'number';
        case 'any':
        case 'null':
        case 'string':
        case 'number':
        case 'boolean':
            return type;
        case 'object':
        case 'array':
            return null;
        default:
            if (debugSource) {
                console.error('  debugSource=' + debugSource);
            }
            throw new Error('unknown type: ' + type);
    }
}

export function reduceTypes(types: JsonSchemaOrg.Schema.Definitions.SimpleTypes[]): JsonSchemaOrg.Schema.Definitions.SimpleTypes[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<JsonSchemaOrg.Schema.Definitions.SimpleTypes>(types);
    set.delete('null');
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}

export function toTypeName(str: string): string {
    if (!str) return str;
    str = str.trim();
    return str.split('$').map(s => s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
        return m.toUpperCase();
    })).join('$');
}

