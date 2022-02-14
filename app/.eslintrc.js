module.exports = {
    root: true,
    env: {
        node: true,
        'vue/setup-compiler-macros': true
    },
    'extends': [
        'plugin:vue/vue3-recommended',
        'eslint:recommended'
    ],
    parser: 'vue-eslint-parser',
    rules: {
        'no-console': 'off',
        'eqeqeq': [0],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'generator-star-spacing': 'off',
        'no-mixed-operators': 0,
        'vue/attribute-hyphenation': 0,
        'vue/html-self-closing': 0,
        'vue/component-name-in-template-casing': 0,
        'vue/html-closing-bracket-spacing': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/no-unused-components': 0,
        'vue/multiline-html-element-content-newline': 0,
        'vue/no-use-v-if-with-v-for': 0,
        'vue/html-closing-bracket-newline': ['error', {
            'singleline': 'never',
            'multiline': 'never'
        }],
        'vue/no-parsing-error': 0,
        'no-tabs': 0,
        'quotes': [
            2,
            'single',
            {
                'avoidEscape': true,
                'allowTemplateLiterals': true
            }
        ],
        'semi': [
            2,
            'never',
            {
                'beforeStatementContinuationChars': 'never'
            }
        ],
        'vue/max-attributes-per-line': [2, {
            'singleline': 10,
            'multiline': {
                'max': 1
            }
        }],
        'no-delete-var': 2,
        'prefer-const': [
            2,
            {
                'ignoreReadBeforeAssign': false
            }
        ],
        'template-curly-spacing': 'off',
        'indent': 'off',
        'vue/require-default-prop': 'off',
        'no-trailing-spaces': 2,
        'no-unexpected-multiline': 2,
        'comma-dangle': [2, 'never'],
        'no-fallthrough': 2,
        'no-useless-escape': 0,
        'block-spacing': [1, 'never'],
        'no-mixed-spaces-and-tabs': 2,
        'space-in-parens': [2, 'never'],
        'no-unused-vars': [2, {
            'vars': 'all',
            'args': 'none'
        }],
        'vue/multi-word-component-names': 0,
        'vue/v-on-event-hyphenation': 0
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
}
