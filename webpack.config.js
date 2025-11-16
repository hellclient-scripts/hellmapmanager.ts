//webpack.config.js
const path = require('path');

module.exports = {
    mode: "development",
    devtool: false,
    target:["es6"],
    entry: {
        main: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "hmm.umd.js",// <--- Will be compiled to this single file
        // library:"HellMapManager",
        chunkFormat: 'commonjs',
        libraryTarget: "umd"
    },
    resolve: {
        alias:{
            "@include/*": path.resolve(__dirname, 'include/*'),
        },
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json"
                }
            }
        ]
    }
};