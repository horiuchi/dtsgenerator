import ts from 'typescript';
import { DefaultTypeNameConvertor, TypeNameConvertor } from './typeNameConvertor';

export interface Config {
    outputAST: boolean;
    target: ts.ScriptTarget;
    typeNameConvertor: TypeNameConvertor;

    plugins: {
        [pluginName: string]: object | boolean;
    };
}

const defaultConfig: Config = {
    outputAST: false,
    target: ts.ScriptTarget.Latest,
    typeNameConvertor: DefaultTypeNameConvertor,
    plugins: {},
};

let config: Config = Object.assign({}, defaultConfig);

export function setConfig(input: Partial<Config>): void {
    config = Object.assign(config, input);
}

export function clearToDefault(): void {
    setConfig(defaultConfig);
}

export default config;
