const _ = require('lodash');
const chokidar = require('chokidar');
const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const { postgraphql } = require('postgraphql');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

const ROOT = path.resolve(__dirname, '..');
const CONFIG_APP = path.join(ROOT, 'config', 'webpack.js');
const CONFIG_DB = path.join(ROOT, 'config', 'database.js');

function loadConfig(configPath) {
	delete require.cache[configPath];
	return require(configPath);
}

function startAppServer() {
	return new Promise((resolve, reject) => {
		const config = loadConfig(CONFIG_APP);
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
		const config = loadConfig(CONFIG_DB);
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
function restartApp() {
	return stopServer(appServer && appServer.listeningApp)
		.then(() => startAppServer())
		.then((server) => {
			appServer = server;
		}).catch((err) => {
			console.error(err);
			process.exit(1);
		});
}

let graphQLServer;
function restartGraphQL() {
	return stopServer(graphQLServer)
		.then(() => startGraphQLServer())
		.then((server) => {
			graphQLServer = server;
		}).catch((err) => {
			console.error(err);
			process.exit(1);
		});
}

const watcherOptions = {
	awaitWriteFinish: true,
};

// Restart the app server on config and/or schema changes
const appWatcher = chokidar.watch(CONFIG_APP, watcherOptions);
appWatcher.on('add change', (path) => {
	console.log(`${path} changed, restarting.`);
	restartApp()
		.then(() => { console.log('Ready!'); });
});

// Restart the graphql server on config changes
const gqlWatcher = chokidar.watch(CONFIG_DB, watcherOptions);
gqlWatcher.on('change', (path) => {
	console.log(`${path} changed, restarting.`);

	// Redo the watch list for the app
	appWatcher.unwatch('*');
	appWatcher.add([CONFIG_APP, loadConfig(CONFIG_DB).postgraphql.exportJsonSchemaPath]);

	// Restart the graphql server
	restartGraphQL()
		.then(() => { console.log('Ready!'); });
});

// Start the servers
restartGraphQL()
	.then(() => restartApp())
	.then(() => { console.log('Ready!'); });
