import fs from 'fs';
import path from 'path';
import assert from 'power-assert';
import dtsgenerator from '../src/';
import opts, { clear } from '../src/commandOptions';

const fixturesDir = path.join(__dirname, 'snapshots');
const expectedFileName = '_expected.d.ts';

describe('Snapshot testing', () => {
    afterEach(() => {
        clear();
    });

    fs.readdirSync(fixturesDir).map((typeName) => {
        fs.readdirSync(path.join(fixturesDir, typeName)).map((caseName) => {
            const normalizedTestName = caseName.replace(/-/g, ' ');
            it(`Test ${typeName} ${normalizedTestName}`, async function() {
                const fixtureDir = path.join(fixturesDir, typeName, caseName);
                const filePaths = fs.readdirSync(fixtureDir);
                const expectedFilePath = path.join(fixtureDir, expectedFileName);

                opts.files = filePaths.filter((f) => f !== expectedFileName).map((f) => path.join(fixtureDir, f));
                const actual = await dtsgenerator();

                // UPDATE_SNAPSHOT=1 npm test で呼び出したときはスナップショットを更新
                if (processor.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, actual);
                    this.skip(); // スキップ
                    return;
                }
                // inputとoutputを比較する
                const expected = fs.readFileSync(expectedFilePath, { encoding: 'utf-8' });
                assert.equal(actual, expected, `
${fixtureDir}
${actual}
`);
            });
        });
    });
});
