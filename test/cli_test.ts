import assert from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('CLI compatibility', () => {
    it('accepts positional schema files', () => {
        const fixtureDir = path.join(
            __dirname,
            'snapshots/json-schema-draft-04/advanced-example',
        );
        const input = path.join(fixtureDir, 'advanced_example.json');
        const expected = fs.readFileSync(
            path.join(fixtureDir, '_expected.d.ts'),
            'utf8',
        );

        const result = spawnSync(
            process.execPath,
            ['--require', 'ts-node/register', 'src/cli.ts', input],
            {
                cwd: path.join(__dirname, '..'),
                encoding: 'utf8',
                env: { ...process.env, TS_NODE_FILES: 'true' },
            },
        );

        assert.strictEqual(result.status, 0, result.stderr);
        assert.strictEqual(result.stdout, `${expected}\n`);
    });
});
