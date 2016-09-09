/*eslint-disable */
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const BUILD_PATH = path.resolve(__dirname, 'build')
const ASSETS_PATH = path.resolve(__dirname, 'assets')
const APP_PATH = path.resolve(__dirname, 'src/app')

const config = {
	debug: true,
	devServer: {
		publicPath: '/build/', //模板、样式、脚本、图片等资源对应的server上的路径
		contentBase: './'
	},
	entry: {
		index: ['./src/app/index'],
		home: ['./src/app/home']
	},
	output: {
		path: BUILD_PATH, //输出到本地目录的配置，模板、样式、脚本、图片等资源的路径都相对于它
		publicPath: './', //输出到文件内部的配置，模板、样式、脚本、图片等资源的路径都相对于它
		filename: 'js/[name].js' //每个页面对应的主js的生成配置
			// chunkFilename: 'js/[id].chunk.js' //chunk生成的配置
	},
	resolve: {
		root: process.cwd(),
		alias: {
			app: 'src/app',
			css: 'src/css',
			assets: 'assets'
		},
		extensions: ['', '.js', '.css', '.jpg', '.png', '.json', '.webp']
	},
	module: {
		loaders: [{
			test: /\.js$/,
			include: APP_PATH,
			loader: 'babel'
		}, {
			test: /\.(css|less)$/,
			loader: ExtractTextPlugin.extract('style', 'css!less')
		}, {
			//html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
			//比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
			test: /\.html$/,
			loader: "html?attrs=img:src img:data-src"
		}, {
			test: /\.(jpg|png|webp)$/,
			loader: 'url?name=images/[name].[ext]&limit=10'
		}, {
			test: /\.json$/,
			loader: 'json'
		}]
	},
	plugins: [
		new ExtractTextPlugin('css/[name].css', {
			allChunks: false
		})
	]
}
//多文件入口，html模版生成
for (const name in config.entry) {
	if (name !== 'lib') {
		config.plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
			// favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
			title: name,
			chunks: [name], //需要引入的chunk，不配置就会引入所有页面的资源
			filename: './' + name + '.html', //生成的html存放路径，相对于path
			template: './src/template/' + name + '.html', //html模板路径
			inject: 'body', //js插入的位置，true/'head'/'body'/false
			hash: true, //为静态资源生成hash值
			minify: { //压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		}))
	}
}


if (process.env.NODE_ENV === 'development') {
	for (const name in config.entry) {
		if (name !== 'lib') {
			config.entry[name].unshift('webpack/hot/only-dev-server')
			config.entry[name].unshift('webpack-dev-server/client?http://localhost:3000')
		}
	}
	config.plugins.unshift(new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify("development")
	}))
	config.plugins.unshift(new webpack.HotModuleReplacementPlugin())
	config.devtool = 'source-map'
}


if (process.env.NODE_ENV === 'production') {
	config.plugins.unshift(new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify("production")
	}))
	config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}))
}

module.exports = config
/*eslint-disable */
