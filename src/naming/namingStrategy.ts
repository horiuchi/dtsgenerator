import * as url from 'url';

export interface NamingStrategy {
    getTypeNames(id: url.Url): string[];
}
