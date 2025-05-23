import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    stylistic.configs.all,
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            // Use 4 space indents
            '@stylistic/indent': ['error', 4],
            // Prefer single quotes
            '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: true }],
            // Prefer non-quoted properties
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            // One-line or multi-line arrays (but not both)
            '@stylistic/array-element-newline': ['error', 'consistent'],
            // One-line no trailing comma or multiline trailing comma
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            // Disable padded block checking
            '@stylistic/padded-blocks': 'off',
            // One-line or multi-line function calls (but not both)
            '@stylistic/function-call-argument-newline': ['error', 'consistent'],
            '@stylistic/space-before-function-paren': 'off',
            // Don't prefer one comment style over another
            '@stylistic/multiline-comment-style': 'off',
            // Prefer a space around object curly brackets
            '@stylistic/object-curly-spacing': ['error', 'always'],
            // One-line or multi-line objects (but not both)
            '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
            // One-line or multi-line ternary (but not both)
            '@stylistic/multiline-ternary': ['error', 'always-multiline'],
            // One-line or multi-line braces (but not both)
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            // Disable lines between class members checking
            '@stylistic/lines-between-class-members': 'off',
            // Require explicit function return types
            '@typescript-eslint/explicit-function-return-type': 'error',
            // Allow all template string auto stringification
            '@typescript-eslint/restrict-template-expressions': 'off',
            // Allow unused variables starting with _
            '@typescript-eslint/no-unused-vars': [
                'error', {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            // Allow () => <void function>
            '@typescript-eslint/no-confusing-void-expression': [
                'error', {
                    ignoreArrowShorthand: true,
                    ignoreVoidOperator: false,
                    ignoreVoidReturningFunctions: false,
                },
            ],
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: '.',
            },
        },
    },
    // Ignore dist/* and any js files
    {
    ignores: [
            'dist/**/*',
            '**/*.mjs',
            'eslint.config.mjs',
            '**/*.js',
        ],
    },
);
