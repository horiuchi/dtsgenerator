import * as assert from 'power-assert';
import dtsgenerator from '../src/';
import { clear } from '../src/commandOptions';

describe('enum test', () => {

    afterEach(() => {
        clear();
    });

    it('string vs integer', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/enum_string_vs_integer',
            type: 'object',
            properties: {
                port: {
                    type: 'integer',
                    enum: [1,2,3]
                },
                direction: {
                    type: 'string',
                    enum: ['NW', 'NE', 'SW', 'SE'],
                }
            },
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export interface EnumStringVsInteger {
        port?: 1 | 2 | 3;
        direction?: "NW" | "NE" | "SW" | "SE";
    }
}
`;
        assert.equal(result, expected, result);
    });

});
