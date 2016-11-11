import * as fs from 'fs';
import * as assert from 'power-assert';
import opts, { initialize } from '../src/commandOptions';
import dtsgenerator from '../src/';


describe('file schema test', () => {

    afterEach(() => {
        initialize();
    });

    it('news schema', async () => {
        opts.files = ['./schema/news.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/news.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('JSON Schemas schema', async () => {
        opts.files = ['./schema/schema'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/schema.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('related two schema', async () => {
        opts.files = ['./schema/apibase.json', './schema/apimeta.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/apimeta.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('circular referenced schema', async () => {
        opts.files = ['./schema/circular.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/circular.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('download related schema', async () => {
        opts.files = ['./schema/simple_example.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/simple_schema.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('download related advanced schema', async () => {
        opts.files = ['./schema/advanced_example.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/advanced_schema.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });
    it('swagger2.0 sample schema', async () => {
        opts.files = ['./schema/petstore-expanded.json'];
        const actual = await dtsgenerator();
        const expected = fs.readFileSync('./test/expected_file/petstore-expanded.d.ts', { encoding: 'utf-8' });
        assert.equal(actual, expected, actual);
    });

});

