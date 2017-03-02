import _ from 'lodash';

function allowNull(propType) {
	const newPropType = (checker, props, propName, ...args) => (
		(!_.isNull(props[propName])) && _.get(propType, checker, propType)(props, propName, ...args)
	);
	const isOptional = _.partial(newPropType, 'isOptional');
	const isRequired = isOptional.isRequired = _.partial(newPropType, 'isRequired');
	isRequired.isOptional = isOptional;
	return isOptional;
}

allowNull.transform = _.identity;

export default allowNull;
