import React from 'react';
import { ButtonGroup, Button, Glyphicon } from 'react-bootstrap';
import { browserHistory } from 'react-router';

const HeaderButton = (props) => {
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
};

const actionDef = React.PropTypes.oneOfType([
	React.PropTypes.func,
	React.PropTypes.string,
	React.PropTypes.bool,
]);
HeaderButton.propTypes = {
	action: actionDef.isRequired,
	glyph: React.PropTypes.string,
};

const HeaderButtons = (props) => (
	<ButtonGroup bsClass="pull-right">
		{props.create && <HeaderButton action={props.create} glyph="plus">New</HeaderButton>}
		{props.update && <HeaderButton action={props.update} glyph="edit">Edit</HeaderButton>}
		{props.delete && <HeaderButton action={props.delete} glyph="trash">Remove</HeaderButton>}
		{props.children}
	</ButtonGroup>
);

HeaderButtons.propTypes = {
	create: actionDef,
	update: actionDef,
	delete: actionDef,
};

export { HeaderButton, HeaderButtons };
export default HeaderButtons;
