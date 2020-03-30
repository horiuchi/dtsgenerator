import assert from 'power-assert';
import dtsgenerator from '../src/core';
import { clearToDefault, setConfig } from '../src/core/config';
import { JsonSchemaDraft04 } from '../src/core/jsonSchemaDraft04';
import { parseSchema } from '../src/core/type';

describe('config test', () => {

    afterEach(() => {
        clearToDefault();
    });

    it('apply plugin test', async () => {
        setConfig({
            plugins: {
                '@dtsgenerator/do-nothing': true,
            },
        });
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface PluginTest {
        id?: number;
        array?: [string?, number?, boolean?, ("NW" | "NE" | "SW" | "SE")?, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });

    it('apply single-quote plugin test', async () => {
        setConfig({
            plugins: {
                '@dtsgenerator/single-quote': true,
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
        const result = await dtsgenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    export interface SingleQuote {
        id?: number;
        array?: [string?, number?, boolean?, ('NW' | 'NE' | 'SW' | 'SE')?, ...any[]];
    }
}
`;
        assert.equal(result, expected, result);
    });
});
