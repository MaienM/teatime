import React from 'react';

const innerElement = React.PropTypes.oneOfType([
	React.PropTypes.element,
	React.PropTypes.string,
]);

const element = React.PropTypes.oneOfType([
	innerElement,
	React.PropTypes.arrayOf(innerElement),
]);

element.transform = (v) => [].concat(v);

export default element;
