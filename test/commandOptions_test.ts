import assert from 'power-assert';

import opts, { clear, initialize } from '../src/commandOptions';


describe('output command help test', () => {
    let content: string;
    let oldWrite: any;

    beforeEach(() => {
        oldWrite = process.stdout.write;
        content = '';
        process.stdout.write = (str: string): boolean => {
            content += str;
            return true;
        };
    });
    afterEach(() => {
        process.stdout.write = oldWrite;
    });

    it('should output command help ', () => {
        const command = initialize(['node', 'script.js']);
        command.outputHelp();
        assert.equal(content, `
  Usage: script [options] <file ... | file patterns using node-glob>

  Options:

    -V, --version     output the version number
    --url <url>       input json schema from the url. (default: )
    --stdin           read stdin with other files or urls.
    -o, --out <file>  output d.ts filename.
    -h, --help        output usage information

  Examples:

    $ dtsgen --help
    $ dtsgen --out types.d.ts schema/**/*.schema.json
    $ cat schema1.json | dtsgen
    $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
    $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
`);
    });

});

describe('command options test', () => {

    afterEach(() => {
        clear();
    });

    it('should parse arguments 1', () => {
        initialize(['node', 'script.js']);

        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.isReadFromStdin(), true);
    });
    it('should parse arguments 2', () => {
        initialize([
            'node', 'script.js',
            '--out', 'output.d.ts',
            '--stdin',
            '--url', 'http://example.com/hoge/fuga',
            '--url', 'http://example.com/hoge/fuga2',
            './file1.json', '../file2.json', 'file3.json',
        ]);

        assert.deepEqual(opts.files, ['./file1.json', '../file2.json', 'file3.json']);
        assert.deepEqual(opts.urls, ['http://example.com/hoge/fuga', 'http://example.com/hoge/fuga2']);
        assert.equal(opts.stdin, true);
        assert.equal(opts.out, 'output.d.ts');
        assert.equal(opts.isReadFromStdin(), true);
    });
    it('should parse arguments 3', () => {
        initialize([
            'node', 'script.js',
            './input1.json', './path/input2.json',
        ]);

        assert.deepEqual(opts.files, ['./input1.json', './path/input2.json']);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 4', () => {
        initialize([
            'node', 'script.js',
            '--out', './schema.d.ts',
            '--url', 'https://example.com/schema.json',
        ]);

        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, ['https://example.com/schema.json']);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, './schema.d.ts');
        assert.equal(opts.isReadFromStdin(), false);
    });

});

