import { toTypeName } from './validateIdentifier';

function resolveUrl(base: string, relative: string): string {
    if (!base) {
        return relative;
    }

    try {
        return new URL(relative, base).href;
    } catch {
        return relative;
    }
}

function parseId(absoluteId: string): URL {
    try {
        return new URL(absoluteId);
    } catch {
        return new URL(absoluteId, 'file://');
    }
}

export default class SchemaId {
    private readonly absoluteId: string;
    public readonly id: URL;
    public static readonly empty = new SchemaId('');

    constructor(
        public readonly inputId: string,
        parentIds?: string[],
    ) {
        let absoluteId = resolveUrl('', inputId);
        if (parentIds) {
            parentIds.forEach((parent: string) => {
                if (parent) {
                    absoluteId = resolveUrl(parent, absoluteId);
                }
            });
        }
        if (!absoluteId.includes('#')) {
            absoluteId += '#';
        }
        if (
            !absoluteId.includes('://') &&
            !absoluteId.startsWith('/') &&
            !absoluteId.startsWith('#')
        ) {
            absoluteId = '/' + absoluteId;
        }
        this.absoluteId = absoluteId;
        this.id = parseId(absoluteId);
    }

    public getAbsoluteId(): string {
        return this.absoluteId;
    }
    public isEmpty(): boolean {
        return !!this.absoluteId;
    }
    public isFetchable(): boolean {
        return /https?:\/\//.test(this.absoluteId);
    }
    public getFileId(): string {
        return this.absoluteId.replace(/#.*$/, '#');
    }
    public existsJsonPointerHash(): boolean {
        return this.absoluteId === '#' || this.absoluteId.includes('#/');
    }
    public getJsonPointerHash(): string {
        const m = /(#\/.*)$/.exec(this.absoluteId);
        if (m?.[1] == null) {
            return '#';
        }
        return decodeURIComponent(m[1]);
    }

    public toNames(): string[] {
        const uri = this.id;
        const ids: string[] = [];
        if (uri.host) {
            ids.push(decodeURIComponent(uri.host));
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
        if (uri.pathname) {
            addAllParts(uri.pathname);
        }
        if (uri.hash && uri.hash.length > 1) {
            addAllParts(uri.hash.substr(1));
        }
        return ids.map(toTypeName);
    }
}
