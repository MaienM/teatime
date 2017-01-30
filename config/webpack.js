const path = require('path');

const root = path.resolve(__dirname, '..');
module.exports = {
	// context: root,
	entry: path.join(root, 'src', 'index.js'),
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
		],
	},
};
