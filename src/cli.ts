import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import opts, { initialize } from './commandOptions';
import dtsgenerator from './core';
import { globFiles, parseFileContent } from './utils';
import { Config } from './core/config';

function readSchemaFromStdin(): Promise<any> {
    process.stdin.setEncoding('utf-8');
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin
            .on('readable', () => {
                let chunk: string | Buffer;
                /* tslint:disable-next-line:no-conditional-assignment */
                while (chunk = process.stdin.read()) {
                    if (typeof chunk === 'string') {
                        data += chunk;
                    }
                }
            })
            .once('end', () => {
                resolve(parseFileContent(data));
            })
            .once('error', (err) => {
                reject(err);
            });
    });
}
async function readSchemasFromFile(pattern: string): Promise<any[]> {
    const files = await globFiles(pattern);
    return Promise.all(files.map((file: string) => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, { encoding: 'utf-8' }, (err: any, content: string) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        resolve(parseFileContent(content, file));
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });
    }));
}
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

    let contents: any[] = [];
    let config: Partial<Config> | undefined;
    const ps: Promise<any>[] = [];
    if (opts.isReadFromStdin()) {
        contents.push(await readSchemaFromStdin());
        ps.push(readSchemaFromStdin().then(s => contents.push(s)));
    }
    for (const pattern of opts.files) {
        ps.push(readSchemasFromFile(pattern).then(cs => contents = contents.concat(cs)));
    }
    if (opts.configFile != null) {
        ps.push(readConfig(opts.configFile, opts.outputAST).then(c => config = c));
    }
    await Promise.all(ps);

    /* tslint:disable:no-console */
    dtsgenerator({
        contents,
        inputUrls: opts.urls,
        config,
    }).then((result: string) => {
        if (opts.out) {
            mkdirp.sync(path.dirname(opts.out));
            fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
        } else {
            console.log(result);
        }
    }).catch((err: any) => {
        console.error(err.stack || err);
    });
}
exec();

