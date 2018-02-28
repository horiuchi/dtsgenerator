import url from 'url';
import { toTypeName } from './utils';

export default class SchemaId {
    public static empty = new SchemaId('');

    private readonly baseId: url.Url;
    private readonly absoluteId: string;

    constructor(id: string, parentIds?: string[]) {
        let absoluteId = id;
        if (parentIds) {
            parentIds.forEach((parent: string) => {
                if (parent) {
                    absoluteId = url.resolve(parent, absoluteId);
                }
            });
        }
        if (absoluteId.indexOf('#') < 0) {
            absoluteId += '#';
        }
        if (absoluteId.indexOf('://') < 0 && absoluteId[0] !== '/' && absoluteId[0] !== '#') {
            absoluteId = '/' + absoluteId;
        }
        this.absoluteId = absoluteId;
        this.baseId = url.parse(absoluteId);
    }

    public getAbsoluteId(): string {
        return this.absoluteId;
    }
    public isEmpty(): boolean {
        return !!this.absoluteId;
    }
    public isFetchable(): boolean {
        return /https?\:\/\//.test(this.absoluteId);
    }
    public getFileId(): string {
        return this.absoluteId.replace(/#.*$/, '#');
    }
    public existsJsonPointerHash(): boolean {
        return this.absoluteId === '#' || /#\//.test(this.absoluteId);
    }
    public getJsonPointerHash(): string {
        const m = /(#\/.*)$/.exec(this.absoluteId);
        if (m == null) {
            return '#';
        }
        return m[1];
    }

    public getTypeNames(): string[] {
        // TODO add hook point on convert url to string[].
        const ids: string[] = [];
        if (this.baseId.host) {
            ids.push(decodeURIComponent(this.baseId.host));
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
        if (this.baseId.pathname) {
            addAllParts(this.baseId.pathname);
        }
        if (this.baseId.hash && this.baseId.hash.length > 1) {
            addAllParts(this.baseId.hash.substr(1));
        }
        return ids.map(toTypeName);
    }
    public getInterfaceName(): string {
        const names = this.getTypeNames();
        return names[names.length - 1];
    }
}

