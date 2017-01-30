const _ = require('lodash');

const defaults = {
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
	},
};

module.exports = _.merge({
	development: _.cloneDeep(defaults),
	test: _.cloneDeep(defaults),
	production: _.cloneDeep(defaults),
}, {
	development: {
		// database: {
		// 	database: defaults.database + '_development',
		// },
		postgraphql: {
			graphiql: true,
		},
	},
	test: {
		database: {
			database: defaults.database + '_test',
		},
	},
	production: {
		database: {
			database: defaults.database + '_production',
		},
	},
})
