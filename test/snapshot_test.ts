import fs from 'fs';
import path from 'path';
import assert from 'power-assert';
import { clear } from '../src/commandOptions';
import dtsgenerator from '../src/core';
import { parseFileContent } from '../src/utils';

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

                const files = filePaths.filter((f) => f !== expectedFileName).map((f) => path.join(fixtureDir, f));
                const contents = files.map((file) => ({
                    file,
                    content: fs.readFileSync(file, { encoding: 'utf-8' }),
                })).map(({ file, content }) => parseFileContent(content, file));
                const actual = await dtsgenerator({ contents });

                // UPDATE_SNAPSHOT=1 npm test で呼び出したときはスナップショットを更新
                if (process.env.UPDATE_SNAPSHOT) {
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
