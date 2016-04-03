require('source-map-support').install();

import * as fs from 'fs';
import * as assert from 'power-assert';
import dtsgenerator from '../src/';


describe('file schema test', () => {

    it('news schema', async () => {
        const schema = fs.readFileSync('./schema/news.json', { encoding: 'utf-8' });
        const actual = await dtsgenerator([schema], 'I');
        const expected = fs.readFileSync('./test/expected_file/news.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('JSON Schemas schema', async () => {
        const schema = fs.readFileSync('./schema/schema', { encoding: 'utf-8' });
        const actual = await dtsgenerator([schema]);
        const expected = fs.readFileSync('./test/expected_file/schema.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('related two schema', async () => {
        const actual = await dtsgenerator([
            fs.readFileSync('./schema/apibase.json', { encoding: 'utf-8' }),
            fs.readFileSync('./schema/apimeta.json', { encoding: 'utf-8' }),
        ]);
        const expected = fs.readFileSync('./test/expected_file/apimeta.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });

});

