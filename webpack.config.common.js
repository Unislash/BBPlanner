const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require('terser-webpack-plugin');

const outputDirectory = 'dist';

const gplInclude = fs.readFileSync('./gpl_include.txt', 'utf8');

module.exports = env => {
    const withAnalyzer = toBoolOrDefault(env, "withAnalyzer", false);

    let dynamicPlugins = [];
    if (withAnalyzer) {
        console.log("Running build with analyzers...");
        // WebpackBundleAnalyzer: a useful treemap view of bundles. Will open a report automatically when built.
        dynamicPlugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: "../output/bundle-analyzer-report.html",
                defaultSizes: "stat",
                openAnalyzer: true,
            })
        );
    }

    return {
        entry: {
            main: './src/index.tsx'
        },
        target: "web",
        output: {
            path: path.resolve(__dirname, outputDirectory),
            filename: '[name].bundle.[contenthash].js',
            chunkFilename: `[name].bundle.[chunkhash].js`,
        },
        optimization: {
            splitChunks: {
                // Split all the chunks
                chunks: "all",
                // HTTP 2.0 browsers don't have concurrent request limits anymore!
                // Buuuut we're still on HTTP1.1 because lack of https. Disabling.
                // maxInitialRequests: Infinity,
                // Try to make chunks that will be less than 1MB (uncompressed, unminified), if possible
                // Note: reducing this will split chunks up even more, but probably isn't necessary
                maxSize: 1000000,
                // For modules in node_modules, group chunks by each module and make the
                // chunk names readable.
                // Disabled until we can use HTTP 2.0
                // cacheGroups: {
                //     vendor: {
                //         test: /[\\/]node_modules[\\/]/,
                //         name(module) {
                //             // Match either a `@smartsheet/<package>`, or any package with no slashes in its name
                //             const packageNameMatch = module.context.match(
                //                 /node_modules[\/\\](@smartsheet[\/\\][\w-]+|[@\w-]+)/
                //             );
                //
                //             return packageNameMatch ? `npm.${packageNameMatch[1]}` : "reactApp";
                //         },
                //     },
                // },
            },
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: /@license/i,
                        },
                    },
                    extractComments: {
                        condition: /@license/i,
                        banner: () => gplInclude,
                    },
                }),
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    use: [
                        'ts-loader',
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
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 1024 * 50/*kb*/
                        }
                    },
                },
            ]
        },
        plugins: [
            ...dynamicPlugins,
            new CleanWebpackPlugin([outputDirectory]),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: './index.html',
                favicon: './favicon.png',
                chunks: ["main"]
            }),
            new HtmlWebpackPlugin({
                filename: "error.html",
                template: './error.html',
                chunks: []
            })
        ]
    };
};

const toBoolOrDefault = (env, property, defaultValue) => {
    return env && env.hasOwnProperty(property)
        ? env[property].toLowerCase() === "true"
        : defaultValue;
};