import * as url from 'url';

export class DefaultNamingStrategy {
    public getTypeNames(id: url.Url): string[] {
        const ids: string[] = [];
        if (id.host) {
            ids.push(decodeURIComponent(id.host));
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
        if (id.pathname) {
            addAllParts(id.pathname);
        }
        if (id.hash && id.hash.length > 1) {
            addAllParts(id.hash.substr(1));
        }
        return ids;
    }
}
