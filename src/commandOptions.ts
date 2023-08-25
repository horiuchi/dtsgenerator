import * as commander from 'commander';

export const defaultConfigFile = 'dtsgen.json';

export class CommandOptions {
    public configFile?: string;
    public files: string[] = [];
    public urls: string[] = [];
    public stdin?: boolean;
    public out?: string;
    public target?: string;
    public info?: boolean;
    public outputAST?: boolean;
}

const opts = new CommandOptions();
clear();
export default opts;

export function initialize(argv: string[]): commander.Command {
    return parse(opts, argv);
}

export function clear(): void {
    opts.configFile = undefined;
    opts.files = [];
    opts.urls = [];
    opts.stdin = undefined;
    opts.out = undefined;
    opts.target = undefined;
    opts.info = undefined;
    opts.outputAST = undefined;
}

function parse(options: CommandOptions, argv: string[]): commander.Command {
    const program = new commander.Command();

    function collectUrl(val: string, memo: string[]): string[] {
        memo.push(val);
        return memo;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const pkg: { name: string; version: string } = require('../package.json');

    // <hoge> is required, [hoge] is optional
    program
        .name(pkg.name)
        .version(pkg.version)
        .usage('[options] <file ... | file patterns using node-glob>')
        .option('-c, --config <file>', 'set configuration file path.')
        .option(
            '--url <url>',
            'input json schema from the url.',
            collectUrl,
            [],
        )
        .option('--stdin', 'read stdin with other files or urls.')
        .option('-o, --out <file>', 'output filename.')
        .option(
            '-t, --target <version>',
            "Specify ECMAScript target version: 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT' (default).",
        )
        .option(
            '--info',
            'for developer mode. output loaded config and plugin details only.',
        )
        .option('--output-ast', 'output TypeScript AST instead of d.ts file.')
        .addHelpText(
            'afterAll',
            `
Examples:
  $ dtsgen --help
  $ dtsgen --out types.d.ts schema/**/*.schema.json
  $ cat schema1.json | dtsgen -c dtsgen.json
  $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json
  $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml
  $ dtsgen -c dtsgen-test.json --info
`,
        )
        .parse(argv);

    const opts = program.opts();
    options.files = program.args;
    options.configFile = opts.config as string;
    options.urls = opts.url as string[];
    options.stdin = opts.stdin as boolean;
    options.out = opts.out as string;
    options.target = opts.target as string;
    options.info = opts.info as boolean;
    options.outputAST = opts.outputAst as boolean;
    return program;
}
