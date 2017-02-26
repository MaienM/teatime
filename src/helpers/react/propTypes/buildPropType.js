import _ from 'lodash';

function buildPropType(builder) {
	const optional = (...args) => builder(...args)(...args);
	const required = (...args) => builder(...args).isRequired(...args);
	optional.isRequired = required.isRequired = required;
	optional.isOptional = required.isOptional = optional;
	return optional;
}

buildPropType.transform = _.identity;

export default buildPropType;
