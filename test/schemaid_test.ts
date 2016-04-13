require('source-map-support').install();

import * as assert from 'power-assert';
import { SchemaId } from '../src/schemaid';


describe('schema id parser test', () => {

    function test(schemaId: SchemaId, expectedId: string, isFetchable: boolean, fileId: string,
            isJsonPath: boolean, jsonPath: string[], typenames: string[]): void {
        assert.equal(schemaId.getAbsoluteId(), expectedId);
        assert.equal(schemaId.isFetchable(), isFetchable);
        assert.equal(schemaId.getFileId(), fileId);
        assert.equal(schemaId.isJsonPointerHash(), isJsonPath);
        assert.deepEqual(schemaId.getJsonPointerHash(), jsonPath);
        assert.deepEqual(schemaId.getTypeNames(), typenames);
    }

    it('root schema id', () => {
        test(new SchemaId('/sampleId', []), '/sampleId#', false, '/sampleId#', false, [], ['SampleId']);
        test(new SchemaId('/sample2/path/file', []), '/sample2/path/file#', false, '/sample2/path/file#', false, [], ['sample2', 'path', 'File']);
        test(new SchemaId('https://example.com:3000/path/to/schema/file', []),
             'https://example.com:3000/path/to/schema/file#', true, 'https://example.com:3000/path/to/schema/file#', false, [],
             ['example.com:3000', 'path', 'to', 'schema', 'File']);
        test(new SchemaId('#/definitions/positiveInteger', []), '#/definitions/positiveInteger', false, '#', true, ['definitions', 'positiveInteger'], ['definitions', 'PositiveInteger']);
    });
    it('JSON Schema usage pattern', () => {
        test(new SchemaId('http://x.y.z/rootschema.json#', []), 'http://x.y.z/rootschema.json#', true, 'http://x.y.z/rootschema.json#', false, [], ['x.y.z', 'RootschemaJson']);
        test(new SchemaId('#foo', ['http://x.y.z/rootschema.json#']), 'http://x.y.z/rootschema.json#foo', true, 'http://x.y.z/rootschema.json#', false, [], ['x.y.z', 'rootschema.json', 'Foo']);
        test(new SchemaId('otherschema.json', ['http://x.y.z/rootschema.json#']), 'http://x.y.z/otherschema.json#', true, 'http://x.y.z/otherschema.json#', false, [], ['x.y.z', 'OtherschemaJson']);
        test(new SchemaId('#bar', ['otherschema.json', 'http://x.y.z/rootschema.json#']), 'http://x.y.z/otherschema.json#bar', true, 'http://x.y.z/otherschema.json#', false, [], ['x.y.z', 'otherschema.json', 'Bar']);
        test(new SchemaId('t/inner.json#/json/path', ['otherschema.json', 'http://x.y.z/rootschema.json#']), 'http://x.y.z/t/inner.json#/json/path', true, 'http://x.y.z/t/inner.json#', true, ['json', 'path'], ['x.y.z', 't', 'inner.json', 'json', 'Path']);
        test(new SchemaId('some://where.else/completely#', ['http://x.y.z/rootschema.json#']), 'some://where.else/completely#', false, 'some://where.else/completely#', false, [], ['where.else', 'Completely']);
    });

});

