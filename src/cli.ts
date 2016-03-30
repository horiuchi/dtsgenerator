import fs = require('fs');
import path = require('path');
import program = require('commander');
import mkdirp = require('mkdirp');
import asyncblock = require('asyncblock');
import glob = require('glob');

import dtsgenerator from './index';

const pkg = require('../package.json');


// <hoge> is reuired, [hoge] is optional
program
    .version(pkg.version)
    .usage('[options] <file ... | file patterns using node-glob>')
    .option('-o, --out [file]', 'output d.ts filename.')
    .option('-p, --prefix [type prefix]', 'set the prefix of interface name. default is nothing.')
    .parse(process.argv);

interface CommandOptions {
    args: string[];
    out?: string;
    prefix?: string;
}
const opts = program as CommandOptions;

if (opts.args.length === 0) {
    readSchemasFromStdin(processGenerate);
} else {
    readSchemasFromFiles(processGenerate);
}

function readSchemasFromStdin(callback: (err: any, schemas: JsonSchema[]) => void): void {
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

function readSchemasFromFiles(callback: (err: any, schemas: JsonSchema[]) => void): void {
    asyncblock((flow: asyncblock.IFlow) => {
        flow.errorCallback = (err: any) => {
            callback(err, null);
        };
        opts.args.forEach((arg) => {
            const files = glob.sync(arg);
            files.forEach((file: any) => {
                fs.readFile(file, { encoding: 'utf-8' }, flow.add(file));
            });
        });
        const contents = flow.wait<any>();
        callback(null, Object.keys(contents).map((key) => contents[key]));
    });
}

function processGenerate(err: any, schemas: JsonSchema[]): void {
    if (err) {
        throw err;
    }
    dtsgenerator(schemas, opts.prefix).then((result) => {
        if (opts.out) {
            mkdirp.sync(path.dirname(opts.out));
            fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
        } else {
            console.log(result);
        }
    });
}

