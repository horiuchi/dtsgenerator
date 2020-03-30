import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import opts, { initialize } from './commandOptions';
import dtsgenerator, { Schema, readSchemaFromStdin, readSchemasFromFile, readSchemaFromUrl } from './core';
import { Config } from './core/config';

async function readConfig(configFile: string, outputAST?: boolean): Promise<Partial<Config>> {
    let config: Partial<Config>;
    try {
        config = require(configFile);
    } catch {
        config = {};
    }
    if (outputAST) {
        config.outputAST = true;
    }
    return config;
}

async function exec(): Promise<void> {
    initialize(process.argv);

    let contents: Schema[] = [];
    let config: Partial<Config> | undefined;
    const ps: Promise<any>[] = [];
    if (opts.isReadFromStdin()) {
        ps.push(readSchemaFromStdin().then(s => contents.push(s)));
    }
    for (const pattern of opts.files) {
        ps.push(readSchemasFromFile(pattern).then(ss => contents = contents.concat(ss)));
    }
    for (const url of opts.urls) {
        ps.push(readSchemaFromUrl(url).then(s => contents.push(s)));
    }
    if (opts.configFile != null) {
        ps.push(readConfig(opts.configFile, opts.outputAST).then(c => config = c));
    }
    await Promise.all(ps);

    const result = await dtsgenerator({
        contents,
        config,
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
