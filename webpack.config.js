//webpack.config.js
const path = require('path');

module.exports = {
    mode: "development",
    devtool: false,
    entry: {
        main: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: "hmm.umd.js",// <--- Will be compiled to this single file
        // library:"HellMapManager",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
};