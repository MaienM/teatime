import _ from 'lodash';
import requiredOptional from './requiredOptional';

function requiredOptionalAsArg(propType) {
	return requiredOptional(
		_.partial(propType, 'isOptional'),
		_.partial(propType, 'isRequired'),
	);
}

requiredOptionalAsArg.transform = requiredOptional.transform;

export default requiredOptionalAsArg;
