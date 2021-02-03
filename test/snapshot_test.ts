import assert from 'assert';
import fs from 'fs';
import path from 'path';
import dtsgenerator from '../src/core';
import { clearToDefault, setConfig } from '../src/core/config';
import { parseFileContent, parseSchema } from '../src/core/type';

const SUFFIX_STRICT = '_strict';

const fixturesDir = path.join(__dirname, 'snapshots');

const getExpectedFileName = (suffix?: string) =>
    `_expected${suffix !== undefined ? suffix : ''}.d.ts`;
const getConfigFileName = (suffix?: string) =>
    `_config${suffix !== undefined ? suffix : ''}.json`;

async function runSnapshotTest(
    this: Mocha.Context,
    filePaths: string[],
    fixtureDir: string,
    expectedFilePath: string,
    configFilePath: string
) {
    const config =
        configFilePath !== undefined && fs.existsSync(configFilePath)
            ? require(configFilePath)
            : {};

    setConfig(config);
    const contents = filePaths.map((file) => {
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
}

describe('Snapshot testing', () => {
    afterEach(() => {
        clearToDefault();
    });

    fs.readdirSync(fixturesDir).map((typeName) => {
        fs.readdirSync(path.join(fixturesDir, typeName)).map((caseName) => {
            const normalizedTestName = caseName.replace(/-/g, ' ');
            const fixtureDir = path.join(fixturesDir, typeName, caseName);

            const getFilePath = (p: string) => path.join(fixtureDir, p);

            const expectedFilePath = getFilePath(getExpectedFileName());
            const configFilePath = getFilePath(getConfigFileName());

            const expectedStrictFilePath = getFilePath(
                getExpectedFileName(SUFFIX_STRICT)
            );
            const configStrictFilePath = getFilePath(
                getConfigFileName(SUFFIX_STRICT)
            );

            const hasStrictTest = (function () {
                try {
                    return fs.existsSync(expectedStrictFilePath);
                } catch (err) {
                    if (err.code !== 'ENOENT') throw err;
                    return false;
                }
            })();

            const reservedFiles = [
                expectedFilePath,
                configFilePath,
                ...(hasStrictTest
                    ? [expectedStrictFilePath, configStrictFilePath]
                    : []),
            ];

            const filePaths = fs
                .readdirSync(fixtureDir)
                .map((f) => getFilePath(f))
                .filter((f) => !reservedFiles.includes(f));

            it(`Test ${typeName} ${normalizedTestName}`, async function () {
                await runSnapshotTest.bind(this)(
                    filePaths,
                    fixtureDir,
                    expectedFilePath,
                    configFilePath
                );
            });

            if (hasStrictTest) {
                it(`Test ${typeName} ${normalizedTestName}, strict`, async function () {
                    await runSnapshotTest.bind(this)(
                        filePaths,
                        fixtureDir,
                        expectedStrictFilePath,
                        configStrictFilePath
                    );
                });
            }
        });
    });
});
