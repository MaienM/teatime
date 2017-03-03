import _ from 'lodash';
import requiredOptionalAsArg from './requiredOptionalAsArg';

function allowNull(propType) {
	const newPropType = (checker, props, propName, ...args) => (
		(!_.isNull(props[propName])) && _.get(propType, checker, propType)(props, propName, ...args)
	);
	return requiredOptionalAsArg(newPropType);
}

allowNull.transform = _.identity;

export default allowNull;
