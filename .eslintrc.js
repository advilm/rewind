module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'ecmaFeatures': {
            'impliedStrict': true
        }
    },
    'rules': {
        'indent': [
            'error',
            'tab'
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'warn',
            'always'
        ],
        'no-unused-vars': [
            'warn'
        ],
        "space-unary-ops"  : 2
    },
    'overrides': [{
        'files': ['babel.config.js'],
        'rules': {
            'indent': [
                'error',
                4
            ]
        }
    }]
};