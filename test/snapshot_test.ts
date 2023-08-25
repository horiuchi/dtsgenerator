import assert from 'assert';
import fs from 'fs';
import path from 'path';
import dtsgenerator from '../src/core';
import { clearToDefault, Config, setConfig } from '../src/core/config';
import { parseFileContent, parseSchema } from '../src/core/type';

const fixturesDir = path.join(__dirname, 'snapshots');
const expectedFileName = '_expected.d.ts';
const configFileName = '_config.json';
const reservedFiles = [expectedFileName, configFileName];
const skipTestFileName = '_skip_test';

describe('Snapshot testing', () => {
    afterEach(() => {
        clearToDefault();
    });

    fs.readdirSync(fixturesDir).map((typeName) => {
        fs.readdirSync(path.join(fixturesDir, typeName)).map((caseName) => {
            const normalizedTestName = caseName.replace(/-/g, ' ');
            it(`Test ${typeName} ${normalizedTestName}`, async function () {
                const fixtureDir = path.join(fixturesDir, typeName, caseName);
                if (fs.existsSync(path.join(fixtureDir, skipTestFileName))) {
                    this.skip();
                    return;
                }

                const expectedFilePath = path.join(
                    fixtureDir,
                    expectedFileName,
                );
                const configFilePath = path.join(fixtureDir, configFileName);
                const config: Partial<Config> = fs.existsSync(configFilePath)
                    ? require(configFilePath)
                    : {};

                setConfig(config);

                const filePaths = fs.readdirSync(fixtureDir);
                const contents = filePaths
                    .filter((f) => !reservedFiles.includes(f))
                    .map((f) => path.join(fixtureDir, f))
                    .map((file) => {
                        const data = fs.readFileSync(file, {
                            encoding: 'utf-8',
                        });
                        const content = parseFileContent(data, file);
                        return parseSchema(content);
                    });
                const actual = await dtsgenerator({ contents });

                // When we do `UPDATE_SNAPSHOT=1 npm test`, update snapshot data.
                if (process.env.UPDATE_SNAPSHOT) {
                    fs.writeFileSync(expectedFilePath, actual);
                    this.skip();
                    return;
                }
                const expected = fs.readFileSync(expectedFilePath, {
                    encoding: 'utf-8',
                });
                assert.strictEqual(actual, expected, `${fixtureDir} ${actual}`);
            });
        });
    });
});
