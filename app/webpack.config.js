const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,
    context: __dirname,
    entry: {
        main: './src/index.js',
        //builder: './src/js/builder.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].bundle.js'
    },
};