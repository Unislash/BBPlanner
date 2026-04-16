const { defineConfig } = require("@rsbuild/core");
const { pluginReact } = require("@rsbuild/plugin-react");

const withAnalyzer = process.env.ANALYZE === "true";

module.exports = defineConfig(({ command }) => ({
    plugins: [
        pluginReact({
            swcReactOptions: {
                runtime: "classic",
            },
        }),
    ],
    source: {
        entry: {
            index: "./src/index.tsx",
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
    html: {
        favicon: "./favicon.png",
        template: "./index.html",
    },
    output: {
        copy: [
            {
                from: "./error.html",
                to: "./error.html",
            },
        ],
        dataUriLimit: 50 * 1024,
        distPath: {
            root: "dist",
        },
        legalComments: "linked",
        sourceMap: {
            css: false,
            js: command === "dev" ? "inline-source-map" : false,
        },
    },
    performance: {
        bundleAnalyze: withAnalyzer
            ? {
                  analyzerMode: "static",
                  defaultSizes: "stat",
                  openAnalyzer: true,
                  reportFilename: "../output/bundle-analyzer-report.html",
              }
            : undefined,
    },
}));
