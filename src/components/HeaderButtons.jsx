import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { HeaderButton, actionPropType } from './HeaderButton';

function HeaderButtons(props) {
	return (
		<ButtonGroup className="pull-right">
			{props.create && <HeaderButton action={props.create} glyph="plus">New</HeaderButton>}
			{props.update && <HeaderButton action={props.update} glyph="edit">Edit</HeaderButton>}
			{props.delete && <HeaderButton action={props.delete} glyph="trash">Remove</HeaderButton>}
			{props.children}
		</ButtonGroup>
	);
}

HeaderButtons.propTypes = {
	create: actionPropType,
	update: actionPropType,
	delete: actionPropType,
	children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

HeaderButtons.defaultProps = {
	create: null,
	update: null,
	delete: null,
	children: null,
};

export default HeaderButtons;
