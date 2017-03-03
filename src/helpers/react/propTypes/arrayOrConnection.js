import _ from 'lodash';
import React from 'react';
import requiredOptionalAsArg from './requiredOptionalAsArg';

function arrayOrConnection(node) {
	const options = [
		React.PropTypes.arrayOf(node),
		React.PropTypes.shape({
			edges: React.PropTypes.arrayOf(React.PropTypes.shape({ node })).isRequired,
		}),
	];
	const propType = (checker, ...args) => {
		const errors = _.map(options, (o) => _.get(o, checker, o)(...args));
		// One of the options worked
		if (!_.every(errors)) {
			return null;
		}
		// Try to get the most relevant error(s)
		const usefulErrors = _.reject(errors, (e) => /type.*expected/.test(e.message));
		return new Error(_.map(usefulErrors || errors, 'message').join(' or '));
	};

	return requiredOptionalAsArg(propType);
}

arrayOrConnection.transform = (data) => (_.isArray(data) ? data : _.map(data.edges, 'node'));

export default arrayOrConnection;
