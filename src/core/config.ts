import ts from 'typescript';
import { Plugin, loadPlugin } from './type';

export interface Config {
    configFile?: string;
    input: {
        files: string[];
        urls: string[];
        stdin: boolean;
    };
    outputFile?: string;
    target: ts.ScriptTarget;
    outputAST: boolean;

    plugins: {
        [pluginName: string]: boolean | Record<string, unknown>;
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

export async function showConfig(version: string, c: Config): Promise<void> {
    console.log('Version: ' + version);
    console.log('ConfigFile: ' + c.configFile);
    console.log();

    console.log('Config:');
    console.log('  input:');
    if (c.input.files.length > 0) {
        console.log('    files: ' + JSON.stringify(c.input.files));
    }
    if (c.input.urls.length > 0) {
        console.log('    urls: ' + JSON.stringify(c.input.urls));
    }
    if (c.input.stdin) {
        console.log('    stdin: true');
    }
    if (c.outputFile != null) {
        console.log('  outputFile: ' + JSON.stringify(c.outputFile));
    }
    console.log('  target: ' + showScriptTarget(c.target));
    if (c.outputAST) {
        console.log('  outputAST: true');
    }
    console.log('  plugins:')
    for (const [name, option] of Object.entries(c.plugins)) {
        console.log(`    ${name}: ${JSON.stringify(option)}`);
    }
    console.log();

    const plugins: Plugin[] = [];
    for (const [name, option] of Object.entries(c.plugins)) {
        const p = await loadPlugin(name, option);
        if (p != null) {
            plugins.push(p);
        }
    }
    console.log('Plugins: count=' + plugins.length);
    for (const p of plugins) {
        console.log(`  ${p.meta.name}@${p.meta.version}: ${p.meta.description}`);
    }
    console.log();
}
function showScriptTarget(target: ts.ScriptTarget): string {
    switch (target) {
        case ts.ScriptTarget.ES3: return 'ES3';
        case ts.ScriptTarget.ES5: return 'ES5';
        case ts.ScriptTarget.ES2015: return 'ES2015';
        case ts.ScriptTarget.ES2016: return 'ES2016';
        case ts.ScriptTarget.ES2017: return 'ES2017';
        case ts.ScriptTarget.ES2018: return 'ES2018';
        case ts.ScriptTarget.ES2019: return 'ES2019';
        case ts.ScriptTarget.ES2020: return 'ES2020';
        case ts.ScriptTarget.ESNext: return 'ESNext';
        default: return 'Latest';
    }
}

export default config;
