import assert from 'assert';
import opts, { clear, initialize } from '../src/commandOptions';

describe('output command help test', () => {
    it('check output command help ', () => {
        const command = initialize(['node', 'script.js']);
        let output = '';
        command
            .configureHelp({ helpWidth: 160 })
            .configureOutput({
                writeOut: (str) => {
                    output += str;
                },
            })
            .outputHelp();
        assert.strictEqual(
            output,
            `Usage: dtsgenerator [options] <file ... | file patterns using node-glob>

Options:
  -V, --version           output the version number
  -c, --config <file>     set configuration file path.
  --url <url>             input json schema from the url. (default: [])
  --stdin                 read stdin with other files or urls.
  -o, --out <file>        output filename.
  -t, --target <version>  Specify ECMAScript target version: 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT' (default).
  --info                  for developer mode. output loaded config and plugin details only.
  --output-ast            output TypeScript AST instead of d.ts file.
  -h, --help              display help for command

Examples:
  $ dtsgen --help
  $ dtsgen --out types.d.ts schema/**/*.schema.json
  $ cat schema1.json | dtsgen -c dtsgen.json
  $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
  $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
  $ dtsgen -c dtsgen-test.json --info

`
        );
    });
});

describe('command options test', () => {
    afterEach(() => {
        clear();
    });

    it('should parse arguments 1', () => {
        initialize(['node', 'script.js']);

        assert.strictEqual(opts.configFile, undefined);
        assert.deepStrictEqual(opts.files, []);
        assert.deepStrictEqual(opts.urls, []);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, undefined);
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), true);
    });
    it('should parse arguments 2', () => {
        initialize([
            'node',
            'script.js',
            '--out',
            'output.d.ts',
            '--stdin',
            '--url',
            'http://example.com/hoge/fuga',
            '--url',
            'http://example.com/hoge/fuga2',
            './file1.json',
            '../file2.json',
            'file3.json',
        ]);

        assert.strictEqual(opts.configFile, undefined);
        assert.deepStrictEqual(opts.files, [
            './file1.json',
            '../file2.json',
            'file3.json',
        ]);
        assert.deepStrictEqual(opts.urls, [
            'http://example.com/hoge/fuga',
            'http://example.com/hoge/fuga2',
        ]);
        assert.strictEqual(opts.stdin, true);
        assert.strictEqual(opts.out, 'output.d.ts');
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), true);
    });
    it('should parse arguments 3', () => {
        initialize([
            'node',
            'script.js',
            './input1.json',
            './path/input2.json',
        ]);

        assert.strictEqual(opts.configFile, undefined);
        assert.deepStrictEqual(opts.files, [
            './input1.json',
            './path/input2.json',
        ]);
        assert.deepStrictEqual(opts.urls, []);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, undefined);
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 4', () => {
        initialize([
            'node',
            'script.js',
            '--out',
            './schema.d.ts',
            '--url',
            'https://example.com/schema.json',
        ]);

        assert.strictEqual(opts.configFile, undefined);
        assert.deepStrictEqual(opts.files, []);
        assert.deepStrictEqual(opts.urls, ['https://example.com/schema.json']);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, './schema.d.ts');
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), false);
    });

    it('should parse arguments 5', () => {
        initialize([
            'node',
            'script.js',
            '--out',
            './schema.d.ts',
            '--config',
            'config.json',
            '--url',
            'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);

        assert.strictEqual(opts.configFile, 'config.json');
        assert.deepStrictEqual(opts.files, []);
        assert.deepStrictEqual(opts.urls, [
            'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, './schema.d.ts');
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 6', () => {
        initialize([
            'node',
            'script.js',
            '--out',
            './schema.d.ts',
            '-c',
            'config.json',
            '--url',
            'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);

        assert.strictEqual(opts.configFile, 'config.json');
        assert.deepStrictEqual(opts.files, []);
        assert.deepStrictEqual(opts.urls, [
            'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, './schema.d.ts');
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 7', () => {
        initialize([
            'node',
            'script.js',
            '-t',
            'es5',
            '--output-ast',
            './input1.json',
            './path/input2.json',
        ]);

        assert.strictEqual(opts.configFile, undefined);
        assert.deepStrictEqual(opts.files, [
            './input1.json',
            './path/input2.json',
        ]);
        assert.deepStrictEqual(opts.urls, []);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, undefined);
        assert.strictEqual(opts.target, 'es5');
        assert.strictEqual(opts.info, undefined);
        assert.strictEqual(opts.outputAST, true);
        assert.strictEqual(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 8', () => {
        initialize(['node', 'script.js', '-c', 'config.json', '--info']);

        assert.strictEqual(opts.configFile, 'config.json');
        assert.deepStrictEqual(opts.files, []);
        assert.deepStrictEqual(opts.urls, []);
        assert.strictEqual(opts.stdin, undefined);
        assert.strictEqual(opts.out, undefined);
        assert.strictEqual(opts.target, undefined);
        assert.strictEqual(opts.info, true);
        assert.strictEqual(opts.outputAST, undefined);
        assert.strictEqual(opts.isReadFromStdin(), true);
    });
});
