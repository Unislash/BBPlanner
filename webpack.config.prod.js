const {merge} = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = env => {
    return merge(common(env), {
        mode: 'production',
    });
};