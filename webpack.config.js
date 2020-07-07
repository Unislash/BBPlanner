const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
    entry: ['./src/index.tsx'],
    target: "web",
    output: {
        path: path.resolve(__dirname, outputDirectory),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    'awesome-typescript-loader',
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
        ]
    },
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    plugins: [
        new CleanWebpackPlugin([outputDirectory]),
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './favicon.png'
        })
    ]
};