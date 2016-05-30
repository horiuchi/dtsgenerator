import * as url from 'url';
import { parse } from './jsonPointer';
import { capitalizeName } from './utils';
import * as Debug from 'debug';
const debug = Debug('dtsgen');

export class SchemaId {
    private baseId: url.Url;
    private absoluteId: string;

    constructor(id: string, parentIds?: string[]) {
        // debug(`SchemaId: ${id}, ${parentIds}`);
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
        // ids[ids.length - 1] = capitalizeName(ids[ids.length - 1]);
        return ids;
    }
    public getInterfaceName(): string {
        const names = this.getTypeNames();
        // debug(`getInterfaceName: ${JSON.stringify(names)}`);
        return names[names.length - 1];
    }
}
