const _ = require('lodash');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const { postgraphql } = require('postgraphql');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const root = path.join(__dirname, '..');
const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

function loadConfig(name) {
	const configPath = path.join(root, 'config', name);
	delete require.cache[configPath];
	return require(configPath);
}

function startAppServer() {
	return new Promise((resolve, reject) => {
		const config = loadConfig('webpack.js');
		const server = new WebpackDevServer(webpack(config), _.merge({}, config.devServer, {
			proxy: {
				'/graphql': `http://localhost:${GRAPHQL_PORT}`,
				'/graphiql': `http://localhost:${GRAPHQL_PORT}`,
				'/_postgraphql': `http://localhost:${GRAPHQL_PORT}`,
			},
		}));
		server.listen(APP_PORT, () => {
			console.log(`App is now running on http://localhost:${APP_PORT}`);
			resolve(server);
		});
	});
}

function startGraphQLServer() {
	return new Promise((resolve, reject) => {
		const config = loadConfig('database.js');
		const server = express();
		server.use(postgraphql(config.database, config.database.schema, config.postgraphql));
		const instance = server.listen(GRAPHQL_PORT, () => {
			console.log(`GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`);
			resolve(instance);
		});
	});
}

function stopServer(server) {
	if (server) {
		return new Promise((resolve, reject) => server.close(resolve));
	}
	return Promise.resolve();
}

let appServer;
let graphQLServer;
function restart() {
	// Shut down the servers
	return Promise.all([
		stopServer(appServer && appServer.listeningApp),
		stopServer(graphQLServer),
	]).then(() => {
		// Start the servers.
		return Promise.all([
			startAppServer(),
			startGraphQLServer(),
		]);
	}).then((servers) => {
		// Store the new server instances
		appServer = servers[0];
		graphQLServer = servers[1];
		console.log('Ready!');
	}).catch((err) => {
		console.error(err);
		process.exit(1);
	});
}

const watcher = chokidar.watch(path.join(root, 'config', '{database,webpack}.js'));
watcher.on('change', (path) => {
	console.log(`${path} changed, restarting.`);
	restart();
});
restart();
