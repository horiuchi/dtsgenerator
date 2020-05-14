import ts from 'typescript';

export interface Config {
    outputAST: boolean;
    target: ts.ScriptTarget;

    plugins: {
        [pluginName: string]: object | boolean;
    };
}

const defaultConfig: Config = {
    outputAST: false,
    target: ts.ScriptTarget.Latest,
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
