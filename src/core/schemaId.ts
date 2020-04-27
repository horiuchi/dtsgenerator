import * as url from 'url';

export default class SchemaId {
    public static empty = new SchemaId('');

    public readonly id: url.Url;
    private readonly absoluteId: string;

    constructor(public readonly inputId: string, parentIds?: string[]) {
        let absoluteId = url.resolve('', inputId);
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
        this.id = url.parse(absoluteId);
        this.absoluteId = this.id.href;
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
        return decodeURIComponent(m[1]);
    }
}

