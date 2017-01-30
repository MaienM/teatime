const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const { postgraphql } = require('postgraphql');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const root = path.join(__dirname, '..');
const ENV = process.env.NODE_ENV || 'development'
const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

function startAppServer() {
	return new Promise((resolve, reject) => {
		const config = require(path.join(root, 'config', 'webpack.js'));
		const packed = webpack(config);
		const server = new WebpackDevServer(packed, {
			contentBase: config.output.path,
			proxy: {
				'/graphql': `http://localhost:${GRAPHQL_PORT}`,
				'/graphiql': `http://localhost:${GRAPHQL_PORT}`,
			},
			publicPath: '/',
			stats: {
				colors: true,
			},
			noInfo: true,
			hot: true,
			// inline: true,
		});
		server.use('/', express.static(config.output.path));
		server.listen(APP_PORT, () => {
			console.log(`App is now running on http://localhost:${APP_PORT}`);
			resolve(server);
		});
	});
}

function startGraphQLServer() {
	return new Promise((resolve, reject) => {
		const config = require(path.join(root, 'config', 'database.js'))[ENV];
		const graphQLApp = express();
		graphQLApp.use(postgraphql(config.database, config.database.schema, config.postgraphql));
		const server = graphQLApp.listen(GRAPHQL_PORT, () => {
			console.log(`GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`);
			resolve(server);
		});
	});
}

function buildSchema() {
	return new Promise((resolve, reject) => {
		exec('npm run build-schema', (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

// Compile the schema
buildSchema().then((output) => {
	console.log(output);

	// Start the servers.
	return Promise.all([
		startAppServer(),
		startGraphQLServer(),
	]);
}).then(() => {
	console.log('Ready!');
}).catch((err) => {
	console.error('Something went wrong', err);
});
