import _ from 'lodash';
import requiredOptionalAsArg from './requiredOptionalAsArg';

function buildPropType(builder) {
	const propType = (checker, ...args) => _.get(builder, checker, builder)(...args)(...args);
	return requiredOptionalAsArg(propType);
}

buildPropType.transform = _.identity;

export default buildPropType;
