import fs from 'fs';
import path from 'path';
import assert from 'power-assert';
import { clear } from '../src/commandOptions';
import dtsgenerator from '../src/core';
import { parseFileContent } from '../src/utils';

const fixturesDir = path.join(__dirname, 'snapshots');
const expectedFileName = '_expected.d.ts';
const commandInputFileName = '_input.json';
const reservedFiles = [
    expectedFileName,
    commandInputFileName,
];

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
                const commandInputFilePath = path.join(fixtureDir, commandInputFileName);
                const commandInput = fs.existsSync(commandInputFilePath) ? require(commandInputFilePath) : {};

                const files = filePaths.filter((f) => !reservedFiles.includes(f)).map((f) => path.join(fixtureDir, f));
                const contents = files.map((file) => ({
                    file,
                    content: fs.readFileSync(file, { encoding: 'utf-8' }),
                })).map(({ file, content }) => parseFileContent(content, file));
                const actual = await dtsgenerator({ contents, ...commandInput });

                // When we do `UPDATE_SNAPSHOT=1 npm test`, update snapshot data.
                if (process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, actual);
                    this.skip();
                    return;
                }
                const expected = fs.readFileSync(expectedFilePath, { encoding: 'utf-8' });
                assert.equal(actual, expected, `
${fixtureDir}
${actual}
`);
            });
        });
    });
});
