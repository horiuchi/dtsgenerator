import assert from 'assert';
import dtsGenerator, { parseSchema } from '../src/core';
import { JsonSchemaDraft07 } from '../src/core/jsonSchemaDraft07';

describe("include 'allOf' and 'oneOf' test", () => {
    it("multiple 'allOf' and 'oneOf' nestings schema", async () => {
        const base: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/allOf/oneOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            allOf: [
                { $ref: '/test/multiple/allOf/oneOf/general' },
                {
                    oneOf: [
                        { $ref: '/test/multiple/allOf/oneOf/team' },
                        { $ref: '/test/multiple/allOf/oneOf/player' },
                    ],
                },
            ],
        };
        const general: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/allOf/oneOf/general',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                id: { type: 'integer' },
                type: { type: 'string' },
            },
            required: ['id', 'type'],
        };
        const team: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/allOf/oneOf/team',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                name: { type: 'string' },
            },
            required: ['id', 'name'],
        };
        const player: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/allOf/oneOf/player',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
            },
            required: ['id', 'firstName', 'lastName'],
        };

        const result = await dtsGenerator({
            contents: [base, general, team, player].map((s) => parseSchema(s)),
        });

        const expected = `declare namespace Test {
    namespace Multiple {
        namespace AllOf {
            export type OneOf = {
                id: number;
                type: string;
            } & (OneOf.Team | OneOf.Player);
            namespace OneOf {
                export interface General {
                    id: number;
                    type: string;
                }
                export interface Player {
                    firstName: string;
                    lastName: string;
                }
                export interface Team {
                    name: string;
                }
            }
        }
    }
}
`;
        assert.strictEqual(result, expected);
    });
    it("multiple 'oneOf' and 'allOf' nestings schema", async () => {
        const base: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/oneOf/allOf',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            oneOf: [
                { $ref: '/test/multiple/oneOf/allOf/team' },
                {
                    allOf: [
                        { $ref: '/test/multiple/oneOf/allOf/general' },
                        { $ref: '/test/multiple/oneOf/allOf/player' },
                    ],
                },
            ],
        };
        const general: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/oneOf/allOf/general',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                id: { type: 'integer' },
                type: { type: 'string' },
            },
            required: ['id', 'type'],
        };
        const team: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/oneOf/allOf/team',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                name: { type: 'string' },
            },
            required: ['id', 'name'],
        };
        const player: JsonSchemaDraft07.Schema = {
            $id: '/test/multiple/oneOf/allOf/player',
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
            },
            required: ['id', 'firstName', 'lastName'],
        };

        const result = await dtsGenerator({
            contents: [base, general, team, player].map((s) => parseSchema(s)),
        });

        const expected = `declare namespace Test {
    namespace Multiple {
        namespace OneOf {
            export type AllOf = AllOf.Team | {
                id: number;
                type: string;
                firstName: string;
                lastName: string;
            };
            namespace AllOf {
                export interface General {
                    id: number;
                    type: string;
                }
                export interface Player {
                    firstName: string;
                    lastName: string;
                }
                export interface Team {
                    name: string;
                }
            }
        }
    }
}
`;
        assert.strictEqual(result, expected);
    });
});
