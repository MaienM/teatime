const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '..');
const contentBase = path.join(root, 'public');
const publicPath = '/';

module.exports = {
	// context: root,
	entry: [
		require.resolve('webpack/hot/only-dev-server'),
		require.resolve('webpack-dev-server/client') + '?/',
		path.join(root, 'src', 'index.jsx'),
	],
	output: {
		path: contentBase,
		publicPath: publicPath,
		filename: 'app.js',
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: [
					'react-hot-loader',
					'babel-loader',
					'eslint-loader',
				],
			},
			{
				test: /\.s?css$/,
				exclude: /node_modules/,
				loaders: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
	eslint: {
		outputReport: {
			filePath: path.join(root, 'clang.txt'),
			// Custom formatter function that writes in a vim quickfix compatible format
			formatter: (args) => {
				const errors = _(args).map(function(file) {
					return _.map(file.messages, function(message) {
						return [
							path.relative(root, file.filePath),
							':',
							message.line,
							':',
							message.column,
							': ',
							message.message,
							' [',
							message.ruleId,
							']',
						].join('');
					});
				}).flatten().value();
				const output = errors.join('\n');

				// We directly write because webpack doesn't actually write files in dev-server mode
				fs.writeFileSync(path.join(root, 'clang.txt'), output);
				return output;
			}
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: 'cheap-module-source-map',
	devServer: {
		contentBase: contentBase,
		publicPath: publicPath,
		historyApiFallback: true,
		hot: true,
		stats: {
			colors: true,
			assets: false,
			chunks: false,
		},
	},
};
