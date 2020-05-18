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
        process.stdout.columns = 160;
        const command = initialize(['node', 'script.js']);
        command.outputHelp();
        assert.equal(content, `Usage: dtsgenerator [options] <file ... | file patterns using node-glob>

Options:
  -V, --version           output the version number
  -c, --config <file>     set configuration file path. (default: "dtsgen.json")
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
    $ cat schema1.json | dtsgen -c dtsgenrc.json
    $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
    $ dtsgen -o petstore.d.ts -n PetStore --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
    $ dtsgen -c dtsgen-test.json --info
`);
    });

});

describe('command options test', () => {

    afterEach(() => {
        clear();
    });

    it('should parse arguments 1', () => {
        initialize(['node', 'script.js']);

        assert.equal(opts.configFile, 'dtsgen.json');
        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
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

        assert.equal(opts.configFile, 'dtsgen.json');
        assert.deepEqual(opts.files, ['./file1.json', '../file2.json', 'file3.json']);
        assert.deepEqual(opts.urls, ['http://example.com/hoge/fuga', 'http://example.com/hoge/fuga2']);
        assert.equal(opts.stdin, true);
        assert.equal(opts.out, 'output.d.ts');
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), true);
    });
    it('should parse arguments 3', () => {
        initialize([
            'node', 'script.js',
            './input1.json', './path/input2.json',
        ]);

        assert.equal(opts.configFile, 'dtsgen.json');
        assert.deepEqual(opts.files, ['./input1.json', './path/input2.json']);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 4', () => {
        initialize([
            'node', 'script.js',
            '--out', './schema.d.ts',
            '--url', 'https://example.com/schema.json',
        ]);

        assert.equal(opts.configFile, 'dtsgen.json');
        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, ['https://example.com/schema.json']);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, './schema.d.ts');
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), false);
    });

    it('should parse arguments 5', () => {
        initialize([
            'node', 'script.js',
            '--out', './schema.d.ts',
            '--config', 'config.json',
            '--url', 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);

        assert.equal(opts.configFile, 'config.json');
        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, ['https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml']);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, './schema.d.ts');
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 6', () => {
        initialize([
            'node', 'script.js',
            '--out', './schema.d.ts',
            '-c', 'config.json',
            '--url', 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml',
        ]);

        assert.equal(opts.configFile, 'config.json');
        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, ['https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml']);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, './schema.d.ts');
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 7', () => {
        initialize([
            'node', 'script.js',
            '-t', 'es5',
            '--output-ast',
            './input1.json', './path/input2.json',
        ]);

        assert.equal(opts.configFile, 'dtsgen.json');
        assert.deepEqual(opts.files, ['./input1.json', './path/input2.json']);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.target, 'es5');
        assert.equal(opts.info, undefined);
        assert.equal(opts.outputAST, true);
        assert.equal(opts.isReadFromStdin(), false);
    });
    it('should parse arguments 8', () => {
        initialize([
            'node', 'script.js',
            '-c', 'config.json',
            '--info',
        ]);

        assert.equal(opts.configFile, 'config.json');
        assert.deepEqual(opts.files, []);
        assert.deepEqual(opts.urls, []);
        assert.equal(opts.stdin, undefined);
        assert.equal(opts.out, undefined);
        assert.equal(opts.target, undefined);
        assert.equal(opts.info, true);
        assert.equal(opts.outputAST, undefined);
        assert.equal(opts.isReadFromStdin(), true);
    });

});

