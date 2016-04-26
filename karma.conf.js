var path = require('path');

module.exports = function(config) {
    config.set({
        basePath: '',
        logLevel: config.LOG_INFO,
        singleRun: false,
        autoWatch: true,
        port: 9999,
        colors: true,
        frameworks: ['mocha', 'chai'],
        files: [
            'test/*.test.js'
        ],
        preprocessors: {
            'src/app/**': ['webpack', 'sourcemap', 'coverage'],
            'test/*.test.js': ['webpack', 'sourcemap']
        },
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            'karma-sourcemap-loader',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-mocha-reporter'
        ],
        browsers: ['Chrome'],
        reporters: ['mocha', 'coverage', 'dots'],
        coverageReporter: {
            dir: 'coverage',
            reporters: [{
                type: 'json',
                subdir: '.',
                file: 'coverage.json'
            }, {
                type: 'lcov',
                subdir: '.'
            }, {
                type: 'text-summary'
            }]
        },
        webpack: {
            devtool: 'inline-source-map', //just do inline source maps instead of the defaul
            module: {
                preLoaders: [{
                    test: /\.jsx?$/,
                    loader: 'isparta',
                    exclude: /\/node_modules\//
                }],
                loaders: [{
                    test: /\.jsx?$/,
                    loader: 'babel',
                    exclude: /\/node_modules\//
                }, {
                    test: /\.json$/,
                    loader: 'json'
                }, {
                    test: /\.css$/,
                    loader: 'style!css-loader'
                }, {
                    test: /\.(jpg|png)$/,
                    loader: 'url?name=images/[name].[ext]&limit=51200'
                }]
            },
            externals: {
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};