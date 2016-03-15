import assert = require('power-assert');

import dtsgenerator = require('../src/index');

console.error = function() { };

describe('error schema test', () => {

    it('no id schema', () => {
        const schema: dtsgenerator.model.IJsonSchema = {
            type: 'object',
        };
        try {
            dtsgenerator([schema]);
            assert.fail();
        } catch (e) {
            assert.equal('id is not found.', e.message);
        }
    });
    it('unkown type schema', () => {
        const schema: dtsgenerator.model.IJsonSchema = {
            id: '/test/unkown_type',
            type: 'hoge'
        };
        try {
            dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('unknown type: hoge', e.message);
        }
    });
    it('unkown type property', () => {
        const schema: dtsgenerator.model.IJsonSchema = {
            id: '/test/unkown_property',
            type: 'object',
            properties: {
                name: {
                    type: 'fuga'
                }
            }
        };
        try {
            dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('unknown type: fuga', e.message);
        }
    });

    it('target of $ref is not found', () => {
        const schema: dtsgenerator.model.IJsonSchema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '/notFound/id#'
                }
            }
        };
        try {
            dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('$ref target is not found: /notFound/id', e.message);
        }
    });
    it('target of $ref is invalid path', () => {
        const schema: dtsgenerator.model.IJsonSchema = {
            id: '/test/target_not_found',
            type: 'object',
            properties: {
                ref: {
                    $ref: '#hogefuga'
                }
            }
        };
        try {
            dtsgenerator([schema], 'I');
            assert.fail();
        } catch (e) {
            assert.equal('$ref path must be absolute path: hogefuga', e.message);
        }
    });

});

