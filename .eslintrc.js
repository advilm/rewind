module.exports = {
	'env': {
		'commonjs': true,
		'es2020': true,
		'browser': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 11,
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
		"space-unary-ops": 2
	}
};