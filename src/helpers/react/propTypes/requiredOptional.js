import _ from 'lodash';

/* eslint-disable no-param-reassign */
function requiredOptional(optional, required) {
	required.isOptional = optional.isOptional = optional;
	required.isRequired = optional.isRequired = required;
	return optional;
}
/* eslint-enable no-param-reassign */

requiredOptional.transform = _.identity;

export default requiredOptional;

