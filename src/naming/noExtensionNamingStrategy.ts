import * as url from 'url';
import { DefaultNamingStrategy } from './defaultNamingStrategy';

export class NoExtensionNamingStrategy {
    private readonly defaultStrategy = new DefaultNamingStrategy();

    public getTypeNames(id: url.Url): string[] {
        let pathWithoutExtension = id.pathname;
        if (pathWithoutExtension) {
            pathWithoutExtension = pathWithoutExtension.replace(/\.[^/]+$/, '');
        }
        return this.defaultStrategy.getTypeNames({
          ...id,
          path: pathWithoutExtension,
          pathname: pathWithoutExtension,
        });
    }
}
