import React from 'react';
import oneOfType from './oneOfType';

const innerElement = oneOfType([
	React.PropTypes.element,
	React.PropTypes.string,
]);

const element = oneOfType([
	innerElement,
	React.PropTypes.arrayOf(innerElement),
]);

element.transform = (v) => [].concat(v);

export default element;
