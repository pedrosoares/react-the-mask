const webpack = require.main.require('webpack');
var path = require('path');
const {name, version} = require('./package.json');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename:  kebabCase(name) + '.js', // my-component.js
        library: camelCase(name), // MyComponent
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'proccess.env.VERSION': JSON.stringify(version) // adds MyComponent.version
        })
    ]
};

// utils

// converts MyComponent to my-component
function kebabCase (s) {
    return s.replace(/([A-Z])([^A-Z\-])/g, (_, a, b) => `-${a}${b}`)
        .toLowerCase()
        .replace(/[\s_-]+/g, '-')
        .replace(/(^\W)|(\W$)/g, '')
}

// converts my-component to MyComponent
function camelCase (s) {
    return s.replace(/([\-_\s]+[a-z])|(^[a-z])/g, $1 => $1.toUpperCase())
        .replace(/[\-_\s]+/g, '')
}