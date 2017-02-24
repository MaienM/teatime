import _ from 'lodash';
import React from 'react';

function arrayOrConnection(node) {
	return React.PropTypes.oneOfType([
		React.PropTypes.arrayOf(node),
		React.PropTypes.shape({
			edges: React.PropTypes.arrayOf(React.PropTypes.shape({ node })).isRequired,
		}),
	]);
}

arrayOrConnection.transform = (data) => (_.isArray(data) ? data : _.map(data.edges, 'node'));

export default arrayOrConnection;
