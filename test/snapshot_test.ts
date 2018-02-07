import fs from 'fs';
import path from 'path';
import assert from 'power-assert';
import dtsgenerator from '../src/';
import opts, { clear } from '../src/commandOptions';

const fixturesDir = path.join(__dirname, 'snapshots');

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
                const expectedFile = filePaths.splice(filePaths.findIndex((file) => /\.d\.ts$/.test(file)), 1)[0];
                const expectedFilePath = path.join(fixtureDir, expectedFile);

                opts.files = filePaths.map((f) => path.join(fixtureDir, f));
                const actual = await dtsgenerator();

                // UPDATE_SNAPSHOT=1 npm test で呼び出したときはスナップショットを更新
                if (process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, JSON.stringify(actual, null, 4));
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
