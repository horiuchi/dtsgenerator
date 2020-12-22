import assert from 'assert';
import dtsgenerator from '../src/core';
import config, {
    clearToDefault,
    setConfig,
    showConfig,
} from '../src/core/config';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { ts, parseSchema } from '../src/core/type';

describe('show config test', () => {
    let content: string;
    let oldWrite: typeof process.stdout.write;

    beforeEach(() => {
        oldWrite = process.stdout.write;
        content = '';
        process.stdout.write = (str: string): boolean => {
            content += str;
            return true;
        };
        process.stdout.columns = 160;
    });
    afterEach(() => {
        process.stdout.write = oldWrite;
        clearToDefault();
    });

    it('no config test', async () => {
        setConfig({});
        await showConfig('no_config', config);
        assert.strictEqual(
            content,
            `Version: no_config
ConfigFile: "not set"

Config:
  input:
  target: ESNext
  plugins:

Plugins: count=0

`
        );
    });
    it('full config test', async () => {
        setConfig({
            configFile: 'test.json',
            input: {
                files: ['./input.json', './foo/bar.json'],
                urls: ['http://www.example.com/schema.json'],
                stdin: true,
            },
            outputFile: 'output.d.ts',
            target: ts.ScriptTarget.ES2015,
            outputAST: false,
            plugins: {
                '@dtsgenerator/do-nothing': false,
                '@dtsgenerator/single-quote': true,
                '@dtsgenerator/replace-namespace': {
                    map: [
                        {
                            from: ['Components', 'Schemas'],
                            to: ['Test', 'PetStore'],
                        },
                        {
                            from: ['Paths'],
                            to: ['Test', 'PetStore'],
                        },
                    ],
                },
            },
        });
        await showConfig('full_config', config);

        function getVersion(key: string): string {
            const pkg = require('../package.json');
            const version: string = pkg.devDependencies[key];
            if (/^[^\d]/.test(version)) {
                return version.substr(1);
            }
            return version;
        }
        const expected = `Version: full_config
ConfigFile: test.json

Config:
  input:
    files: ["./input.json","./foo/bar.json"]
    urls: ["http://www.example.com/schema.json"]
    stdin: true
  outputFile: "output.d.ts"
  target: ES2015
  plugins:
    @dtsgenerator/do-nothing: false
    @dtsgenerator/single-quote: true
    @dtsgenerator/replace-namespace: {"map":[{"from":["Components","Schemas"],"to":["Test","PetStore"]},{"from":["Paths"],"to":["Test","PetStore"]}]}

Plugins: count=2
  @dtsgenerator/single-quote@${getVersion(
      '@dtsgenerator/single-quote'
  )}: change all quotation mark to single
  @dtsgenerator/replace-namespace@${getVersion(
      '@dtsgenerator/replace-namespace'
  )}: replace the namespace names

`;
        assert.strictEqual(content, expected, content);
    });
});

describe('config test', () => {
    afterEach(() => {
        clearToDefault();
    });

    it('apply plugin test', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/plugin-test',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        {
                            type: 'string',
                            enum: ['NW', 'NE', 'SW', 'SE'],
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: {
                plugins: {
                    '@dtsgenerator/do-nothing': true,
                },
            },
        });

        const expected = `declare namespace Test {
    export interface PluginTest {
        id?: number;
        array?: [
            string?,
            number?,
            boolean?,
            ("NW" | "NE" | "SW" | "SE")?,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('apply single-quote plugin test', async () => {
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/single-quote',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        {
                            type: 'string',
                            enum: ['NW', 'NE', 'SW', 'SE'],
                        },
                    ],
                },
            },
        };
        const result = await dtsgenerator({
            contents: [parseSchema(schema)],
            config: {
                plugins: {
                    '@dtsgenerator/single-quote': true,
                },
            },
        });

        const expected = `declare namespace Test {
    export interface SingleQuote {
        id?: number;
        array?: [
            string?,
            number?,
            boolean?,
            ('NW' | 'NE' | 'SW' | 'SE')?,
            ...any[]
        ];
    }
}
`;
        assert.strictEqual(result, expected, result);
    });

    it('error case test', () => {
        setConfig({
            plugins: {
                '@dtsgenerator/not-exists-plugin': true,
            },
        });
        const schema: JsonSchemaDraft04.Schema = {
            id: '/test/single-quote',
            type: 'object',
            properties: {
                id: {
                    type: 'integer',
                },
                array: {
                    type: 'array',
                    items: [
                        { type: 'string' },
                        { type: 'integer' },
                        { type: 'boolean' },
                        {
                            type: 'string',
                            enum: ['NW', 'NE', 'SW', 'SE'],
                        },
                    ],
                },
            },
        };

        assert.rejects(() => {
            return dtsgenerator({
                contents: [parseSchema(schema)],
                config: {
                    plugins: {
                        '@dtsgenerator/not-exists-plugin': true,
                    },
                },
            });
        });
    });
});
