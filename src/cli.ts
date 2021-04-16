import * as fs from 'fs';
import { dirname } from 'path';
import { ScriptTarget } from 'typescript';
import opts, {
    initialize,
    CommandOptions,
    defaultConfigFile,
} from './commandOptions';
import dtsgenerator, {
    Schema,
    readSchemaFromStdin,
    readSchemasFromFile,
    readSchemaFromUrl,
} from './core';
import config, { Config, setConfig, showConfig } from './core/config';

function readConfig(options: CommandOptions): Partial<Config> {
    let pc: Partial<Config> = {};
    const configFile = options.configFile ?? defaultConfigFile;
    try {
        pc = loadJSON(configFile);
        pc.configFile = configFile;
    } catch (err) {
        if (options.configFile != null) {
            console.error(
                'Error to load config file from ' + options.configFile
            );
        }
    }

    if (pc.input == null) {
        pc.input = {
            files: [],
            urls: [],
            stdin: false,
        };
    }
    if (options.files.length > 0) {
        pc.input.files = options.files;
    } else if (pc.input.files == null) {
        pc.input.files = [];
    }
    if (options.urls.length > 0) {
        pc.input.urls = options.urls;
    } else if (pc.input.urls == null) {
        pc.input.urls = [];
    }
    pc.input.stdin = options.isReadFromStdin();

    if (options.out != null) {
        pc.outputFile = options.out;
    }
    if (options.target != null) {
        pc.target = convertToScriptTarget(options.target);
    }
    pc.outputAST = !!options.outputAST;
    return pc;
}
function loadJSON(file: string): Partial<Config> {
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content) as Partial<Config>;
}
function convertToScriptTarget(target: string): ScriptTarget {
    switch (target.trim().toLowerCase()) {
        case 'es3':
            return ScriptTarget.ES3;
        case 'es5':
            return ScriptTarget.ES5;
        case 'es2015':
            return ScriptTarget.ES2015;
        case 'es2016':
            return ScriptTarget.ES2016;
        case 'es2017':
            return ScriptTarget.ES2017;
        case 'es2018':
            return ScriptTarget.ES2018;
        case 'es2019':
            return ScriptTarget.ES2019;
        case 'es2020':
            return ScriptTarget.ES2020;
        case 'esnext':
            return ScriptTarget.ESNext;
        default:
            return ScriptTarget.Latest;
    }
}

async function loadContents(): Promise<Schema[]> {
    let contents: Schema[] = [];
    const ps: Promise<void>[] = [];
    if (config.input.stdin) {
        ps.push(
            readSchemaFromStdin().then((s) => {
                contents.push(s);
            })
        );
    }
    for (const pattern of config.input.files) {
        ps.push(
            readSchemasFromFile(pattern).then((ss) => {
                contents = contents.concat(ss);
            })
        );
    }
    for (const url of config.input.urls) {
        ps.push(
            readSchemaFromUrl(url).then((s) => {
                contents.push(s);
            })
        );
    }
    await Promise.all(ps);
    return contents;
}

async function exec(): Promise<void> {
    const command = initialize(process.argv);
    const pc = readConfig(opts);
    setConfig(pc);

    if (opts.info) {
        const version = command.opts().version as string;
        await showConfig(version, config);
        return;
    }

    const contents = await loadContents();
    const result = await dtsgenerator({
        contents,
    });
    if (opts.out) {
        fs.mkdirSync(dirname(opts.out), { recursive: true });
        fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
    } else {
        console.log(result);
    }
}
exec().catch((err: Error) => {
    console.error(err.stack ?? err);
});
