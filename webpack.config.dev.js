const {merge} = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    // devtool: 'source-map',
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
});