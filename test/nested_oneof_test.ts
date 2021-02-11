import assert from 'assert';
import dtsGenerator, { parseSchema } from '../src/core';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';

describe("nested 'oneOf' test", () => {
    it("single 'oneOf' nesting schema", async () => {
        const schema: JsonSchemaDraft07.Schema = {
            $id: '/test/nested/oneOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        a: { type: 'string' },
                    },
                },
                {
                    type: 'object',
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                b: { type: 'string' },
                            },
                        },
                        {
                            type: 'object',
                            properties: {
                                c: { type: 'string' },
                            },
                        },
                    ],
                },
            ],
        };
        const result = await dtsGenerator({ contents: [parseSchema(schema)] });

        const expected = `declare namespace Test {
    namespace Nested {
        export type OneOf = {
            a?: string;
        } | ({
            b?: string;
        } | {
            c?: string;
        });
    }
}
`;
        assert.strictEqual(
            result,
            expected,
            "Nested 'oneOf' definitions should result in all properties being included in the output interface."
        );
    });
});
