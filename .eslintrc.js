module.exports = {
    parser: '@typescript-eslint/parser',
    // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020,
        // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',
        // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },

    env: {
        node: true,
        browser: true,
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        // Tells eslint how to resolve imports
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },

    extends: [
        // By extending from a plugin config, we can get recommended rules without having to add them manually.
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
        'plugin:@typescript-eslint/recommended',
        // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
        // Make sure it's always the last config, so it gets the chance to override other configs.
        'eslint-config-prettier',
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@tanstack/query/exhaustive-deps': 'error',
        '@tanstack/query/prefer-query-object-syntax': 'error',
        'react/display-name': 'off',
        'react/no-unescaped-entities': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'prettier/prettier': 'off',
    },
    plugins: ['react', 'prettier', '@tanstack/query'],
};
