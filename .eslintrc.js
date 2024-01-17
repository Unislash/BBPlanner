module.exports = {
    root: true,
    parser: "@typescript-eslint/parser", // Allows ESLint to understand TypeScript syntax
    parserOptions: {
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
        tsconfigRootDir: ".",
        project: ["./tsconfig.json"],
    },
    env: {
        browser: true,
        node: true,
    },
    plugins: [
        "import",
        "jest",
        "typescript-sort-keys",
        "unused-imports",
        // Plugins that are already included in the `extends` section do not need to be listed here
    ],
    extends: [
        // Recommended set of core rules that report common problems
        // https://eslint.org/docs/rules/
        "eslint:recommended",

        // A recommended configuration that enforces React good practices.
        // https://github.com/jsx-eslint/eslint-plugin-react#list-of-supported-rules
        "plugin:react/recommended",

        // Enforces Rules of Hooks
        // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
        "plugin:react-hooks/recommended",

        // Recommended set of TypeScript rules
        // https://typescript-eslint.io/rules/
        "plugin:@typescript-eslint/recommended",

        // Adds typed linting, but requires a tsc to provide type info.
        // If the lint becomes too slow, consider forking this to a separate eslint thread.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
        "plugin:@typescript-eslint/recommended-requiring-type-checking",

        // Prettier should always be last, so it can turn off any conflicting rules
        // https://github.com/prettier/eslint-config-prettier#installation
        "prettier",
    ],
    ignorePatterns: [
        ".eslintrc.js",
        ".yarn/",
        "babel.config.*",
        ".changeset/",
        "commitlint.config.js",
        "config/",
        "coverage/",
        "dist/",
        "output/",
        "genDocs/",
        "jest.config.js",
        "lingui.config.js",
        "lint-staged.config.js",
        "node_modules/",
        "prettier.config.js",
        "scripts/",
        "storybook-static/",
        "typedoc.*",
        "typedoc-output",
        "webpack.config.*",
        "itemImageMap.ts",
    ],
    rules: {
        // Disable explicit function return types
        // We decided as a team to turn this off since we LOVE the typescript inference.
        // https://typescript-eslint.io/rules/explicit-function-return-type
        "@typescript-eslint/explicit-function-return-type": "off",

        // Disable explicit export return types
        // We decided as a team to turn this off since we LOVE the typescript inference.
        // https://typescript-eslint.io/rules/explicit-module-boundary-types
        "@typescript-eslint/explicit-module-boundary-types": "off",

        // Allow empty functions
        // https://typescript-eslint.io/rules/no-empty-function
        "@typescript-eslint/no-empty-function": "off",

        // Disallow unused variables
        // https://typescript-eslint.io/rules/no-unused-vars
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                // Allow unused vars we prefix with an underscore or name "ignored"
                varsIgnorePattern: "([iI]gnored)|(_\\w+)",
            },
        ],

        // Disable `includes` over `indexOf` suggestions
        // https://typescript-eslint.io/rules/prefer-includes
        "@typescript-eslint/prefer-includes": "off",

        // Allow addition/concatenation of variables of different types
        // We decided to turn this off as a team because we thought it was a plus.
        // https://typescript-eslint.io/rules/restrict-plus-operands
        "@typescript-eslint/restrict-plus-operands": "off",

        // Enforce an ordering for `import` statements
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
        "import/order": [
            "error",
            {
                alphabetize: {
                    order: "asc",
                },
                groups: [
                    "builtin", // Built-in types are first
                    ["external", "internal"], // 'react' | 'lodash/noop'
                    "parent", // ../*
                    "sibling", // ./*
                    "index",
                ],
                "newlines-between": "never",
            },
        ],

        // Focused tests are useful for debugging but should be unfocused before merging (describe.only, it.only, etc.)
        // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-focused-tests.md
        "jest/no-focused-tests": "error",

        // Allow empty functions
        // https://eslint.org/docs/rules/no-empty-function
        "no-empty-function": "off",

        // Disallow unused variables
        // https://eslint.org/docs/rules/no-unused-vars
        "no-unused-vars": [
            "error",
            {
                // Allow unused vars we prefix with an underscore or name "ignored"
                varsIgnorePattern: "([iI]gnored)|(_\\w+)",
            },
        ],

        // Check effect dependencies
        // https://reactjs.org/docs/hooks-rules.html
        "react-hooks/exhaustive-deps": "error",

        // Enforce Rules of Hooks
        // https://reactjs.org/docs/hooks-rules.html
        "react-hooks/rules-of-hooks": "error",

        // Disallow spaces inside of curly braces in JSX attributes
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
        "react/jsx-curly-spacing": [
            "error",
            {
                when: "never",
            },
        ],

        // Disallow spaces around equal signs in JSX attributes
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
        "react/jsx-equals-spacing": ["error", "never"],

        // Allow function binds and arrow functions in React component props
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
        "react/jsx-no-bind": "off",

        // Validate whitespace in and around the JSX opening and closing brackets
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
        "react/jsx-tag-spacing": "error",

        // Prevent missing parentheses around multilines JSX
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
        "react/jsx-wrap-multilines": "error",

        // Prevent usage of Array index in keys
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
        "react/no-array-index-key": "error",

        // We don't use prop types since we're using TypeScript
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
        "react/prop-types": "off",

        // Prevent extra closing tags for components without children
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
        "react/self-closing-comp": "error",

        // Allow React text nodes to have unescaped quotes
        "react/no-unescaped-entities": "off",

        // Require interface keys to be sorted
        // https://github.com/infctr/eslint-plugin-typescript-sort-keys/blob/master/docs/rules/interface.md
        "typescript-sort-keys/interface": [
            "error",
            "asc",
            {
                requiredFirst: true,
            },
        ],

        // Disallow unused es6 module imports
        // https://github.com/sweepline/eslint-plugin-unused-imports
        "unused-imports/no-unused-imports": "error",
    },
    overrides: [
        {
            files: ["*.stories.*"],
            rules: {
                // Hooks are just fine in stories.
                "react-hooks/rules-of-hooks": "off",
                // Hooks are just fine in stories.
                "react-hooks/exhaustive-deps": "off",
            },
        },
        {
            files: ["*.test.*", "*.tests.*"],
            rules: {
                // This occurs frequently when using the `done` callback.
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                // Frequently we create anonymous components in test.
                "react/display-name": "off",
            },
        },
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                // This rule is redundant in TS files
                "no-unused-vars": "off",
            },
        },
    ],
    settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};
