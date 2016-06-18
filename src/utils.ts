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

export function reduceTypes(types: json_schema_org.SimpleTypes[]): json_schema_org.SimpleTypes[] {
    if (types.length < 2) {
        return types;
    }
    const set = new Set<json_schema_org.SimpleTypes>(types);
    set.delete('null');
    if (set.delete('integer')) {
        set.add('number');
    }
    return Array.from(set.values());
}

export function toTypeName(str: string): string {
    if (!str) return str;
    str = str.trim().replace(/[^\w]+(\w)/g, s => s.toUpperCase()).replace(/[^0-9A-Za-z_$]/g, '');
    return str.split('$').map(s => s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
        return m.toUpperCase();
    })).join('$');
}

