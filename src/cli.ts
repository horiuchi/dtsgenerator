import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import opts, { initialize } from './commandOptions';
import dtsgenerator from './core';
import { globFiles, parseFileContent } from './utils';

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

async function exec(): Promise<void> {
    initialize(process.argv);

    let contents: any[] = [];
    if (opts.isReadFromStdin()) {
        contents.push(await readSchemaFromStdin());
    }
    for (const pattern of opts.files) {
        const cs = await readSchemasFromFile(pattern);
        contents = contents.concat(cs);
    }

    /* tslint:disable:no-console */
    dtsgenerator({
        contents,
        inputUrls: opts.urls,
        prefix: opts.prefix,
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

