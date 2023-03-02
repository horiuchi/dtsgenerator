import assert from 'assert';
import { checkValidMIMEType } from '../../src/core/utils';

describe('checkValidMIMEType test', () => {
    it('MIME type is plain text', () => {
        const mime = 'text/plain';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is html', () => {
        const mime = 'text/html';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is html with charset', () => {
        const mime = 'Text/HTML; charset=utf-8';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });

    it('MIME type is svg', () => {
        const mime = 'image/svg+xml';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is png', () => {
        const mime = 'image/png';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is tiff', () => {
        const mime = 'image/tiff';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });

    it('MIME type is form urlencoded', () => {
        const mime = 'application/x-www-form-urlencoded';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is octet stream', () => {
        const mime = 'application/octet-stream';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is multipart form data', () => {
        const mime = 'multipart/form-data';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });

    it('MIME type is json', () => {
        const mime = 'application/json';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is geojson', () => {
        const mime = 'application/geo+json';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is json5', () => {
        const mime = 'application/json5';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is webmanifest', () => {
        const mime = 'application/manifest+json';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is json with parameters', () => {
        const mime = 'application/json; charset=utf-8; version=1';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });

    it('MIME type is jwt', () => {
        const mime = 'application/jwt';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
    it('MIME type is Passbook', () => {
        const mime = 'application/vnd.apple.pkpass';
        const actual = checkValidMIMEType(mime);
        assert.equal(actual, true, mime);
    });
});
