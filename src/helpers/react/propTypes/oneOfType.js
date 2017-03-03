import _ from 'lodash';
import requiredOptionalAsArg from './requiredOptionalAsArg';

function oneOfType(options) {
	const propType = (checker, ...args) => {
		// Try all options
		const errors = _.map(options, (o) => _.get(o, checker, o)(...args));

		// If any of them worked, stop
		if (!_.every(errors)) {
			return null;
		}

		// Remove all errors that are just 'unexpected type'
		const usefulErrors = _.reject(errors, (e) => /type.*expected/.test(e.message)) || errors;

		// Return a combined error
		return new Error(_.map(usefulErrors, 'message').join(' or '));
	};

	return requiredOptionalAsArg(propType);
}

oneOfType.transform = _.identity;

export default oneOfType;
