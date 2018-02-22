import assert from 'power-assert';
import dtsgenerator from '../src/core';


describe('error schema test', () => {

    it('no id schema', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            type: 'object',
        };
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'There is no schema in the input contents.');
        }
    });
    it('unkown type schema', async () => {
        const schema: any = {
            id: '/test/unkown_type',
            type: 'hoge',
        };
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'unknown type: hoge');
        }
    });
    it('unkown type property', async () => {
        const schema: any = {
            id: '/test/unkown_property',
            type: 'object',
            properties: {
                name: {
                    type: 'fuga',
                },
            },
        };
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'unknown type: fuga');
        }
    });

    it('target of $ref is not found', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '/notFound/id#',
                },
            },
        };
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'The $ref target is not exists: /notFound/id#');
        }
    });
    it('target of $ref is invalid path', async () => {
        const schema: JsonSchemaOrg.Draft04.Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '#hogefuga',
                },
            },
        };
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'The $ref target is not found: /test/target_not_found#hogefuga');
        }
    });
    it('invalid format schema', async () => {
        const schema = 'This string is not schema data and invalid JSON format {.' as any;
        try {
            await dtsgenerator({ contents: [schema] });
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'There is no schema in the input contents.');
        }
    });

});

