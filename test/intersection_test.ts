import * as assert from 'power-assert';
import dtsgenerator from '../src/';
import opts, { clear } from '../src/commandOptions';


describe('intersection test', () => {

    beforeEach(() => {
        opts.intersection = true;
    });

    afterEach(() => {
        clear();
    });

    it('should combine allOf and anyOf using intersection', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: 'http://test/intersection',
            allOf: [
                { anyOf: [
                    { type: 'object', required: ['a'], properties: { a: { type: 'string' } } },
                    { type: 'object', required: ['b'], properties: { b: { enum: ['one', 'two'] } } },
                ]},
                {
                    required: ['c'],
                    type: 'object',
                    properties: {
                        c:  { type: 'number'  },
                    },
                },
            ],
        };
        const result = await dtsgenerator([schema]);

        const expected = `declare namespace Test {
    export type Intersection = ({
        a: string;
    } | {
        b: "one" | "two";
    }) & {
        c: number;
    };
}
`;
        assert.equal(result, expected, result);
    });
});
