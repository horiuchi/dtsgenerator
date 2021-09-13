import assert from 'assert';
import { selectSchemaType } from '../../src/core/jsonSchema';

describe('selectSchemaType test', () => {
    it('schema is draft-04', () => {
        const actual = selectSchemaType({
            $id: '/test/draft-04',
            $schema: 'http://json-schema.org/draft-04/schema',
        });
        assert.equal(actual.type, 'Draft04');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is draft-07', () => {
        const actual = selectSchemaType({
            $id: '/test/draft-07',
            $schema: 'http://json-schema.org/draft-07/schema#',
        });
        assert.equal(actual.type, 'Draft07');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is boolean as draft-07', () => {
        const actual = selectSchemaType(true);
        assert.equal(actual.type, 'Draft07');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is 2019-09', () => {
        const actual = selectSchemaType({
            $id: '/test/draft/2019-09',
            $schema: 'https://json-schema.org/draft/2019-09/schema',
        });
        assert.equal(actual.type, '2019-09');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is 2020-12', () => {
        const actual = selectSchemaType({
            $id: '/test/draft/2020-12',
            $schema: 'https://json-schema.org/draft/2020-12/schema#',
        });
        assert.equal(actual.type, '2020-12');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is swagger', () => {
        const actual = selectSchemaType({
            swagger: '2.0',
            info: {
                title: 'test-swagger',
                version: '0.1.0',
            },
            paths: {},
        });
        assert.equal(actual.type, 'Draft04');
        assert.equal(actual.openApiVersion, 2);
    });
    it('schema is OpenAPI 3', () => {
        const actual = selectSchemaType({
            openapi: '3.0.1',
            info: {
                title: 'test-openapi3',
                version: '0.1.0',
            },
            paths: {},
        });
        assert.equal(actual.type, 'Draft07');
        assert.equal(actual.openApiVersion, 3);
    });
    it('schema is latest', () => {
        const actual = selectSchemaType({
            $id: '/test/latest',
            $schema: 'https://json-schema.org/schema',
        });
        assert.equal(actual.type, 'Latest');
        assert.equal(actual.openApiVersion, undefined);
    });

    it('schema is unknown 1', () => {
        const actual = selectSchemaType({
            $id: '/test/invalid',
            $schema: 'http://schema.example.com/schema',
        });
        assert.equal(actual.type, 'Draft04');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is unknown 2', () => {
        const actual = selectSchemaType({
            $id: '/test/invalid',
            $schema: ' http://json-schema.org/draft-07/schema# ',
        });
        assert.equal(actual.type, 'Draft04');
        assert.equal(actual.openApiVersion, undefined);
    });
    it('schema is invalid', () => {
        assert.throws(() => {
            selectSchemaType('invalid schema' as any);
        });
    });
});
