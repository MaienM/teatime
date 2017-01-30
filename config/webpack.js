const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');
module.exports = {
	// context: root,
	entry: [
		require.resolve('webpack-dev-server/client') + '?/',
		require.resolve('webpack/hot/dev-server'),
		path.join(root, 'src', 'index.js'),
	],
	output: {
		path: path.join(root, 'public'),
		publicPath: '/',
		filename: 'app.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				loader: 'style!css?importLoaders=1'
			},
		],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
};
