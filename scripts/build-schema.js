const { createPostGraphQLSchema } = require('postgraphql');
const { introspectionQuery, printSchema } = require('graphql/utilities');
const { graphql } = require('graphql');
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const config = require(path.join(__dirname, '..', 'config', 'database.js'));

console.log(chalk.green('Generating schema from database...'));
createPostGraphQLSchema(config.database, config.database.schema, config.postgraphql).then((schema) => {
	// Make sure the data directory exists
	const dataPath = path.join(__dirname, '..', 'data');
	try {
		fs.mkdirSync(dataPath);
	} catch (Error) {}

	return Promise.all([
		// Human-readable
		fs.writeFileAsync(
			path.join(dataPath, 'schema.graphql'),
			printSchema(schema)
		),

		// Machine-readable
		graphql(schema, introspectionQuery).then((result) => {
			return fs.writeFileAsync(
				path.join(dataPath, 'schema.json'),
				JSON.stringify(result, null, 2)
			);
		}),
	])
}).then(() => {
	console.log(chalk.green('Done!'));
}).catch((err) => {
	console.error(chalk.red('Something went wrong'), err);
});
