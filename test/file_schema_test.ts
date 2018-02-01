import * as fs from 'fs';
import * as assert from 'power-assert';
import dtsgenerator from '../src/';
import opts, { clear } from '../src/commandOptions';


describe('file schema test', () => {

    describe('JSON Schema Draft-04', () => {
        afterEach(() => {
            clear();
        });

        it('news schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/news.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/news.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('JSON Schemas schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/schema'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/schema.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('related two schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/apibase.json', './schema/json-schema/draft-04/apimeta.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/apimeta.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('circular referenced schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/circular.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/circular.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('download related schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/simple_example.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/simple_schema.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('download related advanced schema', async () => {
            opts.files = ['./schema/json-schema/draft-04/advanced_example.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/advanced_schema.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
    });

    describe('OpenAPI ver 2', () => {
        afterEach(() => {
            clear();
        });

        it('swagger2.0 sample schema', async () => {
            opts.files = ['./schema/openapi/2/petstore-expanded.json'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/petstore-expanded.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
        it('swagger2.0 sample schema with yaml format', async () => {
            opts.files = ['./schema/openapi/2/petstore-expanded.yaml'];
            const actual = await dtsgenerator();
            const expected = fs.readFileSync('./test/expected_file/petstore-expanded.d.ts', { encoding: 'utf-8' });
            assert.equal(actual, expected, actual);
        });
    });
});
