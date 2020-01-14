module.exports = function (api) {
    api.assertVersion('^7.7');

    api.cache(false);

    const plugins = [
        ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ['@babel/plugin-proposal-optional-chaining'],
        ['@babel/plugin-transform-runtime'],
        ['@babel/plugin-proposal-private-methods']
    ];

    return { plugins };
};