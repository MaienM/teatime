import _ from 'lodash';
import React from 'react';

function innerNestedShape(shape) {
	return _.mapValues(shape, (v) => {
		if (_.isFunction(v)) return v;
		if (!_.isObject(v)) return v;
		const nested = innerNestedShape(v);
		const isRequired = _(nested).values().map('isRequired').some();
		const nshape = React.PropTypes.shape(nested);
		return isRequired ? nshape.isRequired : nshape;
	});
}

function nestedShape(shape) {
	return React.PropTypes.shape(innerNestedShape(shape));
}

nestedShape.transform = _.identity;

export default nestedShape;
