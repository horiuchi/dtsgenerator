import ts from 'typescript';

export interface Config {
    input: {
        files: string[];
        urls: string[];
        stdin: boolean;
    };
    outputFile?: string;
    target: ts.ScriptTarget;
    outputAST: boolean;

    plugins: {
        [pluginName: string]: object | boolean;
    };
}

const defaultConfig: Config = {
    input: {
        files: [],
        urls: [],
        stdin: false,
    },
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
