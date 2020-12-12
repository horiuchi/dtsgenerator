/* eslint-disable @typescript-eslint/no-var-requires */
import commander from 'commander';

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

    public isReadFromStdin(): boolean {
        return (
            this.stdin || (this.files.length === 0 && this.urls.length === 0)
        );
    }
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
    const command = new commander.Command();

    function collectUrl(val: string, memo: string[]): string[] {
        memo.push(val);
        return memo;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pkg: Record<string, any> = require('../package.json');

    // <hoge> is required, [hoge] is optional
    command
        .name(pkg.name)
        .version(pkg.version)
        .usage('[options] <file ... | file patterns using node-glob>')
        .option('-c, --config <file>', 'set configuration file path.')
        .option(
            '--url <url>',
            'input json schema from the url.',
            collectUrl,
            []
        )
        .option('--stdin', 'read stdin with other files or urls.')
        .option('-o, --out <file>', 'output filename.')
        .option(
            '-t, --target <version>',
            "Specify ECMAScript target version: 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT' (default)."
        )
        .option(
            '--info',
            'for developer mode. output loaded config and plugin details only.'
        )
        .option('--output-ast', 'output TypeScript AST instead of d.ts file.')
        .on('--help', () => {
            console.log('');
            console.log('  Examples:');
            console.log('');
            console.log('    $ dtsgen --help');
            console.log(
                '    $ dtsgen --out types.d.ts schema/**/*.schema.json'
            );
            console.log('    $ cat schema1.json | dtsgen -c dtsgen.json');
            console.log(
                '    $ dtsgen -o swaggerSchema.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json'
            );
            console.log(
                '    $ dtsgen -o petstore.d.ts --url https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/yaml/petstore.yaml'
            );
            console.log('    $ dtsgen -c dtsgen-test.json --info');
        })
        .parse(argv);

    options['configFile'] = command.config as string;
    options['files'] = command.args;
    options['urls'] = command.url as string[];
    options['stdin'] = command.stdin as boolean;
    options['out'] = command.out as string;
    options['target'] = command.target as string;
    options['info'] = command.info as boolean;
    options['outputAST'] = command.outputAst as boolean;
    return command;
}
