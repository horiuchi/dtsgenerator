import * as url from 'url';
import { parse } from './jsonPointer';
import { toTypeName } from './utils';

export class SchemaId {
    private readonly baseId: url.Url;
    private absoluteId: string;

    constructor(id: string, parentIds?: string[]) {
        this.absoluteId = id;
        if (parentIds) {
            parentIds.forEach((parent: string) => {
                if (parent) {
                    this.absoluteId = url.resolve(parent, this.absoluteId);
                }
            });
        }
        if (this.absoluteId.indexOf('#') < 0) {
            this.absoluteId += '#';
        }
        if (this.absoluteId.indexOf('://') < 0 && this.absoluteId[0] !== '/' && this.absoluteId[0] !== '#') {
            this.absoluteId = '/' + this.absoluteId;
        }
        this.baseId = url.parse(this.absoluteId);
    }

    public getAbsoluteId(): string {
        return this.absoluteId;
    }
    public isFetchable(): boolean {
        return /https?\:\/\//.test(this.absoluteId);
    }
    public getFileId(): string {
        return this.absoluteId.replace(/#.*$/, '#');
    }
    public isJsonPointerHash(): boolean {
        return this.absoluteId === '#' || /#\//.test(this.absoluteId);
    }
    public getJsonPointerHash(): string[] {
        const m = /#(\/.*)$/.exec(this.absoluteId);
        if (m == null) {
            return [];
        }
        return parse(m[1]);
    }

    public getTypeNames(): string[] {
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

