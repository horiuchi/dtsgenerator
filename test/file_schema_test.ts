import * as fs from 'fs';
import * as assert from 'power-assert';
import 'babel-polyfill';

import dtsgenerator = require('../src/index');

describe('file schema test', () => {

    it('news schema', () => {
        const schema = fs.readFileSync('./schema/news.json', { encoding: 'utf-8' });
        const actual = dtsgenerator([schema], 'I');
        const expected = fs.readFileSync('./test/expected_file/news.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('JSON Schemas schema', () => {
        const schema = fs.readFileSync('./schema/schema', { encoding: 'utf-8' });
        const actual = dtsgenerator([schema]);
        const expected = fs.readFileSync('./test/expected_file/schema.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('related two schema', () => {
        const actual = dtsgenerator([
            fs.readFileSync('./schema/apibase.json', { encoding: 'utf-8' }),
            fs.readFileSync('./schema/apimeta.json', { encoding: 'utf-8' }),
        ]);
        const expected = fs.readFileSync('./test/expected_file/apimeta.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });

});

