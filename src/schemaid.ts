import * as url from 'url';
import { parse } from './jsonPointer';

export class SchemaId {
    private baseId: url.Url;
    private absoluteId: string;

    constructor(id: string, parentIds: string[]) {
        this.baseId = url.parse(id);
        this.absoluteId = id;
        parentIds.forEach((parent: string) => {
            this.absoluteId = url.resolve(parent, this.absoluteId);
        });
    }

    public getAbsoluteId(): string {
        return this.absoluteId;
    }
    public isFetchable(): boolean {
        return /https?\:\/\//.test(this.absoluteId);
    }
    public getFileId(): string {
        return this.absoluteId.replace(/#.*$/, '');
    }
    public isJsonPointerHash(): boolean {
        return /#\//.test(this.absoluteId);
    }
    public getJsonPointerHash(): string[] {
        const m = /#(\/.*)$/.exec(this.absoluteId);
        if (m == null) {
            return [];
        }
        return parse(m[1]);
    }

    public getTypeNames(): string[] {
        console.error(JSON.stringify(this.baseId));
        const ids: string[] = [];
        if (this.baseId.host) {
            ids.push(decodeURIComponent(this.baseId.host));
        }
        if (this.baseId.pathname) {
            this.baseId.pathname.split('/').splice(1).forEach((path: string) => {
                ids.push(decodeURIComponent(path));
            });
        }
        if (this.baseId.hash && this.baseId.hash.length > 1) {
            let hashs = this.baseId.hash.substr(1).split('/');
            if (hashs.length > 1 && hashs[0] === '') {
                hashs.shift();
            }
            hashs.forEach((hash: string) => {
                ids.push(decodeURIComponent(hash));
            });
        }
        return ids;
    }
    public getInterfaceName(): string {
        const names = this.getTypeNames();
        return names[names.length - 1];
    }
}

