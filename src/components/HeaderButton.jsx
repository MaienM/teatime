import _ from 'lodash';
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { browserHistory } from 'react-router';

const actionPropType = React.PropTypes.oneOfType([
	React.PropTypes.func,
	React.PropTypes.string,
	React.PropTypes.bool,
]);

function HeaderButton(props) {
	let action = props.action;
	if (_.isString(action)) {
		const url = action;
		action = () => browserHistory.push(url);
	}
	if (!_.isFunction(action)) {
		action = () => null;
	}

	return (
		<Button onClick={action}>
			{props.glyph ? <Glyphicon glyph={props.glyph} /> : null} {props.children}
		</Button>
	);
}

HeaderButton.propTypes = {
	action: actionPropType.isRequired,
	glyph: React.PropTypes.string,
	children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

HeaderButton.defaultProps = {
	glyph: null,
	children: null,
};

export default HeaderButton;
export { HeaderButton, actionPropType };