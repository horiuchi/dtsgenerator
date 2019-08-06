import SchemaId from './schemaId';

export type TypeNameConvertor = (id: SchemaId) => string[];

export const DefaultTypeNameConvertor: TypeNameConvertor = (id: SchemaId): string[] => {
    const url = id.id;
    const ids: string[] = [];
    if (url.host) {
        ids.push(decodeURIComponent(url.host));
    }
    const addAllParts = (path: string): void => {
        const paths = path.split('/');
        if (paths.length > 1 && paths[0] === '') {
            paths.shift();
        }
        paths.forEach((item: string) => {
            ids.push(decodeURIComponent(item));
        });
    };
    if (url.pathname) {
        addAllParts(url.pathname);
    }
    if (url.hash && url.hash.length > 1) {
        addAllParts(url.hash.substr(1));
    }
    return ids.map(toTypeName);
};

function toTypeName(str: string): string {
    if (!str) {
        return str;
    }
    const result = str.trim().split('$').map((s) => s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9]|$)/g, (_, m) => {
        return m.toUpperCase();
    })).join('$');
    return result;
}

export function normalizeTypeName(type: string): string {
    type = type.replace(/^\//, '').replace(/[^0-9A-Za-z_$]+/g, '_');
    if (/^\d/.test(type)) {
        type = '$' + type;
    }
    return type;
}
