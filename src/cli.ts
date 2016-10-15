import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import dtsgenerator from './index';
import opts, { initialize } from './commandOptions';


function readSchemasFromStdin(): Promise<JsonSchemaOrg.Schema[]> {
    process.stdin.setEncoding('utf-8');
    return new Promise((resolve, reject) => {
        let data = '';
        function onRead(): void {
            let chunk: string | Buffer;
            while (chunk = process.stdin.read()) {
                if (typeof chunk === 'string') {
                    data += chunk;
                }
            }
        }
        function onEnd(): void {
            let schemas = JSON.parse(data);
            if (!Array.isArray(schemas)) {
                schemas = [schemas];
            }
            resolve(schemas);
        }
        function onError(err: any): void {
            reject(err);
        }
        process.stdin
            .on('readable', onRead)
            .once('end', onEnd)
            .once('error', onError);
    });
}

async function exec(): Promise<void> {
    initialize(process.argv);

    let schemas: JsonSchemaOrg.Schema[] = [];
    if (opts.isReadFromStdin()) {
        schemas = await readSchemasFromStdin();
    }

    dtsgenerator(schemas).then((result: string) => {
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

