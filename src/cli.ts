import * as fs from 'fs';
import { dirname } from 'path';
import opts, { initialize } from './commandOptions';
import dtsgenerator, {
    Schema,
    readSchemaFromStdin,
    readSchemasFromFile,
    readSchemaFromUrl,
} from './core';
import config, { setConfig, showConfig } from './core/config';
import { readConfig } from './utils';

async function loadContents(): Promise<Schema[]> {
    let contents: Schema[] = [];
    const ps: Promise<void>[] = [];
    if (config.input.stdin) {
        ps.push(
            readSchemaFromStdin().then((s) => {
                contents.push(s);
            }),
        );
    }
    for (const pattern of config.input.files) {
        ps.push(
            readSchemasFromFile(pattern).then((ss) => {
                contents = contents.concat(ss);
            }),
        );
    }
    for (const url of config.input.urls) {
        ps.push(
            readSchemaFromUrl(url).then((s) => {
                contents.push(s);
            }),
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
    process.exitCode = 1;
});
