import * as url from 'url';
import { parse } from './jsonPointer';
import { DefaultNamingStrategy } from './naming/defaultNamingStrategy';
import { NamingStrategy } from './naming/namingStrategy';
import { toTypeName } from './utils';

export class SchemaId {
    private readonly baseId: url.Url;
    private absoluteId: string;

    public static namingStrategy: NamingStrategy = new DefaultNamingStrategy();

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
        return SchemaId.namingStrategy.getTypeNames(this.baseId).map(toTypeName);
    }

    public getInterfaceName(): string {
        const names = this.getTypeNames();
        return names[names.length - 1];
    }
}
