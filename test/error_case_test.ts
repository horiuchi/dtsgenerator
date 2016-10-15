require('source-map-support').install();

import * as assert from 'power-assert';
import dtsgenerator from '../src/';


describe('error schema test', () => {

    it('no id schema', async () => {
        const schema: JsonSchemaOrg.Schema = {
            type: 'object',
        };
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'There is no id in the input schema(s)');
        }
    });
    it('unkown type schema', async () => {
        const schema: any = {
            id: '/test/unkown_type',
            type: 'hoge'
        };
        try {
            await dtsgenerator([schema]);
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
                    type: 'fuga'
                }
            }
        };
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal(e.message, 'unknown type: fuga');
        }
    });

    it('target of $ref is not found', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '/notFound/id#'
                }
            }
        };
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal(e.message, '$ref target is not found: /notFound/id#');
        }
    });
    it('target of $ref is invalid path', async () => {
        const schema: JsonSchemaOrg.Schema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '#hogefuga'
                }
            }
        };
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal(e.message, '$ref target is not found: /test/target_not_found#hogefuga');
        }
    });
    it('invalid format schema', async () => {
        const schema = 'not schema data and invalid JSON format {.';
        try {
            await dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.ok(/^Unexpected token/.test(e.message));
        }
    });

});

