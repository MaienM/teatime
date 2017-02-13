const path = require('path');
const root = path.resolve(__dirname, '..');

module.exports = {
	database: {
		user: process.env.POSTGRES_ENV_POSTGRES_USER,
		password: process.env.POSTGRES_ENV_POSTGRES_PASSWORD, 
		database: process.env.POSTGRES_ENV_POSTGRES_DB,
		host: process.env.POSTGRES_PORT_5432_TCP_ADDR,
		port: process.env.POSTGRES_PORT_5432_TCP_PORT,
		schema: 'public',
	},
	postgraphql: {
		classicIds: true,
		graphiql: true,
		exportJsonSchemaPath: path.join(root, 'data', 'schema.json'),
		exportGqlSchemaPath: path.join(root, 'data', 'schema.graphql'),
	},
};
