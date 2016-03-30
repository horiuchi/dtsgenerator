import * as assert from 'power-assert';

import { SchemaId } from '../src/schemaid';


describe('schema id parser test', () => {

    function test(id: string, parents: string[], expectedId: string, isFetchable: boolean, typename: string[]): void {
        const schemaId = new SchemaId(id, ...parents);
        assert.equal(expectedId, schemaId.getAbsoluteId());
        assert.equal(isFetchable, schemaId.isFetchable());
        assert.deepEqual(typename, schemaId.getTypeName());
    }

    it('root schema id', () => {
        test('/sampleId', [], '/sampleId', false, ['sampleId']);
        test('/sample2/path/file', [], '/sample2/path/file', false, ['sample2', 'path', 'file']);
        test('https://example.com:3000/path/to/schema/file', [],
             'https://example.com:3000/path/to/schema/file', true, ['example.com:3000', 'path', 'to', 'schema', 'file']);
    });
    it('JSON Schema usage pattern', () => {
        test('http://x.y.z/rootschema.json#', [], 'http://x.y.z/rootschema.json#', true, ['x.y.z', 'rootschema.json']);
        test('#foo', ['http://x.y.z/rootschema.json#'], 'http://x.y.z/rootschema.json#foo', true, ['x.y.z', 'rootschema.json', 'foo']);
        test('otherschema.json', ['http://x.y.z/rootschema.json#'], 'http://x.y.z/otherschema.json#', true, ['x.y.z', 'otherschema.json']);
        test('#bar', ['otherschema.json', 'http://x.y.z/rootschema.json#'], 'http://x.y.z/otherschema.json#bar', true, ['x.y.z', 'otherschema.json', 'bar']);
        test('t/inner.json#a', ['otherschema.json', 'http://x.y.z/rootschema.json#'], 'http://x.y.z/t/inner.json#a', true, ['x.y.z', 't', 'inner.json', 'a']);
        test('some://where.else/completely#', ['http://x.y.z/rootschema.json#'], 'some://where.else/completely#', true, ['where.else', 'completely']);
    });

});

