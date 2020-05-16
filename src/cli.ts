import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import opts, { initialize, CommandOptions } from './commandOptions';
import dtsgenerator, { Schema, readSchemaFromStdin, readSchemasFromFile, readSchemaFromUrl, loadPlugin } from './core';
import config, { Config, setConfig } from './core/config';
import { Plugin } from './core/type';
import ts from 'typescript';
import commander from 'commander';

function readConfig(options: CommandOptions): Partial<Config> {
    let pc: Partial<Config> = {};
    if (options.configFile != null) {
        try {
            pc = require(options.configFile);
        } catch (err) {
            // tslint:disable-next-line: no-console
            console.error('Error to load config file from ' + options.configFile);
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

async function showInfo(command: commander.Command, configFile?: string): Promise<void> {
    const version = command.opts().version;

    // tslint:disable: no-console
    console.log('Version: ' + version);
    console.log('ConfigFile: ' + configFile);
    console.log();
    console.log('Config: ' + JSON.stringify(config, null, 2));
    console.log();

    const plugins: Plugin[] = [];
    for (const [name, option] of Object.entries(config.plugins)) {
        const p = await loadPlugin(name, option);
        if (p != null) {
            plugins.push(p);
        }
    }
    console.log('Plugins count=' + plugins.length);
    for (const p of plugins) {
        console.log(`  ${p.meta.name}@${p.meta.version}: ${p.meta.description}`);
    }
    console.log();
    // tslint:enable: no-console
}

function convertToScriptTarget(target: string): ts.ScriptTarget {
    switch (target.trim().toLowerCase()) {
        case 'es3': return ts.ScriptTarget.ES3;
        case 'es5': return ts.ScriptTarget.ES5;
        case 'es2015': return ts.ScriptTarget.ES2015;
        case 'es2016': return ts.ScriptTarget.ES2016;
        case 'es2017': return ts.ScriptTarget.ES2017;
        case 'es2018': return ts.ScriptTarget.ES2018;
        case 'es2019': return ts.ScriptTarget.ES2019;
        case 'es2020': return ts.ScriptTarget.ES2020;
        case 'esnext': return ts.ScriptTarget.ESNext;
        default: return ts.ScriptTarget.Latest;
    }
}

async function loadContents(): Promise<Schema[]> {
    let contents: Schema[] = [];
    const ps: Promise<any>[] = [];
    if (config.input.stdin) {
        ps.push(readSchemaFromStdin().then(s => contents.push(s)));
    }
    for (const pattern of config.input.files) {
        ps.push(readSchemasFromFile(pattern).then(ss => contents = contents.concat(ss)));
    }
    for (const url of config.input.urls) {
        ps.push(readSchemaFromUrl(url).then(s => contents.push(s)));
    }
    await Promise.all(ps);
    return contents;
}

async function exec(): Promise<void> {
    const command = initialize(process.argv);
    const pc = readConfig(opts);
    setConfig(pc);

    if (opts.info) {
        await showInfo(command, opts.configFile);
        return;
    }

    const contents = await loadContents();
    const result = await dtsgenerator({
        contents,
    });
    if (opts.out) {
        mkdirp.sync(path.dirname(opts.out));
        fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
    } else {
        /* tslint:disable:no-console */
        console.log(result);
    }
}
exec().catch(err => {
    console.error(err.stack || err);
});
