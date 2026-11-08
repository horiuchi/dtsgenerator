const shared = require('@dtsgenerator/eslint-config');

module.exports = [
    ...shared,
    { ignores: ['test/snapshots/**'] },
    { rules: { '@typescript-eslint/no-explicit-any': 'off' } },
    {
        files: ['**/*_test.ts'],
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-implied-eval': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/unbound-method': 'off',
        },
    },
];
