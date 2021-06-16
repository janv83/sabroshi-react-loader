var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/SabroshiLoader.js',
    output: {
        path: path.resolve('lib'),
        filename: 'SabroshiLoader.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'lib')],
                exclude: /node_modules/,
                use: [{
                loader:'babel-loader'
            }]
            }
        ]
    },
    externals: {
        'react': 'react'
    }
}