import assert from 'assert';
import * as jp from '../src/jsonPointer';

describe('json pointer test', () => {
    describe('get function', () => {
        const object = {
            a: 1,
            b: {
                c: {
                    d1: 2,
                    d2: 3,
                },
                e: 'hoge',
            },
            array: [1, 2, 3, 4, 5],
            arr: [
                { a: 3, b: 4 },
                { a: 4, b: 5, c: 6 },
                { a: 5, c: 7 },
            ],
        };

        it('success to get value', () => {
            assert.strictEqual(jp.get(object, ['a']), 1);
            assert.strictEqual(jp.get(object, ['b', 'c', 'd2']), 3);
            assert.strictEqual(jp.get(object, ['b', 'e']), 'hoge');
            assert.strictEqual(jp.get(object, ['array', '2']), 3);
            assert.strictEqual(jp.get(object, ['arr', '0', 'a']), 3);
            assert.strictEqual(jp.get(object, ['arr', '1', 'a']), 4);
            assert.strictEqual(jp.get(object, ['arr', '2', 'a']), 5);
        });
        it('success to get object', () => {
            assert.deepStrictEqual(jp.get(object, ['b', 'c']), {
                d1: 2,
                d2: 3,
            });
            assert.deepStrictEqual(jp.get(object, ['array']), [1, 2, 3, 4, 5]);
            assert.deepStrictEqual(jp.get(object, ['arr', '0']), {
                a: 3,
                b: 4,
            });
            assert.deepStrictEqual(jp.get(object, ['arr', '2']), {
                a: 5,
                c: 7,
            });
        });
        it('fail to get target path', () => {
            assert.strictEqual(jp.get(object, ['z']), undefined);
            assert.strictEqual(jp.get(object, ['a', 'b', 'c', 'd']), undefined);
            assert.strictEqual(jp.get(object, ['array', '999']), undefined);
            assert.strictEqual(jp.get(object, ['array', '1', 'a']), undefined);
            assert.strictEqual(jp.get(object, ['arr', '0', 'c']), undefined);
            assert.strictEqual(jp.get(object, ['arr', '2', 'b']), undefined);
        });
    });

    describe('set function', () => {
        const object = {
            a: 1,
            b: {
                c: {
                    d1: 2,
                    d2: 3,
                },
                e: 'hoge',
            },
            array: [1, 2, 3, 4, 5],
            arr: [
                { a: 3, b: 4 },
                { a: 4, b: 5, c: 6 },
                { a: 5, c: 7 },
            ],
        };

        it('success to change value 1', () => {
            const path = ['a'];
            assert.strictEqual(jp.get(object, path), 1);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });
        it('success to change value 2', () => {
            const path = ['b', 'c', 'd1'];
            assert.strictEqual(jp.get(object, path), 2);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });
        it('success to change value 3', () => {
            const path = ['array', '1'];
            assert.strictEqual(jp.get(object, path), 2);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });
        it('success to change value 3', () => {
            const path = ['arr', '1', 'b'];
            assert.strictEqual(jp.get(object, path), 5);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });
        it('success to add value 1', () => {
            const path = ['b', 'x'];
            assert.strictEqual(jp.get(object, path), undefined);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });
        it('success to add value 2', () => {
            const path = ['b', 'z', 'zz', 'zzz'];
            assert.strictEqual(jp.get(object, path), undefined);
            jp.set(object, path, 100);
            assert.strictEqual(jp.get(object, path), 100);
        });

        it('fail to set value because of null path', () => {
            const path: string[] = [];
            jp.set(object, path, 100);
            assert.notStrictEqual(object, 100);
        });
    });

    describe('parse function', () => {
        it('normal case', () => {
            assert.deepStrictEqual(jp.parse(''), []);
            assert.deepStrictEqual(jp.parse('/'), ['']);
            assert.deepStrictEqual(jp.parse('/a/b/c'), ['a', 'b', 'c']);
            assert.deepStrictEqual(jp.parse('/hoge/0/fuga/1'), [
                'hoge',
                '0',
                'fuga',
                '1',
            ]);
        });
        it('tilded path case', () => {
            assert.deepStrictEqual(jp.parse('/~0user/~1/0'), [
                '~user',
                '/',
                '0',
            ]);
        });

        it('invalid format', () => {
            assert.throws(
                () => jp.parse('hoge'),
                /^Error: Invalid JSON-Pointer format:/
            );
        });
    });
});
