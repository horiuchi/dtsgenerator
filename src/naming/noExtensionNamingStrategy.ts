import * as url from 'url';
import { DefaultNamingStrategy } from './defaultNamingStrategy';

export class NoExtensionNamingStrategy {
    private readonly defaultStrategy = new DefaultNamingStrategy();

    public getTypeNames(id: url.Url): string[] {
        return this.defaultStrategy.getTypeNames(id).map((name, i) => {
          const isHostPart = i === 0;
          return isHostPart ? name : name.split('.')[0];
        });
    }
}
