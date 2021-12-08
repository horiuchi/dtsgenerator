import assert from 'assert';
import * as fs from 'fs';
import { ScriptTarget } from 'typescript';
import { CommandOptions } from '../src/commandOptions';
import {
    buildProxyOptions,
    globFiles,
    readConfig,
    readStream,
} from '../src/utils';

describe('root utils test', () => {
    describe('readStream function', () => {
        it('success to read file', async () => {
            const stream = fs.createReadStream(__dirname + '/../package.json');
            const data = await readStream(stream);
            const json = JSON.parse(data);
            assert.equal(json.name, 'dtsgenerator');
        });
    });

    describe('buildProxyOptions function', () => {
        const noProxyUrls = ['foo.example.com', 'baz.example.com'];
        const proxyUrl = 'http://user:pass@proxy.example.com:8080';
        before(() => {
            process.env.NO_PROXY = noProxyUrls.join(', ');
            process.env.HTTP_PROXY = proxyUrl;
            process.env.HTTPS_PROXY = proxyUrl;
        });
        after(() => {
            process.env.NO_PROXY = undefined;
            process.env.HTTP_PROXY = undefined;
            process.env.HTTPS_PROXY = undefined;
        });

        it('success to set proxy', () => {
            const actual = buildProxyOptions(
                'http://bar.example.com/package.json'
            );
            assert.ok(actual);
            assert.ok((actual as any).agent);
        });
        it('success to set https proxy', () => {
            const actual = buildProxyOptions(
                'https://bar.example.com/package.json'
            );
            assert.ok(actual);
            assert.ok((actual as any).agent);
        });
        it('success to no set proxy', () => {
            const actual = buildProxyOptions(
                'https://baz.example.com/package.json'
            );
            assert.equal(actual, undefined);
        });
    });

    describe('globFiles function', () => {
        it('success to get files', async () => {
            const actual = await globFiles('src/*.ts', {
                root: __dirname + '/..',
            });
            assert.deepStrictEqual(actual, [
                'src/cli.ts',
                'src/commandOptions.ts',
                'src/jsonPointer.ts',
                'src/utils.ts',
            ]);
        });
        it('throw error on getting files', () => {
            assert.rejects(() => globFiles(null as unknown as string));
        });
    });

    describe('readConfig function', () => {
        it('use default config', () => {
            const options = new CommandOptions();
            const actual = readConfig(options);
            assert.deepEqual(actual, {
                input: {
                    files: [],
                    stdin: true,
                    urls: [],
                },
                outputAST: false,
            });
        });
        it('set all configs', () => {
            const options = new CommandOptions();
            options.files = ['a.json', 'b.json'];
            options.urls = ['http://www.example.com/schema.json'];
            options.out = 'types.d.ts';
            options.outputAST = true;
            options.target = 'latest';

            const actual = readConfig(options);
            assert.deepEqual(actual, {
                input: {
                    files: ['a.json', 'b.json'],
                    urls: ['http://www.example.com/schema.json'],
                    stdin: false,
                },
                outputFile: 'types.d.ts',
                target: ScriptTarget.Latest,
                outputAST: true,
            });
        });
        it('check all targets in config', () => {
            const options = new CommandOptions();

            for (const [actual, expected] of [
                ['es3', ScriptTarget.ES3],
                ['es5', ScriptTarget.ES5],
                ['es2015', ScriptTarget.ES2015],
                ['es2016', ScriptTarget.ES2016],
                ['es2017', ScriptTarget.ES2017],
                ['es2018', ScriptTarget.ES2018],
                ['es2019', ScriptTarget.ES2019],
                ['es2020', ScriptTarget.ES2020],
                ['esnext', ScriptTarget.ESNext],
            ] as const) {
                options.target = actual;
                assert.deepEqual(readConfig(options), {
                    input: { files: [], stdin: true, urls: [] },
                    outputAST: false,
                    target: expected,
                });
            }
        });

        it('read not config file', () => {
            const path = __dirname + '/test_config.json';
            const options = new CommandOptions();
            options.configFile = path;

            const actual = readConfig(options);
            assert.deepEqual(actual, {
                configFile: path,
                input: {
                    files: [],
                    stdin: true,
                    urls: [],
                },
                target: ScriptTarget.ESNext,
                outputAST: false,
                plugins: {},
            });
        });
    });
});
