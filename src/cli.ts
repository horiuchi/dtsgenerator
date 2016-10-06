import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as glob from 'glob';

import dtsgenerator from './index';
import opts, { initialize } from './commandOptions';

initialize(process.argv);


if (opts.isReadFromStdin()) {
    readSchemasFromStdin(processGenerate);
} else {
    readSchemasFromFiles(processGenerate);
}

function readSchemasFromStdin(callback: (err: any, schemas: JsonSchemaOrg.Schema[]) => void): void {
    let data = '';
    process.stdin.setEncoding('utf-8');

    process.stdin.on('readable', () => {
        let chunk: string | Buffer;
        while (chunk = process.stdin.read()) {
            if (typeof chunk === 'string') {
                data += chunk;
            }
        }
    });
    process.stdin.on('end', () => {
        let schemas = JSON.parse(data);
        if (!Array.isArray(schemas)) {
            schemas = [schemas];
        }
        callback(null, schemas);
    });
}

function readSchemasFromFiles(callback: (err: any, schemas: JsonSchemaOrg.Schema[]) => void): void {
    let promises: Promise<JsonSchemaOrg.Schema>[] = [];
    opts.files.forEach((arg) => {
        const files = glob.sync(arg);
        promises = promises.concat(files.map((file: string) => {
            return new Promise((resolve: (res: JsonSchemaOrg.Schema) => void, reject: (err: any) => void) => {
                fs.readFile(file, { encoding: 'utf-8' }, (err: any, content: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(content));
                    }
                });
            });
        }));
    });
    Promise.all(promises).then((schemas: JsonSchemaOrg.Schema[]) => {
        callback(null, schemas);
    }).catch((err: any) => {
        callback(err, []);
    });
}

function processGenerate(err: any, schemas: JsonSchemaOrg.Schema[]): void {
    if (err) {
        throw err;
    }
    dtsgenerator(schemas).then((result) => {
        if (opts.out) {
            mkdirp.sync(path.dirname(opts.out));
            fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
        } else {
            console.log(result);
        }
    }).catch((e: any) => {
        console.error(e.stack || e);
    });
}

